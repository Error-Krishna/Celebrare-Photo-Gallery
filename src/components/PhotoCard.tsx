import React, { useState } from 'react';
import type { Photo } from '../types/photo';

interface PhotoCardProps {
  photo: Photo;
  isFavourite: boolean;
  onToggleFavourite: (id: string) => void;
}

export const PhotoCard: React.FC<PhotoCardProps> = ({
  photo,
  isFavourite,
  onToggleFavourite,
}) => {
  const [imageError, setImageError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Optimized thumbnail URL from Picsum CDN to reduce bandwidth and speed up rendering
  const imageUrl = `https://picsum.photos/id/${photo.id}/600/450`;

  return (
    <article className="group bg-white rounded-2xl overflow-hidden border border-[#E5E5E5] transition-all duration-300 hover:shadow-lg hover:border-[#D4D4D4] flex flex-col justify-between">
      {/* Photo Container */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#F5F5F3]">
        {/* Skeleton shimmer before loaded */}
        {!isLoaded && !imageError && (
          <div className="absolute inset-0 bg-neutral-200 animate-pulse" />
        )}

        {!imageError ? (
          <img
            src={imageUrl}
            alt={`Curated photograph by ${photo.author}`}
            loading="lazy"
            decoding="async"
            onLoad={() => setIsLoaded(true)}
            onError={() => setImageError(true)}
            className={`w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105 ${
              isLoaded ? 'opacity-100' : 'opacity-0'
            }`}
          />
        ) : (
          /* Graceful Fallback if image fails */
          <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center text-[#737373]">
            <svg
              className="w-10 h-10 mb-2 text-[#A3A3A3]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
              />
            </svg>
            <span className="text-xs font-medium">Image preview unavailable</span>
          </div>
        )}

        {/* Floating subtle overlay gradient for contrast on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      </div>

      {/* Card Info & Favourite Action */}
      <div className="p-4 flex items-center justify-between gap-3 bg-white">
        <div className="min-w-0 flex-1">
          <p className="text-xs uppercase tracking-wider text-[#A3A3A3] font-medium truncate">
            Photographer
          </p>
          <h3
            className="text-sm font-semibold text-[#171717] truncate"
            title={photo.author}
          >
            {photo.author}
          </h3>
        </div>

        {/* Heart-shaped favourite button */}
        <button
          type="button"
          onClick={() => onToggleFavourite(photo.id)}
          aria-label={
            isFavourite
              ? `Remove photo by ${photo.author} from favourites`
              : `Add photo by ${photo.author} to favourites`
          }
          aria-pressed={isFavourite}
          className={`flex-shrink-0 p-2.5 rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#6C5CE7] ${
            isFavourite
              ? 'bg-rose-50 text-rose-500 scale-105'
              : 'text-[#737373] hover:text-[#171717] hover:bg-[#F5F5F3]'
          }`}
        >
          {isFavourite ? (
            /* Filled Heart SVG */
            <svg
              className="w-5 h-5 fill-rose-500 text-rose-500 transition-transform duration-200 active:scale-90"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="1.5"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
              />
            </svg>
          ) : (
            /* Outlined Heart SVG */
            <svg
              className="w-5 h-5 transition-transform duration-200 active:scale-90"
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
          )}
        </button>
      </div>
    </article>
  );
};
