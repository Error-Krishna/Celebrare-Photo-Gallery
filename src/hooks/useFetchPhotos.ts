import { useState, useEffect } from 'react';
import type { Photo } from '../types/photo';
import { PICSUM_API_URL } from '../config/api';



export interface UseFetchPhotosResult {
  photos: Photo[];
  loading: boolean;
  error: string | null;
}

/**
 * Custom hook to fetch 30 photos from Picsum Photos API.
 * Uses native Fetch API inside useEffect with AbortController for clean unmounting.
 * 
 * Returns exactly: { photos, loading, error }
 */
export function useFetchPhotos(): UseFetchPhotosResult {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchPhotos() {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(PICSUM_API_URL, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(
            `Failed to fetch photos: Server responded with HTTP ${response.status}`
          );
        }

        const data = (await response.json()) as Photo[];
        setPhotos(data);
      } catch (err: unknown) {
        // If aborted during unmount, ignore state updates
        if (err instanceof Error && err.name === 'AbortError') {
          return;
        }

        const errorMessage =
          err instanceof Error
            ? err.message
            : 'An unexpected error occurred while loading photos.';
        setError(errorMessage);
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    fetchPhotos();

    // Cleanup: cancel pending request if component unmounts
    return () => {
      controller.abort();
    };
  }, []);

  return {
    photos,
    loading,
    error,
  };
}
