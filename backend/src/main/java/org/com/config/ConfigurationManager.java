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
            if(input == null){
                logger.fatal("application.properties not found");
                throw new IOException("application.properties not found");
            }
            properties.load(input);
            logger.info("application.properties loaded successfully");
        }
        catch(IOException exception){
            logger.fatal("Failed to load application.properties", exception);
            throw new RuntimeException("Configuration loading failed",exception);
        }
    }
    public static ConfigurationManager getInstance(){
        return CONFIGURATION_MANAGER;
    }
    public int getHttpPort(){
        return Integer.parseInt(properties.getProperty("http.port"));
    }
    public int getWebSocketPort() {
        return Integer.parseInt(properties.getProperty("websocket.port", "8081"));
    }

    public String getPostgresUrl() {
        return properties.getProperty("postgres.url", "jdbc:postgresql://localhost:5432/replit");
    }

    public String getPostgresUser() {
        return properties.getProperty("postgres.user", "postgres");
    }

    public String getPostgresPassword() {
        return properties.getProperty("postgres.password", "");
    }

    public String getMongoUrl() {
        return properties.getProperty("mongo.url", "mongodb://localhost:27017");
    }

    public String getJwtSecret() {
        String secret = properties.getProperty("jwt.secret");
        if (secret == null || secret.isEmpty()) {
            throw new IllegalStateException("JWT secret not configured");
        }
        return secret;
    }

    public String getDockerImage() {
        return properties.getProperty("docker.image");
    }

    public int getHttpThreadPoolSize() {
        return Integer.parseInt(properties.getProperty("thread.http.pool.size"));
    }

    public int getWebSocketThreadPoolSize() {
        return Integer.parseInt(properties.getProperty("thread.websocket.pool.size"));
    }

    public int getDockerThreadPoolSize() {
        return Integer.parseInt(properties.getProperty("thread.docker.pool.size"));
    }

    public String getLogFilePath() {
        return properties.getProperty("log.file.path");
    }
}
