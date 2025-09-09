"use client";
import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { Product } from "@/types";
import { DatabaseService } from "@/lib/database-service";
import { CacheService, CACHE_KEYS } from "@/lib/cache-service";
import { CacheInvalidationManager } from "@/lib/cache-invalidation";

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number; // Time to live in milliseconds
}

interface ProductCacheContextType {
  // Cache state
  products: Product[];
  loading: boolean;
  error: string | null;
  lastFetch: number | null;
  
  // Cache management
  isCacheValid: () => boolean;
  refreshCache: () => Promise<void>;
  clearCache: () => void;
  invalidateCache: (event: string, dataType?: string) => void;
  
  // Product operations
  getProductById: (id: number) => Product | null;
  getProductsByCategory: (category: string) => Product[];
  getFeaturedProducts: () => Product[];
  searchProducts: (query: string) => Product[];
  
  // Cache statistics
  cacheStats: {
    totalProducts: number;
    lastUpdated: string | null;
    cacheAge: number | null;
  };
}

const ProductCacheContext = createContext<ProductCacheContextType | undefined>(undefined);

// Cache configuration
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes in milliseconds
const CACHE_KEY = 'etheya_products_cache';
const CACHE_VERSION = '1.0';

export const ProductCacheProvider = ({ children }: { children: ReactNode }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastFetch, setLastFetch] = useState<number | null>(null);

  // Load cache from localStorage on mount
  useEffect(() => {
    loadFromCache();
    
    // Start cache cleanup interval
    const cleanupInterval = setInterval(() => {
      CacheService.cleanExpired();
    }, 60000); // Clean every minute
    
    return () => clearInterval(cleanupInterval);
  }, []);

  // Load products from cache or fetch from API
  const loadFromCache = useCallback(() => {
    try {
      const cached = CacheService.get<Product[]>(CACHE_KEYS.PRODUCTS);
      if (cached) {
        setProducts(cached);
        setLastFetch(Date.now());
        setError(null);
        console.log('Products loaded from cache');
        return;
      }
    } catch (err) {
      console.error('Failed to load from cache:', err);
    }
    
    // If no valid cache, fetch from API
    refreshCache();
  }, []);

  // Save to cache
  const saveToCache = useCallback((data: Product[]) => {
    try {
      CacheService.set(CACHE_KEYS.PRODUCTS, data, CACHE_TTL);
      console.log('Products saved to cache');
    } catch (err) {
      console.error('Failed to save to cache:', err);
    }
  }, []);

  // Refresh cache from API
  const refreshCache = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('Fetching products from API...');
      const { data: fetchedProducts, error: fetchError } = await DatabaseService.getProducts();
      
      if (fetchError) {
        throw new Error(fetchError.message);
      }
      
      if (fetchedProducts) {
        setProducts(fetchedProducts);
        setLastFetch(Date.now());
        saveToCache(fetchedProducts);
        console.log(`Fetched ${fetchedProducts.length} products from API`);
      } else {
        setProducts([]);
        setLastFetch(Date.now());
        saveToCache([]);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch products';
      setError(errorMessage);
      console.error('Failed to refresh cache:', err);
      
      // If we have cached data, keep it even if refresh failed
      if (products.length === 0) {
        setProducts([]);
      }
    } finally {
      setLoading(false);
    }
  }, [products.length, saveToCache]);

  // Clear cache
  const clearCache = useCallback(() => {
    try {
      CacheService.remove(CACHE_KEYS.PRODUCTS);
      setProducts([]);
      setLastFetch(null);
      setError(null);
      console.log('Cache cleared');
    } catch (err) {
      console.error('Failed to clear cache:', err);
    }
  }, []);

  // Check if cache is valid
  const isCacheValid = useCallback(() => {
    if (!lastFetch) return false;
    return Date.now() - lastFetch < CACHE_TTL;
  }, [lastFetch]);

  // Get product by ID
  const getProductById = useCallback((id: number): Product | null => {
    return products.find(product => product.id === id) || null;
  }, [products]);

  // Get products by category
  const getProductsByCategory = useCallback((category: string): Product[] => {
    return products.filter(product => product.category === category);
  }, [products]);

  // Get featured products
  const getFeaturedProducts = useCallback((): Product[] => {
    return products.filter(product => product.featured);
  }, [products]);

  // Search products
  const searchProducts = useCallback((query: string): Product[] => {
    if (!query.trim()) return products;
    
    const searchTerm = query.toLowerCase();
    return products.filter(product =>
      product.title.toLowerCase().includes(searchTerm) ||
      product.description?.toLowerCase().includes(searchTerm) ||
      product.category?.toLowerCase().includes(searchTerm)
    );
  }, [products]);

  // Invalidate cache for specific events
  const invalidateCache = useCallback((event: string, dataType?: string) => {
    try {
      CacheInvalidationManager.invalidateForUserAction(event);
      if (dataType) {
        CacheInvalidationManager.invalidateForDataChange(dataType);
      }
      // Reload cache after invalidation
      loadFromCache();
    } catch (err) {
      console.error('Failed to invalidate cache:', err);
    }
  }, [loadFromCache]);

  // Cache statistics
  const cacheStats = {
    totalProducts: products.length,
    lastUpdated: lastFetch ? new Date(lastFetch).toLocaleString() : null,
    cacheAge: lastFetch ? Math.floor((Date.now() - lastFetch) / 1000) : null
  };

  const value: ProductCacheContextType = {
    products,
    loading,
    error,
    lastFetch,
    isCacheValid,
    refreshCache,
    clearCache,
    invalidateCache,
    getProductById,
    getProductsByCategory,
    getFeaturedProducts,
    searchProducts,
    cacheStats
  };

  return (
    <ProductCacheContext.Provider value={value}>
      {children}
    </ProductCacheContext.Provider>
  );
};

export const useProductCache = () => {
  const context = useContext(ProductCacheContext);
  if (!context) {
    throw new Error('useProductCache must be used within a ProductCacheProvider');
  }
  return context;
};
