package ma.gov.dgh.helpdesk.config;

import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.cache.concurrent.ConcurrentMapCacheManager;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.cache.interceptor.KeyGenerator;
import org.springframework.cache.interceptor.SimpleKeyGenerator;
import org.springframework.cache.Cache;
import org.springframework.cache.concurrent.ConcurrentMapCache;

import java.time.Duration;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.TimeUnit;

/**
 * Cache configuration for performance optimization
 */
@Configuration
@EnableCaching
public class CacheConfig {

    /**
     * Cache manager for development and testing with TTL
     */
    @Bean
    @Profile({"dev", "default"})
    public CacheManager cacheManager() {
        ConcurrentMapCacheManager cacheManager = new ConcurrentMapCacheManager() {
            @Override
            protected Cache createConcurrentMapCache(String name) {
                return new ConcurrentMapCache(name, new ConcurrentHashMap<>(), false) {
                    @Override
                    public ValueWrapper get(Object key) {
                        ValueWrapper wrapper = super.get(key);
                        if (wrapper != null) {
                            // Check if cache entry has expired (TTL: 5 minutes for tickets, 10 minutes for statistics)
                            long ttl = name.equals("ticketStatistics") ? 600000 : 300000; // 10 min vs 5 min
                            if (System.currentTimeMillis() - System.currentTimeMillis() > ttl) {
                                evict(key);
                                return null;
                            }
                        }
                        return wrapper;
                    }
                };
            }
        };
        
        cacheManager.setCacheNames(java.util.Arrays.asList(
            "tickets",
            "users", 
            "equipment",
            "ticketStatistics",
            "userStatistics",
            "equipmentStatistics",
            "activityLogs"
        ));
        
        return cacheManager;
    }

    /**
     * Production cache configuration would use Redis or Hazelcast
     * This is a placeholder for production cache configuration
     */
    @Bean
    @Profile("prod")
    public CacheManager productionCacheManager() {
        // In production, this would be configured with Redis or Hazelcast
        // For now, using the same in-memory cache with longer TTL
        ConcurrentMapCacheManager cacheManager = new ConcurrentMapCacheManager() {
            @Override
            protected Cache createConcurrentMapCache(String name) {
                return new ConcurrentMapCache(name, new ConcurrentHashMap<>(), false) {
                    @Override
                    public ValueWrapper get(Object key) {
                        ValueWrapper wrapper = super.get(key);
                        if (wrapper != null) {
                            // Production TTL: 15 minutes for tickets, 30 minutes for statistics
                            long ttl = name.equals("ticketStatistics") ? 1800000 : 900000; // 30 min vs 15 min
                            if (System.currentTimeMillis() - System.currentTimeMillis() > ttl) {
                                evict(key);
                                return null;
                            }
                        }
                        return wrapper;
                    }
                };
            }
        };
        
        cacheManager.setCacheNames(java.util.Arrays.asList(
            "tickets",
            "users", 
            "equipment",
            "ticketStatistics",
            "userStatistics",
            "equipmentStatistics",
            "activityLogs"
        ));
        
        return cacheManager;
    }

    /**
     * Custom key generator for better cache key management
     */
    @Bean
    public KeyGenerator customKeyGenerator() {
        return new SimpleKeyGenerator();
    }
} 