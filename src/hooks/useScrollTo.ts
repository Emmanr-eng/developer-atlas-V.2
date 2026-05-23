import { useCallback } from 'react';

/**
 * Returns a stable scroll-to-section function.
 * Replaces all the inline `document.getElementById(id)?.scrollIntoView(...)` calls.
 */
export function useScrollTo() {
  return useCallback((id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  }, []);
}