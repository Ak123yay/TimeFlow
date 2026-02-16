// src/utils/storageCache.js
// Optimized localStorage with batching, caching, and debouncing

import { debounce } from './timeUtils';

// In-memory cache to reduce localStorage reads
const cache = new Map();

// Pending writes queue for batching
const pendingWrites = new Map();

// Flag to track if cache is initialized
let cacheInitialized = false;

/**
 * Initialize cache with frequently accessed keys
 */
function initializeCache() {
  if (cacheInitialized) return;

  try {
    // Pre-load commonly accessed keys
    const commonKeys = [
      'timeflow-availability',
      'timeflow-streak',
      'timeflow-weekly-pool'
    ];

    commonKeys.forEach(key => {
      const value = localStorage.getItem(key);
      if (value) {
        cache.set(key, value);
      }
    });

    cacheInitialized = true;
  } catch (e) {
    console.error('Cache initialization failed:', e);
  }
}

/**
 * Flush all pending writes to localStorage
 */
function flushPendingWrites() {
  if (pendingWrites.size === 0) return;

  try {
    // Batch write all pending changes
    pendingWrites.forEach((value, key) => {
      localStorage.setItem(key, value);
      cache.set(key, value); // Update cache
    });

    pendingWrites.clear();
  } catch (e) {
    console.error('Failed to flush pending writes:', e);
  }
}

// Debounced flush - wait 500ms after last write before flushing
const debouncedFlush = debounce(flushPendingWrites, 500);

/**
 * Get item from cache or localStorage
 * @param {string} key - Storage key
 * @param {boolean} parseJSON - Whether to parse as JSON
 * @returns {any} Stored value
 */
export function getCached(key, parseJSON = false) {
  initializeCache();

  try {
    // Check pending writes first
    if (pendingWrites.has(key)) {
      const value = pendingWrites.get(key);
      return parseJSON ? JSON.parse(value) : value;
    }

    // Check cache
    if (cache.has(key)) {
      const value = cache.get(key);
      return parseJSON ? JSON.parse(value) : value;
    }

    // Fallback to localStorage
    const value = localStorage.getItem(key);
    if (value) {
      cache.set(key, value);
      return parseJSON ? JSON.parse(value) : value;
    }

    return null;
  } catch (e) {
    console.error(`getCached error for key "${key}":`, e);
    return null;
  }
}

/**
 * Set item with batched write
 * @param {string} key - Storage key
 * @param {any} value - Value to store
 * @param {boolean} stringifyJSON - Whether to stringify as JSON
 * @param {boolean} immediate - Skip batching and write immediately
 */
export function setCached(key, value, stringifyJSON = false, immediate = false) {
  initializeCache();

  try {
    const stringValue = stringifyJSON ? JSON.stringify(value) : value;

    if (immediate) {
      // Immediate write - bypass batching
      localStorage.setItem(key, stringValue);
      cache.set(key, stringValue);
      pendingWrites.delete(key); // Remove from pending if exists
    } else {
      // Batched write - queue for later
      pendingWrites.set(key, stringValue);
      cache.set(key, stringValue); // Update cache immediately for reads
      debouncedFlush(); // Schedule flush
    }
  } catch (e) {
    console.error(`setCached error for key "${key}":`, e);
  }
}

/**
 * Remove item from storage and cache
 * @param {string} key - Storage key
 */
export function removeCached(key) {
  try {
    localStorage.removeItem(key);
    cache.delete(key);
    pendingWrites.delete(key);
  } catch (e) {
    console.error(`removeCached error for key "${key}":`, e);
  }
}

/**
 * Force immediate flush of all pending writes
 * Call this before navigating away or critical operations
 */
export function flushNow() {
  flushPendingWrites();
}

/**
 * Clear all cache (localStorage remains untouched)
 */
export function clearCache() {
  cache.clear();
  cacheInitialized = false;
}

/**
 * Get cache statistics for debugging
 */
export function getCacheStats() {
  return {
    cacheSize: cache.size,
    pendingWrites: pendingWrites.size,
    initialized: cacheInitialized
  };
}

// Flush on page unload to ensure no data loss
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', flushNow);

  // Also flush periodically as safety net (every 5 seconds)
  setInterval(flushPendingWrites, 5000);
}
