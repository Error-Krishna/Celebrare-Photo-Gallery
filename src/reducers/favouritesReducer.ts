export interface FavouritesState {
  favouriteIds: string[];
}

export type FavouritesAction =
  | { type: 'ADD_FAVOURITE'; payload: { id: string } }
  | { type: 'REMOVE_FAVOURITE'; payload: { id: string } }
  | { type: 'INITIALIZE_FAVOURITES'; payload: { ids: string[] } };

export const initialFavouritesState: FavouritesState = {
  favouriteIds: [],
};

/**
 * Reducer function for managing favourite photo IDs.
 * Strictly immutable state updates without any mutations.
 */
export function favouritesReducer(
  state: FavouritesState,
  action: FavouritesAction
): FavouritesState {
  switch (action.type) {
    case 'ADD_FAVOURITE': {
      const { id } = action.payload;
      // Prevent duplicate entries
      if (state.favouriteIds.includes(id)) {
        return state;
      }
      return {
        ...state,
        favouriteIds: [...state.favouriteIds, id],
      };
    }

    case 'REMOVE_FAVOURITE': {
      const { id } = action.payload;
      return {
        ...state,
        favouriteIds: state.favouriteIds.filter((favId) => favId !== id),
      };
    }

    case 'INITIALIZE_FAVOURITES': {
      return {
        ...state,
        favouriteIds: action.payload.ids,
      };
    }

    default:
      return state;
  }
}
