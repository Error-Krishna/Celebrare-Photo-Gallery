import { describe, it, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert';
import {
  getStoredFavourites,
  setStoredFavourites,
} from '../src/utils/localStorage.ts';

describe('localStorage utils', () => {
  const originalWindow = globalThis.window;
  let mockStorage: Record<string, string> = {};

  beforeEach(() => {
    mockStorage = {};
    // @ts-expect-error Mocking window.localStorage for Node testing environment
    globalThis.window = {
      localStorage: {
        getItem: (key: string) => mockStorage[key] ?? null,
        setItem: (key: string, value: string) => {
          mockStorage[key] = value;
        },
        removeItem: (key: string) => {
          delete mockStorage[key];
        },
        clear: () => {
          mockStorage = {};
        },
      },
    };
  });

  afterEach(() => {
    globalThis.window = originalWindow;
  });

  it('should return empty array when localStorage is empty', () => {
    const favourites = getStoredFavourites();
    assert.deepStrictEqual(favourites, []);
  });

  it('should save and retrieve favourite photo IDs accurately', () => {
    setStoredFavourites(['0', '1', '10']);
    const favourites = getStoredFavourites();
    assert.deepStrictEqual(favourites, ['0', '1', '10']);
  });

  it('should safely return empty array when localStorage contains invalid JSON', () => {
    mockStorage['celebrare_frame_favourites'] = '{invalid-json---';
    const favourites = getStoredFavourites();
    assert.deepStrictEqual(favourites, []);
  });

  it('should safely return empty array when stored data is not an array', () => {
    mockStorage['celebrare_frame_favourites'] = JSON.stringify({ notAnArray: true });
    const favourites = getStoredFavourites();
    assert.deepStrictEqual(favourites, []);
  });

  it('should safely return empty array when array items are not strings', () => {
    mockStorage['celebrare_frame_favourites'] = JSON.stringify([123, 456]);
    const favourites = getStoredFavourites();
    assert.deepStrictEqual(favourites, []);
  });

  it('should safely handle environments where window is undefined', () => {
    // @ts-expect-error Simulating SSR / non-browser environment
    delete globalThis.window;
    assert.deepStrictEqual(getStoredFavourites(), []);
    assert.doesNotThrow(() => setStoredFavourites(['1']));
  });
});
