# Frame — Celebrare Photo Gallery

A responsive, high-performance photo gallery web application built with **React**, **TypeScript**, **Vite**, and **Tailwind CSS**. Developed independently as part of the **Celebrare Frontend Internship Prescreening Assignment**.

---

## 1. Project Overview

**Frame** is an editorial-style photo gallery interface designed to showcase curated photography fetched directly from the Picsum Photos API. The application emphasizes clean React architecture, strict adherence to React Hooks conventions, type safety with TypeScript, and a modern minimal user interface.

Key requirements fulfilled:
- Fetches exactly 30 photographs from the Picsum Photos API.
- Implements a responsive layout transitioning gracefully from 4 columns on desktop to 2 columns on tablet and 1 column on mobile.
- Instant, client-side author search without extraneous network requests.
- Complete favourite photo marking and unmarking with persistence in `localStorage`.
- Favourite state managed strictly via `useReducer`.
- Custom `useFetchPhotos` hook with lifecycle cleanup (`AbortController`).
- Search handler optimized with `useCallback` and filtered list computed with `useMemo`.
- Polished loading spinner, comprehensive error display, and minimal empty state.

---

## 2. Features

- **Picsum API Integration**: Fetches 30 high-resolution curated photographs on initial mount using the native Fetch API.
- **Custom Hook (`useFetchPhotos`)**: Encapsulates network communication, loading state, error catching, and cleanup logic.
- **Editorial Responsive Grid**: Tailwind CSS powered grid system featuring:
  - Desktop (≥1024px): 4 columns
  - Tablet (≥640px): 2 columns
  - Mobile (<640px): 1 column
- **Real-Time Author Search**: Fast, client-side case-insensitive search filtering across all 30 loaded images with no page reloads and no additional network requests.
- **Heart-Shaped Favourite Button**: Toggle favourite status on any photograph with clear visual feedback (outlined vs. filled warm rose heart) and accessible `aria-label` tags.
- **State Management with `useReducer`**: Predictable, immutable state updates for favourite items using action dispatching (`ADD_FAVOURITE`, `REMOVE_FAVOURITE`, `INITIALIZE_FAVOURITES`).
- **Persistent Storage**: Automatic bidirectional synchronization with browser `localStorage`, persisting favourites across browser reloads while handling corrupted data gracefully.
- **Memoized Performance**:
  - `useCallback` for search input event handler.
  - `useMemo` to recompute filtered photo array only when search query or photo array changes.
- **Robust UI States**:
  - Animated CSS loading spinner while fetching.
  - Error banner with failure explanation and reload capability.
  - Contextual "No photos found" state when search produces no author matches.

---

## 3. Tech Stack

