'use client';

import { useEffect, useState } from 'react';
import { paddleService } from '@/lib/paddle';

export function usePaddle() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializePaddle = async () => {
      try {
        setIsLoading(true);
        setError(null);
        await paddleService.initialize();
        setIsLoaded(true);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to initialize Paddle');
        console.error('Paddle initialization error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    initializePaddle();
  }, []);

  return {
    isLoaded,
    isLoading,
    error,
    paddleService: isLoaded ? paddleService : null,
  };
}

