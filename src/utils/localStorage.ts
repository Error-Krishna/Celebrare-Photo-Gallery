const FAVOURITES_STORAGE_KEY = 'celebrare_frame_favourites';

/**
 * Safely retrieves stored favourite photo IDs from browser localStorage.
 * Handles missing data, JSON parsing errors, and malformed types safely.
 */
export function getStoredFavourites(): string[] {
  if (typeof window === 'undefined' || !window.localStorage) {
    return [];
  }

  try {
    const rawData = window.localStorage.getItem(FAVOURITES_STORAGE_KEY);
    if (!rawData) {
      return [];
    }

    const parsed = JSON.parse(rawData);
    if (Array.isArray(parsed) && parsed.every((id) => typeof id === 'string')) {
      return parsed;
    }

    return [];
  } catch (error) {
    console.warn('Failed to parse favourites from localStorage:', error);
    return [];
  }
}

/**
 * Safely persists favourite photo IDs into browser localStorage.
 * Handles storage quota exceptions and non-browser environments.
 */
export function setStoredFavourites(favouriteIds: string[]): void {
  if (typeof window === 'undefined' || !window.localStorage) {
    return;
  }

  try {
    window.localStorage.setItem(
      FAVOURITES_STORAGE_KEY,
      JSON.stringify(favouriteIds)
    );
  } catch (error) {
    console.error('Failed to save favourites to localStorage:', error);
  }
}
