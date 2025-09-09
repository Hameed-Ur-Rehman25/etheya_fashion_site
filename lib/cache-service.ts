import { Product } from '@/types';

export interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
  version: string;
}

export interface CacheConfig {
  ttl: number; // Time to live in milliseconds
  version: string;
  key: string;
}

export class CacheService {
  private static readonly DEFAULT_TTL = 5 * 60 * 1000; // 5 minutes
  private static readonly CACHE_VERSION = '1.0';

  /**
   * Save data to cache with TTL
   */
  static set<T>(key: string, data: T, ttl: number = this.DEFAULT_TTL): void {
    try {
      const cacheEntry: CacheEntry<T> = {
        data,
        timestamp: Date.now(),
        ttl,
        version: this.CACHE_VERSION
      };
      
      localStorage.setItem(key, JSON.stringify(cacheEntry));
      console.log(`Cache saved for key: ${key}`);
    } catch (error) {
      console.error(`Failed to save cache for key ${key}:`, error);
    }
  }

  /**
   * Get data from cache if valid
   */
  static get<T>(key: string): T | null {
    try {
      const cached = localStorage.getItem(key);
      if (!cached) return null;

      const cacheEntry: CacheEntry<T> = JSON.parse(cached);
      
      // Check version compatibility
      if (cacheEntry.version !== this.CACHE_VERSION) {
        console.log(`Cache version mismatch for key ${key}, clearing cache`);
        this.remove(key);
        return null;
      }

      // Check if cache is still valid
      if (Date.now() - cacheEntry.timestamp < cacheEntry.ttl) {
        console.log(`Cache hit for key: ${key}`);
        return cacheEntry.data;
      } else {
        console.log(`Cache expired for key: ${key}`);
        this.remove(key);
        return null;
      }
    } catch (error) {
      console.error(`Failed to get cache for key ${key}:`, error);
      this.remove(key);
      return null;
    }
  }

  /**
   * Remove specific cache entry
   */
  static remove(key: string): void {
    try {
      localStorage.removeItem(key);
      console.log(`Cache removed for key: ${key}`);
    } catch (error) {
      console.error(`Failed to remove cache for key ${key}:`, error);
    }
  }

  /**
   * Clear all cache entries
   */
  static clear(): void {
    try {
      const keys = Object.keys(localStorage);
      const cacheKeys = keys.filter(key => key.startsWith('etheya_'));
      
      cacheKeys.forEach(key => {
        localStorage.removeItem(key);
      });
      
      console.log(`Cleared ${cacheKeys.length} cache entries`);
    } catch (error) {
      console.error('Failed to clear cache:', error);
    }
  }

  /**
   * Get cache statistics
   */
  static getStats(): { totalEntries: number; totalSize: number; entries: Array<{ key: string; size: number; age: number }> } {
    try {
      const keys = Object.keys(localStorage);
      const cacheKeys = keys.filter(key => key.startsWith('etheya_'));
      
      const entries = cacheKeys.map(key => {
        const cached = localStorage.getItem(key);
        const size = cached ? new Blob([cached]).size : 0;
        let age = 0;
        
        if (cached) {
          try {
            const cacheEntry = JSON.parse(cached);
            age = Date.now() - cacheEntry.timestamp;
          } catch {
            age = 0;
          }
        }
        
        return { key, size, age };
      });
      
      const totalSize = entries.reduce((sum, entry) => sum + entry.size, 0);
      
      return {
        totalEntries: entries.length,
        totalSize,
        entries
      };
    } catch (error) {
      console.error('Failed to get cache stats:', error);
      return { totalEntries: 0, totalSize: 0, entries: [] };
    }
  }

  /**
   * Check if cache is available (localStorage support)
   */
  static isAvailable(): boolean {
    try {
      const testKey = 'etheya_cache_test';
      localStorage.setItem(testKey, 'test');
      localStorage.removeItem(testKey);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Clean expired cache entries
   */
  static cleanExpired(): void {
    try {
      const keys = Object.keys(localStorage);
      const cacheKeys = keys.filter(key => key.startsWith('etheya_'));
      
      let cleanedCount = 0;
      
      cacheKeys.forEach(key => {
        const cached = localStorage.getItem(key);
        if (cached) {
          try {
            const cacheEntry = JSON.parse(cached);
            if (Date.now() - cacheEntry.timestamp >= cacheEntry.ttl) {
              localStorage.removeItem(key);
              cleanedCount++;
            }
          } catch {
            // Remove corrupted cache entries
            localStorage.removeItem(key);
            cleanedCount++;
          }
        }
      });
      
      if (cleanedCount > 0) {
        console.log(`Cleaned ${cleanedCount} expired cache entries`);
      }
    } catch (error) {
      console.error('Failed to clean expired cache:', error);
    }
  }
}

// Cache keys constants
export const CACHE_KEYS = {
  PRODUCTS: 'etheya_products_cache',
  CATEGORIES: 'etheya_categories_cache',
  USER_PREFERENCES: 'etheya_user_preferences',
  SEARCH_HISTORY: 'etheya_search_history',
  WISHLIST: 'etheya_wishlist_cache',
  CART: 'etheya_cart_cache'
} as const;

// Cache configurations
export const CACHE_CONFIGS = {
  PRODUCTS: {
    ttl: 5 * 60 * 1000, // 5 minutes
    version: '1.0',
    key: CACHE_KEYS.PRODUCTS
  },
  CATEGORIES: {
    ttl: 30 * 60 * 1000, // 30 minutes
    version: '1.0',
    key: CACHE_KEYS.CATEGORIES
  },
  USER_PREFERENCES: {
    ttl: 24 * 60 * 60 * 1000, // 24 hours
    version: '1.0',
    key: CACHE_KEYS.USER_PREFERENCES
  },
  SEARCH_HISTORY: {
    ttl: 7 * 24 * 60 * 60 * 1000, // 7 days
    version: '1.0',
    key: CACHE_KEYS.SEARCH_HISTORY
  }
} as const;
