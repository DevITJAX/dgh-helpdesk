package ma.gov.dgh.helpdesk.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;
import org.springframework.web.servlet.config.annotation.AsyncSupportConfigurer;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.util.concurrent.Executor;

/**
 * Performance configuration for async operations and monitoring
 */
@Configuration
@EnableAsync
@EnableScheduling
public class PerformanceConfig implements WebMvcConfigurer {

    /**
     * Async task executor for background operations
     */
    @Bean(name = "taskExecutor")
    public Executor taskExecutor() {
        ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
        executor.setCorePoolSize(5);
        executor.setMaxPoolSize(20);
        executor.setQueueCapacity(100);
        executor.setThreadNamePrefix("DGH-Async-");
        executor.setKeepAliveSeconds(60);
        executor.setAllowCoreThreadTimeOut(true);
        executor.initialize();
        return executor;
    }

    /**
     * Task executor specifically for network discovery
     */
    @Bean(name = "networkDiscoveryExecutor")
    public Executor networkDiscoveryExecutor() {
        ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
        executor.setCorePoolSize(3);
        executor.setMaxPoolSize(5);
        executor.setQueueCapacity(50);
        executor.setThreadNamePrefix("DGH-Discovery-");
        executor.setKeepAliveSeconds(30);
        executor.setAllowCoreThreadTimeOut(true);
        executor.initialize();
        return executor;
    }

    /**
     * Task executor for database operations
     */
    @Bean(name = "databaseExecutor")
    public Executor databaseExecutor() {
        ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
        executor.setCorePoolSize(2);
        executor.setMaxPoolSize(10);
        executor.setQueueCapacity(200);
        executor.setThreadNamePrefix("DGH-DB-");
        executor.setKeepAliveSeconds(120);
        executor.setAllowCoreThreadTimeOut(true);
        executor.initialize();
        return executor;
    }

    /**
     * Configure async request processing
     */
    @Override
    public void configureAsyncSupport(AsyncSupportConfigurer configurer) {
        configurer.setDefaultTimeout(30000); // 30 seconds
    }

    /**
     * Performance monitoring bean
     */
    @Bean
    @Profile("prod")
    public PerformanceMonitor performanceMonitor() {
        return new PerformanceMonitor();
    }

    /**
     * Simple performance monitoring class
     */
    public static class PerformanceMonitor {
        
        private final java.util.concurrent.atomic.AtomicLong totalQueries = new java.util.concurrent.atomic.AtomicLong(0);
        private final java.util.concurrent.atomic.AtomicLong slowQueries = new java.util.concurrent.atomic.AtomicLong(0);
        private final java.util.concurrent.atomic.AtomicLong totalQueryTime = new java.util.concurrent.atomic.AtomicLong(0);
        
        public void logQueryTime(String queryName, long executionTime) {
            totalQueries.incrementAndGet();
            totalQueryTime.addAndGet(executionTime);
            
            if (executionTime > 1000) { // Log slow queries (>1 second)
                slowQueries.incrementAndGet();
                System.out.println("SLOW QUERY: " + queryName + " took " + executionTime + "ms");
            }
        }
        
        public void logMemoryUsage() {
            Runtime runtime = Runtime.getRuntime();
            long totalMemory = runtime.totalMemory();
            long freeMemory = runtime.freeMemory();
            long usedMemory = totalMemory - freeMemory;
            long maxMemory = runtime.maxMemory();
            
            System.out.println("Memory Usage - Used: " + (usedMemory / 1024 / 1024) + 
                             "MB, Free: " + (freeMemory / 1024 / 1024) + 
                             "MB, Total: " + (totalMemory / 1024 / 1024) + 
                             "MB, Max: " + (maxMemory / 1024 / 1024) + "MB");
            
            // Log warning if memory usage is high
            double memoryUsagePercent = (double) usedMemory / maxMemory * 100;
            if (memoryUsagePercent > 80) {
                System.out.println("WARNING: High memory usage: " + String.format("%.1f", memoryUsagePercent) + "%");
            }
        }
        
        public void logPerformanceStats() {
            long total = totalQueries.get();
            long slow = slowQueries.get();
            long totalTime = totalQueryTime.get();
            
            if (total > 0) {
                double avgTime = (double) totalTime / total;
                double slowPercent = (double) slow / total * 100;
                
                System.out.println("Performance Stats - Total Queries: " + total + 
                                 ", Slow Queries: " + slow + " (" + String.format("%.1f", slowPercent) + "%)" +
                                 ", Avg Time: " + String.format("%.2f", avgTime) + "ms");
            }
        }
        
        public void resetStats() {
            totalQueries.set(0);
            slowQueries.set(0);
            totalQueryTime.set(0);
        }
    }
} 