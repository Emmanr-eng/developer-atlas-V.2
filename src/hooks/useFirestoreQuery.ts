import { useState, useEffect, useCallback, useRef } from 'react';
import { handleFirestoreError, OperationType } from '../lib/firebase';

interface UseFirestoreQueryOptions<T> {
  /** Async function that returns data from Firestore */
  queryFn: () => Promise<T[]>;
  /** Fallback data when Firestore returns empty or fails */
  fallbackData?: T[];
  /** Label for error reporting */
  errorContext?: string;
  /** Whether to run immediately (default true) */
  enabled?: boolean;
}

interface UseFirestoreQueryResult<T> {
  data: T[];
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export function useFirestoreQuery<T>({
  queryFn,
  fallbackData = [],
  errorContext = 'query',
  enabled = true,
}: UseFirestoreQueryOptions<T>): UseFirestoreQueryResult<T> {
  const [data, setData] = useState<T[]>(fallbackData);
  const [loading, setLoading] = useState(enabled);
  const [error, setError] = useState<Error | null>(null);
  const mountedRef = useRef(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await queryFn();
      if (!mountedRef.current) return;

      if (result.length > 0) {
        setData(result);
      } else {
        setData(fallbackData);
      }
    } catch (err) {
      if (!mountedRef.current) return;
      handleFirestoreError(err, OperationType.LIST, errorContext);
      setError(err instanceof Error ? err : new Error(String(err)));
      setData(fallbackData);
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryFn, errorContext]);

  useEffect(() => {
    mountedRef.current = true;
    if (enabled) fetchData();
    return () => { mountedRef.current = false; };
  }, [enabled, fetchData]);

  return { data, loading, error, refetch: fetchData };
}