import { useState, useEffect, useCallback, useRef } from 'react';
import { ApiError } from '@/services/api';

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

interface UseApiOptions {
  immediate?: boolean;
  onSuccess?: (data: any) => void;
  onError?: (error: string) => void;
}

export function useApi<T>(
  apiCall: () => Promise<T>,
  options: UseApiOptions = {}
): UseApiState<T> & {
  execute: () => Promise<void>;
  reset: () => void;
} {
  const { immediate = true, onSuccess, onError } = options;
  const isMountedRef = useRef(true);
  
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const execute = useCallback(async () => {
    if (!isMountedRef.current) return;
    
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const result = await apiCall();
      if (isMountedRef.current) {
        setState({ data: result, loading: false, error: null });
        onSuccess?.(result);
      }
    } catch (error) {
      if (isMountedRef.current) {
        const errorMessage = error instanceof ApiError 
          ? error.message 
          : 'An unexpected error occurred';
        setState(prev => ({ ...prev, loading: false, error: errorMessage }));
        onError?.(errorMessage);
      }
    }
  }, [apiCall, onSuccess, onError]);

  const reset = useCallback(() => {
    if (isMountedRef.current) {
      setState({ data: null, loading: false, error: null });
    }
  }, []);

  useEffect(() => {
    isMountedRef.current = true;
    
    if (immediate) {
      execute();
    }

    return () => {
      isMountedRef.current = false;
    };
  }, [immediate]); // Remove execute from dependencies to prevent infinite loop

  return { ...state, execute, reset };
}

export function useAsyncOperation<T = any>(): {
  loading: boolean;
  error: string | null;
  execute: (operation: () => Promise<T>) => Promise<T | null>;
  reset: () => void;
} {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const execute = useCallback(async (operation: () => Promise<T>): Promise<T | null> => {
    if (!isMountedRef.current) return null;
    
    setLoading(true);
    setError(null);
    
    try {
      const result = await operation();
      if (isMountedRef.current) {
        setLoading(false);
      }
      return result;
    } catch (error) {
      if (isMountedRef.current) {
        const errorMessage = error instanceof ApiError 
          ? error.message 
          : 'An unexpected error occurred';
        setError(errorMessage);
        setLoading(false);
      }
      return null;
    }
  }, []);

  const reset = useCallback(() => {
    if (isMountedRef.current) {
      setLoading(false);
      setError(null);
    }
  }, []);

  return { loading, error, execute, reset };
}