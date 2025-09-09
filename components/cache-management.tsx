'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/src/shared/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/src/shared/components/ui/card';
import { Badge } from '@/src/shared/components/ui/badge';
import { Separator } from '@/src/shared/components/ui/separator';
import { RefreshCw, Trash2, Clock, Database, AlertCircle } from 'lucide-react';
import { useProductCache } from '@/context/ProductCacheContext';
import { CacheService, CACHE_KEYS } from '@/lib/cache-service';
import { CacheInvalidationManager, CacheEvents, triggerCacheInvalidation } from '@/lib/cache-invalidation';

interface CacheStats {
  totalEntries: number;
  totalSize: number;
  entries: Array<{ key: string; size: number; age: number }>;
}

export function CacheManagement() {
  const { refreshCache, clearCache, cacheStats, isCacheValid } = useProductCache();
  const [localCacheStats, setLocalCacheStats] = useState<CacheStats>({
    totalEntries: 0,
    totalSize: 0,
    entries: []
  });
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    updateCacheStats();
  }, []);

  const updateCacheStats = () => {
    const stats = CacheService.getStats();
    setLocalCacheStats(stats);
  };

  const handleRefreshCache = async () => {
    setIsRefreshing(true);
    try {
      await refreshCache();
      updateCacheStats();
    } catch (error) {
      console.error('Failed to refresh cache:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleClearCache = () => {
    clearCache();
    updateCacheStats();
  };

  const handleClearAllCache = () => {
    CacheService.clear();
    updateCacheStats();
  };

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatAge = (ageMs: number): string => {
    const seconds = Math.floor(ageMs / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    
    if (hours > 0) return `${hours}h ${minutes % 60}m`;
    if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
    return `${seconds}s`;
  };

  const getCacheStatus = () => {
    if (isCacheValid()) {
      return { status: 'valid', color: 'bg-green-500', text: 'Valid' };
    } else {
      return { status: 'invalid', color: 'bg-red-500', text: 'Invalid/Expired' };
    }
  };

  const cacheStatus = getCacheStatus();

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Cache Management</h2>
        <div className="flex gap-2">
          <Button
            onClick={handleRefreshCache}
            disabled={isRefreshing}
            variant="outline"
            size="sm"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh Cache
          </Button>
          <Button
            onClick={handleClearCache}
            variant="outline"
            size="sm"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Clear Product Cache
          </Button>
          <Button
            onClick={handleClearAllCache}
            variant="destructive"
            size="sm"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Clear All Cache
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Product Cache Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="w-5 h-5" />
              Product Cache
            </CardTitle>
            <CardDescription>
              Current status of the product cache
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Status:</span>
              <Badge className={`${cacheStatus.color} text-white`}>
                {cacheStatus.text}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Products:</span>
              <span className="text-sm">{cacheStats.totalProducts}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Last Updated:</span>
              <span className="text-sm">{cacheStats.lastUpdated || 'Never'}</span>
            </div>
            {cacheStats.cacheAge && (
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Age:</span>
                <span className="text-sm">{formatAge(cacheStats.cacheAge * 1000)}</span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Local Storage Cache Stats */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="w-5 h-5" />
              Local Storage
            </CardTitle>
            <CardDescription>
              Overall cache storage statistics
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Total Entries:</span>
              <span className="text-sm">{localCacheStats.totalEntries}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Total Size:</span>
              <span className="text-sm">{formatBytes(localCacheStats.totalSize)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Available:</span>
              <span className="text-sm">
                {CacheService.isAvailable() ? (
                  <Badge className="bg-green-500 text-white">Available</Badge>
                ) : (
                  <Badge className="bg-red-500 text-white">Unavailable</Badge>
                )}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Cache Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              Cache Actions
            </CardTitle>
            <CardDescription>
              Manual cache invalidation triggers
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button
              onClick={() => triggerCacheInvalidation(CacheEvents.PRODUCT_UPDATED, 'products')}
              variant="outline"
              size="sm"
              className="w-full"
            >
              Invalidate on Product Update
            </Button>
            <Button
              onClick={() => triggerCacheInvalidation(CacheEvents.CATEGORY_UPDATED, 'categories')}
              variant="outline"
              size="sm"
              className="w-full"
            >
              Invalidate on Category Update
            </Button>
            <Button
              onClick={() => triggerCacheInvalidation(CacheEvents.PRICING_UPDATED, 'pricing')}
              variant="outline"
              size="sm"
              className="w-full"
            >
              Invalidate on Pricing Update
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Cache Entries Details */}
      {localCacheStats.entries.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Cache Entries</CardTitle>
            <CardDescription>
              Detailed view of all cached entries
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {localCacheStats.entries.map((entry, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <div>
                      <p className="font-medium text-sm">{entry.key}</p>
                      <p className="text-xs text-gray-500">Age: {formatAge(entry.age)}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{formatBytes(entry.size)}</p>
                    <Button
                      onClick={() => {
                        CacheService.remove(entry.key);
                        updateCacheStats();
                      }}
                      variant="ghost"
                      size="sm"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Cache Strategies */}
      <Card>
        <CardHeader>
          <CardTitle>Invalidation Strategies</CardTitle>
          <CardDescription>
            Available cache invalidation strategies
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {CacheInvalidationManager.getStrategies().map((strategy, index) => (
              <div key={index} className="p-3 border rounded-lg">
                <h4 className="font-medium text-sm">{strategy.name}</h4>
                <p className="text-xs text-gray-500 mt-1">{strategy.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
