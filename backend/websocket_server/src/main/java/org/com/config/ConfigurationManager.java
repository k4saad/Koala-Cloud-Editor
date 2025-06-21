package org.com.config;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import java.io.IOException;
import java.io.InputStream;
import java.util.Properties;


/**
 * This is the configuration file
 */
public class ConfigurationManager {
    private static final Logger logger = LogManager.getLogger(ConfigurationManager.class);

    private static final ConfigurationManager CONFIGURATION_MANAGER = new ConfigurationManager();
    private final Properties properties;

    private ConfigurationManager(){
        properties = new Properties();
        try(InputStream input = ConfigurationManager
                .class.getClassLoader()
                .getResourceAsStream("application.properties")
        ){
            if(input != null){
                properties.load(input);
                logger.info("application.properties loaded successfully");
            }
            else{
                logger.warn("application.properties not found. Environment variables will be used.");
            }
        }
        catch(IOException exception){
            logger.fatal("Failed to load application.properties", exception);
            throw new RuntimeException("Configuration loading failed",exception);
        }
    }

    private String getProperty(String key) {
        String envValue = System.getenv(key);
        if (envValue != null && !envValue.isEmpty()) {
            logger.info("Environment variable {} found, using its value", key);
            return envValue;
        }
        return properties.getProperty(key);
    }

    public static ConfigurationManager getInstance(){
        return CONFIGURATION_MANAGER;
    }
    public int getPort(){
        return Integer.parseInt(getProperty("port"));
    }

    public String getPostgresUrl() {
        return getProperty("postgres.url");
    }

    public String getPostgresUser() {
        return getProperty("postgres.user");
    }

    public String getPostgresPassword() {
        return getProperty("postgres.password");
    }

    public String getMongoUrl() {
        return getProperty("mongo.url");
    }

    public String getJwtSecret() {
        String secret = getProperty("jwt.secret");
        if (secret == null || secret.isEmpty()) {
            throw new IllegalStateException("JWT secret not configured");
        }
        return secret;
    }

    public int getWebSocketThreadPoolSize() {
        return Integer.parseInt(getProperty("thread.websocket.pool.size"));
    }

    public String getLogFilePath() {
        return getProperty("log.file.path");
    }
}
