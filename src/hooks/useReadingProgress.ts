import { useState, useEffect, type RefObject } from 'react';

export function useReadingProgress(articleRef: RefObject<HTMLElement | null>) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const article = articleRef.current;
    if (!article) return;

    function handleScroll() {
      if (!article) return;

      const rect = article.getBoundingClientRect();
      const articleTop = rect.top + window.scrollY;
      const articleHeight = rect.height;
      const windowHeight = window.innerHeight;
      const scrollY = window.scrollY;

      // How far through the article content the user has scrolled
      const start = articleTop;
      const end = articleTop + articleHeight - windowHeight;

      if (scrollY <= start) {
        setProgress(0);
      } else if (scrollY >= end) {
        setProgress(100);
      } else {
        setProgress(Math.round(((scrollY - start) / (end - start)) * 100));
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial calculation

    return () => window.removeEventListener('scroll', handleScroll);
  }, [articleRef]);

  return progress;
}

export function estimateReadTime(text: string, wordsPerMinute = 200): number {
  const wordCount = text.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(wordCount / wordsPerMinute));
}
