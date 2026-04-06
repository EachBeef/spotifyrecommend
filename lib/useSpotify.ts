import { useState, useCallback } from 'react';
import { BACKEND_URL } from '@/lib/config';

interface SpotifyTrack {
  name: string;
  artist: string;
  image: string;
  spotify_url: string;
  id: string;
}

export function useSpotify() {
  const [track, setTrack] = useState<SpotifyTrack | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchTrack = useCallback(async (query: string) => {
    if (!query.trim()) {
      setError('Digite o nome de uma música');
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${BACKEND_URL}/search/spotify?query=${encodeURIComponent(query)}`);

      if (!response.ok) {
        throw new Error('Música não encontrada no Spotify');
      }

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      setTrack(data);
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao buscar música';
      setError(errorMessage);
      console.error('Spotify Search Error:', errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const clearTrack = useCallback(() => {
    setTrack(null);
    setError(null);
  }, []);

  return { track, loading, error, searchTrack, clearTrack };
}
