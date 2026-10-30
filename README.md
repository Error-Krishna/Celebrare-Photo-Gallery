# Frame — Celebrare Photo Gallery

[![CI Quality Pipeline](https://github.com/Error-Krishna/Celebrare-Photo-Gallery/actions/workflows/ci.yml/badge.svg)](https://github.com/Error-Krishna/Celebrare-Photo-Gallery/actions/workflows/ci.yml)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x%20%2F%207.x-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)](https://vite.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Pre-commit](https://img.shields.io/badge/pre--commit-Husky%20%2B%20lint--staged-brightgreen)](https://github.com/typicode/husky)

> A production-engineered, responsive photo gallery web application built with **React 19**, **TypeScript**, **Vite 8**, and **Tailwind CSS v4** for the **Celebrare Frontend Internship Prescreening Assignment**.

---

## Table of Contents

- [1. Project Overview](#1-project-overview)
- [2. Live Deployment & Repository](#2-live-deployment--repository)
- [3. Key Features](#3-key-features)
- [4. Technology Stack & Rationale](#4-technology-stack--rationale)
- [5. Project Architecture & Data Flow](#5-project-architecture--data-flow)
- [6. Project Directory Structure](#6-project-directory-structure)
- [7. Local Installation & Development](#7-local-installation--development)
- [8. Quality Engineering & Automation](#8-quality-engineering--automation)
  - [Pre-Commit Quality Gates (Husky + lint-staged)](#pre-commit-quality-gates-husky--lint-staged)
  - [Continuous Integration (GitHub Actions)](#continuous-integration-github-actions)
- [9. Production Deployment (Vercel)](#9-production-deployment-vercel)
- [10. React Hooks & Architecture Decisions](#10-react-hooks--architecture-decisions)
- [11. Testing & Verification](#11-testing--verification)
- [12. Troubleshooting Guide](#12-troubleshooting-guide)
- [13. Comprehensive Technical Study Guide](#13-comprehensive-technical-study-guide)
- [14. Assignment Attribution](#14-assignment-attribution)

---

## 1. Project Overview

**Frame** is an editorial-style photo gallery interface designed to showcase curated photography fetched directly from the Picsum Photos API. The application is built with a focus on React fundamentals, clean architectural separation of concerns, automated quality gates, and production-grade DevOps engineering.

### Assignment Requirements Matrix

| Requirement | Implementation | Location |
| :--- | :--- | :--- |
| **Fetch 30 photos** | Picsum API (`limit=30`) | [`src/hooks/useFetchPhotos.ts`](src/hooks/useFetchPhotos.ts) |
| **Responsive Grid** | Desktop: 4 cols, Tablet: 2 cols, Mobile: 1 col | [`src/components/Gallery.tsx`](src/components/Gallery.tsx) |
| **Live Author Search** | Case-insensitive filter, no network calls | [`src/components/SearchBar.tsx`](src/components/SearchBar.tsx) |
| **Favourite Toggle** | Heart icon, accessible aria controls | [`src/components/PhotoCard.tsx`](src/components/PhotoCard.tsx) |
| **Persistence** | Synchronized with `localStorage` defensively | [`src/utils/localStorage.ts`](src/utils/localStorage.ts) |
| **State via useReducer** | Immutable actions: `ADD_FAVOURITE`, `REMOVE_FAVOURITE` | [`src/reducers/favouritesReducer.ts`](src/reducers/favouritesReducer.ts) |
| **Custom Fetch Hook** | `useFetchPhotos` with `AbortController` cancellation | [`src/hooks/useFetchPhotos.ts`](src/hooks/useFetchPhotos.ts) |
| **useCallback** | Search change handler memoized | [`src/components/Gallery.tsx`](src/components/Gallery.tsx) |
| **useMemo** | Filtered author photo computation | [`src/components/Gallery.tsx`](src/components/Gallery.tsx) |
| **Loading & Error States** | CSS animated spinner, error card with retry | [`src/components/LoadingSpinner.tsx`](src/components/LoadingSpinner.tsx), [`ErrorMessage.tsx`](src/components/ErrorMessage.tsx) |
| **Zero External UI Libs** | Strict pure Tailwind CSS v4 styling | [`src/index.css`](src/index.css) |

---

## 2. Live Deployment & Repository

- **GitHub Repository**: [https://github.com/Error-Krishna/Celebrare-Photo-Gallery](https://github.com/Error-Krishna/Celebrare-Photo-Gallery)
- **CI/CD Pipeline Status**: [GitHub Actions Runs](https://github.com/Error-Krishna/Celebrare-Photo-Gallery/actions)
- **Production Deployment Configuration**: Configured with `vercel.json` for zero-configuration deployment to [Vercel](https://vercel.com).

---

## 3. Key Features

- **Editorial Photography Grid**: Displays 30 high-resolution photos with aspect ratio preservation (`aspect-[4/3]`) and smooth hover zoom effects.
- **Client-Side Real-Time Search**: Sub-millisecond author search filtering over the fetched 30 items without additional API round-trips.
- **Predictable State Management**: Uses a pure reducer (`favouritesReducer`) with strict immutability to manage favourite photo IDs.
- **Resilient Offline Persistence**: Favourites are read synchronously on mount via a lazy initializer (`() => ({ favouriteIds: getStoredFavourites() })`) and written via reactive effects, complete with corrupted-JSON recovery.
- **Network Lifecycle Protection**: Uses native browser `fetch` combined with `AbortController` to cancel pending HTTP requests if the component unmounts.
- **Responsive Layout**: Tailored for all viewport widths:
  - Mobile (`<640px`): 1 column
  - Tablet (`≥640px`): 2 columns
  - Desktop (`≥1024px`): 4 columns

---

## 4. Technology Stack & Rationale

- **React 19**: Modern functional components, strict hook rules, and concurrent-safe state primitives.
- **TypeScript**: Strict type definitions for Picsum API contracts, reducer actions, and component props without `any` bypasses.
- **Vite 8**: Next-generation lightning-fast frontend tooling with instant HMR and Rollup-based tree-shaken production bundles.
- **Tailwind CSS v4**: High-performance CSS engine with direct Vite integration (`@tailwindcss/vite`), eliminating external runtime CSS weight.
- **Husky & lint-staged**: Git pre-commit hooks enforcing static analysis, typechecking, and unit tests before any commit is written.
- **GitHub Actions**: Automated CI pipeline verifying code quality on every push and pull request targeting `main`.
- **Node.js Native Test Runner (`node:test`, `node:assert`)**: High-performance unit testing requiring zero external testing framework dependencies.

---

## 5. Project Architecture & Data Flow

```
[Picsum Photos API: /v2/list?limit=30]
                 │
                 ▼
       useFetchPhotos Hook
   (AbortController + Native fetch)
                 │
                 ├── loading state ──► <LoadingSpinner />
                 ├── error state   ──► <ErrorMessage />
                 │
                 ▼
         <Gallery Component> ◄─── User Types Query
                 │
                 ├── useCallback (handleSearchChange)
                 ├── useMemo (filteredPhotos = photos.filter(...))
                 │
                 ├── useReducer (favouritesReducer)
                 │       ▲
                 │       ├── Lazy Init: getStoredFavourites()
                 │       └── Auto-Sync: setStoredFavourites()
                 │
                 ▼
     <PhotoCard Grid (Responsive)>
         ├── Author name
         ├── Aspect-ratio curated image
         └── Outlined/Filled Heart Favourite Button
```

---

## 6. Project Directory Structure

```
Celebrare-Photo-Gallery/
│
├── .github/
│   └── workflows/
│       └── ci.yml               # Automated GitHub Actions CI pipeline
│
├── .husky/
│   └── pre-commit               # Git pre-commit hook (lint-staged + typecheck + test)
│
├── docs/
│   ├── FRAME_COMPLETE_PROJECT_STUDY_GUIDE.md  # Complete study handbook (Markdown)
│   └── FRAME_COMPLETE_PROJECT_STUDY_GUIDE.pdf # Downloadable study handbook (PDF)
│
├── public/
│   ├── favicon.svg              # SVG application favicon
│   └── icons.svg                # Icon definitions
│
├── src/
│   ├── assets/                  # Static media assets
│   ├── components/
│   │   ├── Header.tsx           # Minimal brand header ("Frame")
│   │   ├── SearchBar.tsx        # Search input with live results indicator
│   │   ├── Gallery.tsx          # Master gallery coordinator component
│   │   ├── PhotoCard.tsx        # Photo presentation & favourite toggle card
│   │   ├── LoadingSpinner.tsx   # Animated CSS loading spinner
│   │   └── ErrorMessage.tsx     # Error fallback card with retry trigger
│   │
│   ├── hooks/
│   │   └── useFetchPhotos.ts    # Custom data fetching hook with AbortController
│   │
│   ├── reducers/
│   │   └── favouritesReducer.ts # Pure state reducer for ADD/REMOVE/INIT favourites
│   │
│   ├── utils/
│   │   └── localStorage.ts      # Defensive localStorage read/write helpers
│   │
│   ├── types/
│   │   └── photo.ts             # TypeScript interface for Picsum API schema
│   │
│   ├── App.tsx                  # Root layout and editorial hero presentation
│   ├── main.tsx                 # DOM mounting entry point
│   └── index.css                # Tailwind CSS v4 setup & typography
│
├── tests/
│   ├── favouritesReducer.test.ts# Unit tests for reducer actions & immutability
│   └── localStorage.test.ts     # Unit tests for storage serialization & errors
│
├── .gitignore                   # Git ignore specifications
├── .lintstagedrc.json           # Configuration for lint-staged
├── .oxlintrc.json               # Oxlint linter configuration
├── index.html                   # HTML entry point with CDN preconnects
├── package.json                 # Project dependencies and script definitions
├── package-lock.json            # Deterministic dependency lockfile
├── tsconfig.json                # TypeScript project references
├── tsconfig.app.json            # Application TypeScript compilation config
├── tsconfig.node.json           # Tooling TypeScript config
├── vercel.json                  # Production deployment specifications
└── vite.config.ts               # Vite build and Tailwind plugin configuration
```

---

## 7. Local Installation & Development

### Prerequisites

- **Node.js**: `v18.0.0+` (Tested on `v24.19.0`)
- **npm**: `v9.0.0+` (Tested on `v11.17.0`)

### Quickstart

```bash
# 1. Clone the repository
git clone https://github.com/Error-Krishna/Celebrare-Photo-Gallery.git

# 2. Enter project directory
cd Celebrare-Photo-Gallery

# 3. Install dependencies deterministically
npm install

# 4. Start local development server
npm run dev
```

The application will be accessible at [http://localhost:5173](http://localhost:5173).

### Available NPM Scripts

| Script | Command | Purpose |
| :--- | :--- | :--- |
| `npm run dev` | `vite` | Starts local HMR dev server |
| `npm run build` | `tsc -b && vite build` | Typechecks and produces production build in `dist/` |
| `npm run lint` | `oxlint` | Runs fast Rust-based linter across source files |
| `npm run typecheck` | `tsc --noEmit` | Performs comprehensive TypeScript static type analysis |
| `npm test` | `node --test tests/*.test.ts` | Runs native unit tests |
| `npm run check` | Lint + Typecheck + Test + Build | Comprehensive local validation suite |
| `npm run preview` | `vite preview` | Serves production build locally |

---

## 8. Quality Engineering & Automation

### Pre-Commit Quality Gates (Husky + lint-staged)

Every `git commit` triggers `.husky/pre-commit` to prevent regressions:

1. **`npx lint-staged`**: Runs `oxlint` against only staged `.ts`, `.tsx`, `.js`, `.jsx` files.
2. **`npm run typecheck`**: Runs `tsc --noEmit` across the entire project.
3. **`npm test`**: Executes the 12-test unit test suite (`favouritesReducer` and `localStorage`).

If any check fails, the commit is immediately blocked, protecting `main` from broken code.

### Continuous Integration (GitHub Actions)

The repository runs `.github/workflows/ci.yml` on every push to `main` and on all pull requests:
- **Environment**: Ubuntu Latest with Node.js 24.
- **Dependency Caching**: Automatic caching of `~/.npm` based on `package-lock.json`.
- **Pipeline Stages**: `npm ci` ➔ `oxlint` ➔ `tsc --noEmit` ➔ `node --test` ➔ `vite build`.

---

## 9. Production Deployment (Vercel)

The project includes [`vercel.json`](vercel.json) configuring the framework preset to Vite, the build command to `npm run build`, and the output directory to `dist`.

### Deploying to Vercel

#### Method A: Vercel Dashboard (Recommended)
1. Go to [https://vercel.com/new](https://vercel.com/new).
2. Import the GitHub repository: `Error-Krishna/Celebrare-Photo-Gallery`.
3. Vercel automatically detects Vite settings from `vercel.json`.
4. Click **Deploy**. Any future push to `main` automatically deploys a new production release.

#### Method B: Vercel CLI
```bash
npx vercel --prod
```

---

## 10. React Hooks & Architecture Decisions

### 1. `useReducer` for Favourites State
- **Rationale**: Toggling favourites represents discrete, predictable transitions (`ADD_FAVOURITE`, `REMOVE_FAVOURITE`). Consolidating these transitions into a pure reducer eliminates scattered logic, prevents accidental state mutation, and ensures testability.
- **No `useState`**: Strict adherence to assignment constraints.

### 2. Custom Hook (`useFetchPhotos`)
- **Rationale**: Separates networking concerns from UI components.
- **AbortController**: Cleanly prevents memory leaks and stale state updates when components unmount or remount under React StrictMode.

### 3. `useCallback` for Search Input Handler
- **Rationale**: Retains referential equality for `handleSearchChange` between render cycles, ensuring `<SearchBar />` does not receive new callback instances on unrelated re-renders.

### 4. `useMemo` for Filtered Photo List
- **Rationale**: Recomputes the filtered array only when `searchQuery` or `photos` changes. When a user favourites or unfavourites a photo, `Gallery` re-renders, but `useMemo` preserves the existing filtered reference without re-running string operations.

### 5. Synchronous Lazy Storage Initialization
- **Pattern**: `useReducer(favouritesReducer, initialFavouritesState, () => ({ favouriteIds: getStoredFavourites() }))`
- **Rationale**: Reads `localStorage` synchronously during component initialization, preventing UI flicker caused by asynchronous or post-mount updates.

---

## 11. Testing & Verification

The project includes comprehensive unit tests run with Node.js's native test runner (`node:test`):

```bash
npm test
```

### Test Suite Overview

- [`tests/favouritesReducer.test.ts`](tests/favouritesReducer.test.ts):
  - Adding photo ID to empty favourites.
  - Duplicate photo ID prevention.
  - Removing existing photo ID.
  - Handling removal of non-existent photo ID gracefully.
  - Initializing favourites from external list.
  - Immutability preservation (original state unchanged).
  - Graceful fallback for unknown action types.
- [`tests/localStorage.test.ts`](tests/localStorage.test.ts):
  - Reading from empty storage.
  - Writing and reading favourite photo IDs.
  - Resilient recovery from corrupted JSON (returns `[]` instead of throwing).
  - Type-checking stored JSON (verifies array of strings).
  - SSR / undefined `window` safety.

---

## 12. Troubleshooting Guide

| Issue | Cause | Solution |
| :--- | :--- | :--- |
| **API request fails** | Network offline or rate limit | Verify internet connection; check [Picsum status](https://picsum.photos) |
| **Commit blocked by Husky** | Typecheck or test failure | Run `npm run check` locally to inspect and resolve errors before committing |
| **Blank photos in grid** | Image CDN blocked | Check browser content blocker; Fastly CDN preconnect is included in `index.html` |
| **Favourites reset after refresh** | Browser storage disabled | Ensure third-party cookies / local storage permissions are enabled in browser |

---

## 13. Comprehensive Technical Study Guide

For complete, in-depth technical documentation covering every line of code, lifecycle diagrams, data flowcharts, and 120+ technical interview questions with answers, please consult the project study guide:

- **Markdown Version**: [`docs/FRAME_COMPLETE_PROJECT_STUDY_GUIDE.md`](docs/FRAME_COMPLETE_PROJECT_STUDY_GUIDE.md)
- **Downloadable PDF Version**: [`docs/FRAME_COMPLETE_PROJECT_STUDY_GUIDE.pdf`](docs/FRAME_COMPLETE_PROJECT_STUDY_GUIDE.pdf)

> **Maintenance Note**: Whenever architectural, structural, or state management code changes, re-run the documentation build script to synchronize the PDF handbook.

---

## 14. Assignment Attribution

- **Candidate**: Krishna Goyal
- **Project**: Frame — Celebrare Photo Gallery
- **Assignment**: Celebrare Frontend Internship Prescreening Assignment
- **Submission Deadline**: 1 November 2026, 8:00 PM IST
