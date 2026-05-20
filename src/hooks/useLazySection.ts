import { useState, useEffect, useRef, type RefObject } from 'react';

interface UseLazySectionOptions {
  rootMargin?: string;  // How far before viewport to trigger
  threshold?: number;
}

interface UseLazySectionResult {
  ref: RefObject<HTMLDivElement | null>;
  hasEntered: boolean;
}

export function useLazySection(options: UseLazySectionOptions = {}): UseLazySectionResult {
  const { rootMargin = '200px 0px', threshold = 0 } = options;
  const ref = useRef<HTMLDivElement>(null);
  const [hasEntered, setHasEntered] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element || hasEntered) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasEntered(true);
          observer.disconnect(); // Once visible, stay mounted forever
        }
      },
      { rootMargin, threshold }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [hasEntered, rootMargin, threshold]);

  return { ref, hasEntered };
}
