import { CacheService, CACHE_KEYS } from './cache-service';

export interface CacheInvalidationStrategy {
  name: string;
  description: string;
  shouldInvalidate: (context: InvalidationContext) => boolean;
  invalidate: (context: InvalidationContext) => void;
}

export interface InvalidationContext {
  timestamp: number;
  userAction?: string;
  dataChanged?: string;
  timeSinceLastFetch?: number;
  cacheAge?: number;
}

export class CacheInvalidationManager {
  private static strategies: CacheInvalidationStrategy[] = [
    {
      name: 'time-based',
      description: 'Invalidate cache after a certain time period',
      shouldInvalidate: (context) => {
        const maxAge = 5 * 60 * 1000; // 5 minutes
        return (context.cacheAge || 0) > maxAge;
      },
      invalidate: (context) => {
        console.log('Time-based cache invalidation triggered');
        CacheService.remove(CACHE_KEYS.PRODUCTS);
      }
    },
    {
      name: 'user-action',
      description: 'Invalidate cache on specific user actions',
      shouldInvalidate: (context) => {
        const invalidatingActions = ['product-update', 'product-delete', 'product-add'];
        return context.userAction ? invalidatingActions.includes(context.userAction) : false;
      },
      invalidate: (context) => {
        console.log(`User action cache invalidation triggered: ${context.userAction}`);
        CacheService.remove(CACHE_KEYS.PRODUCTS);
      }
    },
    {
      name: 'data-change',
      description: 'Invalidate cache when specific data changes',
      shouldInvalidate: (context) => {
        const invalidatingData = ['products', 'categories', 'pricing'];
        return context.dataChanged ? invalidatingData.includes(context.dataChanged) : false;
      },
      invalidate: (context) => {
        console.log(`Data change cache invalidation triggered: ${context.dataChanged}`);
        CacheService.remove(CACHE_KEYS.PRODUCTS);
        if (context.dataChanged === 'categories') {
          CacheService.remove(CACHE_KEYS.CATEGORIES);
        }
      }
    },
    {
      name: 'stale-data',
      description: 'Invalidate cache when data becomes stale',
      shouldInvalidate: (context) => {
        const staleThreshold = 10 * 60 * 1000; // 10 minutes
        return (context.timeSinceLastFetch || 0) > staleThreshold;
      },
      invalidate: (context) => {
        console.log('Stale data cache invalidation triggered');
        CacheService.remove(CACHE_KEYS.PRODUCTS);
      }
    }
  ];

  /**
   * Check if cache should be invalidated based on context
   */
  static shouldInvalidate(context: InvalidationContext): boolean {
    return this.strategies.some(strategy => strategy.shouldInvalidate(context));
  }

  /**
   * Invalidate cache based on context
   */
  static invalidate(context: InvalidationContext): void {
    const applicableStrategies = this.strategies.filter(strategy => 
      strategy.shouldInvalidate(context)
    );

    applicableStrategies.forEach(strategy => {
      try {
        strategy.invalidate(context);
      } catch (error) {
        console.error(`Error in cache invalidation strategy ${strategy.name}:`, error);
      }
    });
  }

  /**
   * Invalidate cache for specific user action
   */
  static invalidateForUserAction(action: string): void {
    const context: InvalidationContext = {
      timestamp: Date.now(),
      userAction: action
    };
    this.invalidate(context);
  }

  /**
   * Invalidate cache for data changes
   */
  static invalidateForDataChange(dataType: string): void {
    const context: InvalidationContext = {
      timestamp: Date.now(),
      dataChanged: dataType
    };
    this.invalidate(context);
  }

  /**
   * Check and invalidate stale cache
   */
  static checkAndInvalidateStale(): void {
    const stats = CacheService.getStats();
    const now = Date.now();

    stats.entries.forEach(entry => {
      const context: InvalidationContext = {
        timestamp: now,
        cacheAge: entry.age,
        timeSinceLastFetch: entry.age
      };

      if (this.shouldInvalidate(context)) {
        this.invalidate(context);
      }
    });
  }

  /**
   * Get all available strategies
   */
  static getStrategies(): CacheInvalidationStrategy[] {
    return [...this.strategies];
  }

  /**
   * Add custom invalidation strategy
   */
  static addStrategy(strategy: CacheInvalidationStrategy): void {
    this.strategies.push(strategy);
  }

  /**
   * Remove invalidation strategy by name
   */
  static removeStrategy(name: string): void {
    this.strategies = this.strategies.filter(strategy => strategy.name !== name);
  }
}

// Auto-cleanup expired cache entries
export const startCacheCleanup = (intervalMs: number = 60000): NodeJS.Timeout => {
  return setInterval(() => {
    try {
      CacheService.cleanExpired();
      CacheInvalidationManager.checkAndInvalidateStale();
    } catch (error) {
      console.error('Error during cache cleanup:', error);
    }
  }, intervalMs);
};

// Cache invalidation events
export const CacheEvents = {
  PRODUCT_UPDATED: 'product-update',
  PRODUCT_DELETED: 'product-delete',
  PRODUCT_ADDED: 'product-add',
  CATEGORY_UPDATED: 'category-update',
  PRICING_UPDATED: 'pricing-update',
  INVENTORY_UPDATED: 'inventory-update'
} as const;

// Utility function to trigger cache invalidation
export const triggerCacheInvalidation = (event: string, dataType?: string) => {
  if (Object.values(CacheEvents).includes(event as any)) {
    CacheInvalidationManager.invalidateForUserAction(event);
  }
  
  if (dataType) {
    CacheInvalidationManager.invalidateForDataChange(dataType);
  }
};