- **Core Framework**: [React 19](https://react.dev/)
- **Build Tool**: [Vite 8](https://vite.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Network Client**: Native Browser `fetch` API with `AbortController`
- **Persistence**: Browser `localStorage` API
- **Testing**: Built-in Node.js Test Runner (`node:test`, `node:assert`) with zero extra test dependencies

---

## 4. Project Structure

```
Celebrare-Photo-Gallery/
│
├── public/
│   ├── favicon.svg              # Minimal SVG favicon
│   └── icons.svg
│
├── src/
│   ├── assets/                  # Static assets
│   ├── components/
│   │   ├── Header.tsx           # Application brand bar ("Frame — A collection of moments")
│   │   ├── SearchBar.tsx        # Search input with inline SVG icon & live counter
│   │   ├── Gallery.tsx          # Main gallery container & state coordinator
│   │   ├── PhotoCard.tsx        # Individual photo card with image, author, and favourite toggle
│   │   ├── LoadingSpinner.tsx   # Minimal CSS animated loading spinner
│   │   └── ErrorMessage.tsx     # Error presentation component with retry option
│   │
│   ├── hooks/
│   │   └── useFetchPhotos.ts    # Custom hook encapsulating Picsum API fetching logic
│   │
│   ├── reducers/
│   │   └── favouritesReducer.ts # Reducer managing ADD_FAVOURITE, REMOVE_FAVOURITE, etc.
│   │
│   ├── utils/
│   │   └── localStorage.ts      # Safe localStorage read/write helpers with error handling
│   │
│   ├── types/
│   │   └── photo.ts             # TypeScript interface for Picsum photo entity
│   │
│   ├── App.tsx                  # Root application component and editorial hero section
│   ├── main.tsx                 # React DOM mount point
│   └── index.css                # Tailwind CSS imports and base typography styles
│
├── tests/
│   ├── favouritesReducer.test.ts# Unit tests for favourites reducer immutability & actions
│   └── localStorage.test.ts     # Unit tests for storage serialization & resilience
│
├── index.html                   # HTML entry point with preconnect tags
├── package.json                 # Dependency definitions and scripts
├── tsconfig.json                # TypeScript project configuration
├── tsconfig.app.json            # Application TypeScript configuration
└── vite.config.ts               # Vite configuration with Tailwind CSS plugin
```

---

## 5. Installation & Setup

### Prerequisites

Ensure you have Node.js (v18+ recommended, v24+ tested) and npm installed.

### Clone and Run

```bash
# Clone the repository
git clone https://github.com/Error-Krishna/celebrare-photo-gallery.git

# Navigate into the project directory
cd celebrare-photo-gallery

# Install dependencies
npm install

# Start the Vite development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Available Scripts

- `npm run dev`: Starts the local Vite development server with Hot Module Replacement (HMR).
- `npm run build`: Type-checks with TypeScript compiler (`tsc -b`) and bundles production assets with Vite.
- `npm run preview`: Locally previews the production build.
- `npm run lint`: Runs code linter (`oxlint`).
- `npm test`: Executes native unit tests for reducers and utilities.

---

## 6. API Reference

- **Endpoint**: `https://picsum.photos/v2/list?limit=30`
- **Method**: `GET`
- **Response Format**: JSON array of photo objects:
  ```json
  [
    {
      "id": "0",
      "author": "Alejandro Escamilla",
      "width": 5000,
      "height": 3333,
      "url": "https://unsplash.com/photos/yC-Yzbqy7PY",
      "download_url": "https://picsum.photos/id/0/5000/3333"
    }
  ]
  ```

---

## 7. Key React Concepts & Design Decisions

### 1. Why `useReducer` for Favourites?
Managing favourites involves distinct, predictable transitions (`ADD_FAVOURITE`, `REMOVE_FAVOURITE`, `INITIALIZE_FAVOURITES`). Using `useReducer`:
- Consolidates state transition logic into a single, pure, testable function.
- Ensures immutability: adding or removing items produces a fresh state object without modifying existing arrays.
- Eliminates scattered state update logic across event handlers.
- Separates UI event triggers from business logic through explicit action dispatching.

### 2. Why a Custom Hook (`useFetchPhotos`)?
- **Separation of Concerns**: UI components (`Gallery`, `PhotoCard`) remain declarative view layers without knowledge of network protocols or URLs.
- **Encapsulated Lifecycle Management**: Request state (`loading`, `error`, `photos`) and cancellation (`AbortController`) are self-contained.
- **Reusability & Testability**: The data-fetching logic can be reused or unit-tested in isolation without mounting UI components.

### 3. Why `useCallback` for the Search Handler?
- `handleSearchChange` is passed down as a prop to `<SearchBar />`.
- Wrapping the event handler in `useCallback` provides a stable function reference across component re-renders, preventing unnecessary child re-renders caused by new function instances.

### 4. Why `useMemo` for Filtered Photos?
- Filtering an array of 30 photos with string operations (`toLowerCase()`, `includes()`) is fast, but recalculating on every unrelated render cycle is redundant.
- `useMemo` ensures that filtering only executes when `searchQuery` or the `photos` list actually changes. If other state changes (such as toggling a favourite on a photo), the filtered array reference is preserved.

### 5. How `localStorage` Persistence Works
- **Lazy Initialization**: `useReducer` utilizes lazy initialization (`() => ({ favouriteIds: getStoredFavourites() })`) so `localStorage` is read only once during component mount.
- **Defensive Parsing**: If `localStorage` holds corrupted JSON or invalid data types, `getStoredFavourites` catches the error and safely falls back to `[]`, preventing application crashes.
- **Reactive Synchronization**: A dedicated `useEffect` watches `favouritesState.favouriteIds` and automatically updates `localStorage` whenever an item is added or removed.

---

## 8. Assignment Information

- **Organization**: Celebrare
- **Role**: Frontend Internship Prescreening Assignment
- **Candidate**: Krishna Goyal
- **Repository**: [https://github.com/Error-Krishna/celebrare-photo-gallery](https://github.com/Error-Krishna/celebrare-photo-gallery)
