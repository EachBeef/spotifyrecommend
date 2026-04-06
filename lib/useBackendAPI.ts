import { useState, useCallback } from 'react';
import { BACKEND_URL } from '@/lib/config';

interface UseBackendAPIOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  headers?: Record<string, string>;
}

export function useBackendAPI<T = any>(
  endpoint: string,
  options: UseBackendAPIOptions = {}
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const request = useCallback(
    async (body?: any) => {
      setLoading(true);
      setError(null);

      try {
        const url = `${BACKEND_URL}${endpoint}`;
        const fetchOptions: RequestInit = {
          method: options.method || 'GET',
          headers: {
            'Content-Type': 'application/json',
            ...options.headers,
          },
        };

        if (body && (options.method === 'POST' || options.method === 'PUT')) {
          fetchOptions.body = JSON.stringify(body);
        }

        const response = await fetch(url, fetchOptions);

        if (!response.ok) {
          throw new Error(`API Error: ${response.status} ${response.statusText}`);
        }

        const result = await response.json();
        setData(result);
        return result;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
        setError(errorMessage);
        console.error('Backend API Error:', errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [endpoint, options]
  );

  return { data, loading, error, request };
}
