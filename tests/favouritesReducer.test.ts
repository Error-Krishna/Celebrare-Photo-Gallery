import { describe, it } from 'node:test';
import assert from 'node:assert';
import {
  favouritesReducer,
  initialFavouritesState,
} from '../src/reducers/favouritesReducer.ts';
import type { FavouritesState } from '../src/reducers/favouritesReducer.ts';

describe('favouritesReducer', () => {
  it('should add a photo ID to empty favourites', () => {
    const state: FavouritesState = { favouriteIds: [] };
    const nextState = favouritesReducer(state, {
      type: 'ADD_FAVOURITE',
      payload: { id: 'photo-1' },
    });

    assert.deepStrictEqual(nextState.favouriteIds, ['photo-1']);
    assert.strictEqual(state.favouriteIds.length, 0); // State immutability
  });

  it('should not add duplicate photo IDs', () => {
    const state: FavouritesState = { favouriteIds: ['photo-1'] };
    const nextState = favouritesReducer(state, {
      type: 'ADD_FAVOURITE',
      payload: { id: 'photo-1' },
    });

    assert.deepStrictEqual(nextState.favouriteIds, ['photo-1']);
  });

  it('should remove a photo ID from favourites', () => {
    const state: FavouritesState = { favouriteIds: ['photo-1', 'photo-2', 'photo-3'] };
    const nextState = favouritesReducer(state, {
      type: 'REMOVE_FAVOURITE',
      payload: { id: 'photo-2' },
    });

    assert.deepStrictEqual(nextState.favouriteIds, ['photo-1', 'photo-3']);
  });

  it('should handle removing an ID that is not in favourites', () => {
    const state: FavouritesState = { favouriteIds: ['photo-1'] };
    const nextState = favouritesReducer(state, {
      type: 'REMOVE_FAVOURITE',
      payload: { id: 'photo-99' },
    });

    assert.deepStrictEqual(nextState.favouriteIds, ['photo-1']);
  });

  it('should initialize favourites with a provided list of IDs', () => {
    const nextState = favouritesReducer(initialFavouritesState, {
      type: 'INITIALIZE_FAVOURITES',
      payload: { ids: ['photo-10', 'photo-20'] },
    });

    assert.deepStrictEqual(nextState.favouriteIds, ['photo-10', 'photo-20']);
  });

  it('should return existing state for unknown action types', () => {
    const state: FavouritesState = { favouriteIds: ['photo-1'] };
    // @ts-expect-error Testing unknown action gracefully
    const nextState = favouritesReducer(state, { type: 'UNKNOWN_ACTION' });
    assert.strictEqual(nextState, state);
  });
});
