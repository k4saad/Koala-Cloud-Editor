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
    private static final ExecutorService webSocketThreadPool;

    static{
        webSocketThreadPool = Executors.newFixedThreadPool(configuration.getWebSocketThreadPoolSize());

        logger.info("Initialized Thread pools: WebSocket = " + configuration.getWebSocketThreadPoolSize());
    }

    public static ExecutorService getWebSocketThreadPool(){
        return webSocketThreadPool;
    }


    public static void shutdown(){
        logger.info("Initiating Thread pools shut down");
        webSocketThreadPool.shutdown();
        logger.info("Thread Pools successfully shut down");
    }
}
