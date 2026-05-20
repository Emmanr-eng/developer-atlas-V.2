import { useState, useEffect, useCallback } from 'react';

const RATE_LIMIT_KEY = 'atlas_contact_last_submit';
const COOLDOWN_SECONDS = 60;

export function useRateLimit() {
  const [remainingSeconds, setRemainingSeconds] = useState(0);

  const getRemaining = useCallback(() => {
    const lastSubmit = sessionStorage.getItem(RATE_LIMIT_KEY);
    if (!lastSubmit) return 0;

    const elapsed = Math.floor((Date.now() - parseInt(lastSubmit, 10)) / 1000);
    return Math.max(0, COOLDOWN_SECONDS - elapsed);
  }, []);

  useEffect(() => {
    setRemainingSeconds(getRemaining());

    const interval = setInterval(() => {
      const remaining = getRemaining();
      setRemainingSeconds(remaining);
      if (remaining <= 0) clearInterval(interval);
    }, 1000);

    return () => clearInterval(interval);
  }, [getRemaining]);

  const recordSubmission = useCallback(() => {
    sessionStorage.setItem(RATE_LIMIT_KEY, Date.now().toString());
    setRemainingSeconds(COOLDOWN_SECONDS);

    // Start countdown
    const interval = setInterval(() => {
      const remaining = getRemaining();
      setRemainingSeconds(remaining);
      if (remaining <= 0) clearInterval(interval);
    }, 1000);
  }, [getRemaining]);

  return {
    isRateLimited: remainingSeconds > 0,
    remainingSeconds,
    recordSubmission,
  };
}
