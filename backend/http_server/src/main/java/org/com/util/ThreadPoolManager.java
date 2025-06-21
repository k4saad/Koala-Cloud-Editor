package org.com.util;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.com.config.ConfigurationManager;

import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

/**
 * This is the thread pool manager service that provide thread pool for http,websocket and docker tasks
 */
public class ThreadPoolManager {
    private static final Logger logger = LogManager.getLogger(ThreadPoolManager.class);
    private static final ConfigurationManager configuration = ConfigurationManager.getInstance();
    private static final ExecutorService httpThreadPool;
    private static final ExecutorService dockerThreadPool;

    static{
        httpThreadPool = Executors.newFixedThreadPool(configuration.getHttpThreadPoolSize());
        dockerThreadPool = Executors.newFixedThreadPool(configuration.getDockerThreadPoolSize());

        logger.info("Initialized Thread pools: Http = " + configuration.getHttpThreadPoolSize());
        logger.info("Initialized Thread pools: Docker = " + configuration.getDockerThreadPoolSize());
    }

    public static ExecutorService getHttpThreadPool(){
        return httpThreadPool;
    }
    public static ExecutorService getDockerThreadPool(){
        return dockerThreadPool;
    }


    public static void shutdown(){
        logger.info("Initiating Thread pools shut down");
        httpThreadPool.shutdown();
        dockerThreadPool.shutdown();
        logger.info("Thread Pools successfully shut down");
    }
}
