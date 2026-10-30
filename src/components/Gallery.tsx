import React, { useState, useReducer, useEffect, useCallback, useMemo } from 'react';
import { useFetchPhotos } from '../hooks/useFetchPhotos';
import {
  favouritesReducer,
  initialFavouritesState,
} from '../reducers/favouritesReducer';
import {
  getStoredFavourites,
  setStoredFavourites,
} from '../utils/localStorage';
import { SearchBar } from './SearchBar';
import { PhotoCard } from './PhotoCard';
import { LoadingSpinner } from './LoadingSpinner';
import { ErrorMessage } from './ErrorMessage';

export const Gallery: React.FC = () => {
  // 1. Consume custom hook for API data fetching
  const { photos, loading, error } = useFetchPhotos();

  // 2. Search query state
  const [searchQuery, setSearchQuery] = useState('');

  // 3. Favourites state managed strictly via useReducer (lazy initialization from localStorage)
  const [favouritesState, dispatch] = useReducer(
    favouritesReducer,
    initialFavouritesState,
    () => ({
      favouriteIds: getStoredFavourites(),
    })
  );

  // 4. Persist favourites to localStorage whenever favourites change
  useEffect(() => {
    setStoredFavourites(favouritesState.favouriteIds);
  }, [favouritesState.favouriteIds]);

  // 5. useCallback for search input change handler
  const handleSearchChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setSearchQuery(event.target.value);
    },
    []
  );

  // 6. useMemo to calculate the filtered photo list by author name (case-insensitive)
  const filteredPhotos = useMemo(() => {
    const trimmed = searchQuery.trim().toLowerCase();
    if (!trimmed) {
      return photos;
    }
    return photos.filter((photo) =>
      photo.author.toLowerCase().includes(trimmed)
    );
  }, [photos, searchQuery]);

  // 7. Toggle favourite action dispatch
  const handleToggleFavourite = useCallback(
    (id: string) => {
      const isFav = favouritesState.favouriteIds.includes(id);
      if (isFav) {
        dispatch({ type: 'REMOVE_FAVOURITE', payload: { id } });
      } else {
        dispatch({ type: 'ADD_FAVOURITE', payload: { id } });
      }
    },
    [favouritesState.favouriteIds]
  );

  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Search Bar with live author filtering */}
      <SearchBar
        query={searchQuery}
        onChange={handleSearchChange}
        resultCount={filteredPhotos.length}
        totalCount={photos.length}
      />

      {/* Loading State */}
      {loading && <LoadingSpinner />}

      {/* Error State */}
      {!loading && error && (
        <ErrorMessage
          message={error}
          onRetry={() => window.location.reload()}
        />
      )}

      {/* Empty Search Result State */}
      {!loading && !error && filteredPhotos.length === 0 && photos.length > 0 && (
        <div className="text-center py-20 px-4 bg-white border border-[#E5E5E5] rounded-2xl max-w-lg mx-auto">
          <div className="w-12 h-12 mx-auto rounded-full bg-neutral-100 flex items-center justify-center text-[#737373] mb-4">
            <svg
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="1.75"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
              />
            </svg>
          </div>
          <h3 className="text-base font-semibold text-[#171717] mb-1">
            No photos found
          </h3>
          <p className="text-sm text-[#737373] mb-5">
            No photographers matched &ldquo;{searchQuery}&rdquo;. Try another name or clear your search.
          </p>
          <button
            type="button"
            onClick={() => setSearchQuery('')}
            className="inline-flex items-center px-4 py-2 text-xs font-semibold text-[#171717] bg-[#FAFAF8] border border-[#E5E5E5] hover:bg-neutral-100 rounded-lg transition-colors duration-150"
          >
            Clear Search
          </button>
        </div>
      )}

      {/* Responsive Gallery Grid: Desktop: 4 columns, Tablet: 2 columns, Mobile: 1 column */}
      {!loading && !error && filteredPhotos.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-7">
          {filteredPhotos.map((photo) => (
            <PhotoCard
              key={photo.id}
              photo={photo}
              isFavourite={favouritesState.favouriteIds.includes(photo.id)}
              onToggleFavourite={handleToggleFavourite}
            />
          ))}
        </div>
      )}
    </section>
  );
};
