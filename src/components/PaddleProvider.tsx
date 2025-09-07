'use client';

import { useEffect } from 'react';
import { usePaddle } from '@/hooks/usePaddle';

interface PaddleProviderProps {
  children: React.ReactNode;
}

export function PaddleProvider({ children }: PaddleProviderProps) {
  const { isLoaded, error } = usePaddle();

  useEffect(() => {
    if (error) {
      console.error('Paddle initialization error:', error);
    }
  }, [error]);

  return <>{children}</>;
}


