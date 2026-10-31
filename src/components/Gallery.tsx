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

  // 3. One-click favourite filter toggle state
  const [showFavouritesOnly, setShowFavouritesOnly] = useState(false);

  // 4. Favourites state managed strictly via useReducer (lazy initialization from localStorage)
  const [favouritesState, dispatch] = useReducer(
    favouritesReducer,
    initialFavouritesState,
    () => ({
      favouriteIds: getStoredFavourites(),
    })
  );

  // 5. Persist favourites to localStorage whenever favourites change
  useEffect(() => {
    setStoredFavourites(favouritesState.favouriteIds);
  }, [favouritesState.favouriteIds]);

  // 6. useCallback for search input change handler
  const handleSearchChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setSearchQuery(event.target.value);
    },
    []
  );

  // 7. useMemo to calculate the filtered photo list by author name and/or favourite status
  const filteredPhotos = useMemo(() => {
    const trimmed = searchQuery.trim().toLowerCase();
    let result = photos;

    // Filter by liked photos if toggled
    if (showFavouritesOnly) {
      result = result.filter((photo) =>
        favouritesState.favouriteIds.includes(photo.id)
      );
    }

    // Filter by author name search query
    if (trimmed) {
      result = result.filter((photo) =>
        photo.author.toLowerCase().includes(trimmed)
      );
    }

    return result;
  }, [photos, searchQuery, showFavouritesOnly, favouritesState.favouriteIds]);

  // 8. Toggle favourite action dispatch
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

  const likedCount = favouritesState.favouriteIds.length;

  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Search Bar with live author filtering */}
      <SearchBar
        query={searchQuery}
        onChange={handleSearchChange}
        resultCount={filteredPhotos.length}
        totalCount={showFavouritesOnly ? likedCount : photos.length}
      />

      {/* Filter Controls: All Photos vs Liked Photos */}
      {!loading && !error && photos.length > 0 && (
        <div className="flex items-center justify-center gap-3 mb-10">
          {/* All Photos Tab */}
          <button
            type="button"
            onClick={() => setShowFavouritesOnly(false)}
            aria-pressed={!showFavouritesOnly}
            className={`inline-flex items-center px-4 py-2 text-xs font-semibold rounded-full border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#6C5CE7]/40 ${
              !showFavouritesOnly
                ? 'bg-[#171717] text-white border-[#171717] shadow-xs'
                : 'bg-white text-[#737373] border-[#E5E5E5] hover:text-[#171717] hover:border-[#D4D4D4]'
            }`}
          >
            All Photos
            <span
              className={`ml-1.5 px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                !showFavouritesOnly
                  ? 'bg-white/20 text-white'
                  : 'bg-neutral-100 text-[#737373]'
              }`}
            >
              {photos.length}
            </span>
          </button>

          {/* Liked Photos Filter Button */}
          <button
            type="button"
            onClick={() => setShowFavouritesOnly((prev) => !prev)}
            aria-pressed={showFavouritesOnly}
            className={`inline-flex items-center space-x-1.5 px-4 py-2 text-xs font-semibold rounded-full border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-rose-400/40 ${
              showFavouritesOnly
                ? 'bg-rose-500 text-white border-rose-500 shadow-xs'
                : 'bg-white text-[#737373] border-[#E5E5E5] hover:text-rose-600 hover:border-rose-200 hover:bg-rose-50/40'
            }`}
          >
            <svg
              className={`w-3.5 h-3.5 transition-transform duration-200 ${
                showFavouritesOnly ? 'fill-current scale-110' : 'fill-none stroke-current'
              }`}
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
              />
            </svg>
            <span>Liked Photos</span>
            <span
              className={`ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                showFavouritesOnly
                  ? 'bg-white/25 text-white'
                  : 'bg-neutral-100 text-[#737373]'
              }`}
            >
              {likedCount}
            </span>
          </button>
        </div>
      )}

      {/* Loading State */}
      {loading && <LoadingSpinner />}

      {/* Error State */}
      {!loading && error && (
        <ErrorMessage
          message={error}
          onRetry={() => window.location.reload()}
        />
      )}

      {/* Empty Liked Photos State */}
      {!loading && !error && showFavouritesOnly && likedCount === 0 && (
        <div className="text-center py-20 px-4 bg-white border border-[#E5E5E5] rounded-2xl max-w-lg mx-auto shadow-xs">
          <div className="w-12 h-12 mx-auto rounded-full bg-rose-50 flex items-center justify-center text-rose-500 mb-4">
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
                d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
              />
            </svg>
          </div>
          <h3 className="text-base font-semibold text-[#171717] mb-1">
            No liked photos yet
          </h3>
          <p className="text-sm text-[#737373] mb-6 max-w-sm mx-auto leading-relaxed">
            Click the heart icon on any photograph to save it to your favourites and access it quickly here.
          </p>
          <button
            type="button"
            onClick={() => setShowFavouritesOnly(false)}
            className="inline-flex items-center px-4 py-2 text-xs font-semibold text-white bg-[#171717] hover:bg-[#2D2D2D] rounded-lg transition-colors duration-150 shadow-xs"
          >
            Browse All Photos
          </button>
        </div>
      )}

      {/* Empty Search Result State */}
      {!loading && !error && filteredPhotos.length === 0 && photos.length > 0 && !(showFavouritesOnly && likedCount === 0) && (
        <div className="text-center py-20 px-4 bg-white border border-[#E5E5E5] rounded-2xl max-w-lg mx-auto shadow-xs">
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
          <p className="text-sm text-[#737373] mb-5 leading-relaxed">
            {showFavouritesOnly
              ? `None of your liked photos matched "${searchQuery}".`
              : `No photographers matched "${searchQuery}". Try another name or clear your search.`}
          </p>
          <div className="flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="inline-flex items-center px-4 py-2 text-xs font-semibold text-[#171717] bg-[#FAFAF8] border border-[#E5E5E5] hover:bg-neutral-100 rounded-lg transition-colors duration-150"
            >
              Clear Search
            </button>
            {showFavouritesOnly && (
              <button
                type="button"
                onClick={() => setShowFavouritesOnly(false)}
                className="inline-flex items-center px-4 py-2 text-xs font-semibold text-white bg-[#171717] hover:bg-[#2D2D2D] rounded-lg transition-colors duration-150"
              >
                View All Photos
              </button>
            )}
          </div>
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
