package org.com.config;

public class Configuration {
    int httpPort;
    int threadHttpPoolSize;
    int websocketPort;
    int threadWebsocketPoolSize;
    int threadDockerPoolSize;
    String postgresUrl;
    String postgresUser;
    String postgresPassword;
    String mongoUrl;
    String jwtSecret;
    String dockerImage;
    String logFilePaths;

    public int getHttpPort() {
        return httpPort;
    }

    public void setHttpPort(int httpPort) {
        this.httpPort = httpPort;
    }

    public int getThreadHttpPoolSize() {
        return threadHttpPoolSize;
    }

    public void setThreadHttpPoolSize(int threadHttpPoolSize) {
        this.threadHttpPoolSize = threadHttpPoolSize;
    }

    public int getWebsocketPort() {
        return websocketPort;
    }

    public void setWebsocketPort(int websocketPort) {
        this.websocketPort = websocketPort;
    }

    public int getThreadWebsocketPoolSize() {
        return threadWebsocketPoolSize;
    }

    public void setThreadWebsocketPoolSize(int threadWebsocketPoolSize) {
        this.threadWebsocketPoolSize = threadWebsocketPoolSize;
    }

    public int getThreadDockerPoolSize() {
        return threadDockerPoolSize;
    }

    public void setThreadDockerPoolSize(int threadDockerPoolSize) {
        this.threadDockerPoolSize = threadDockerPoolSize;
    }

    public String getPostgresUrl() {
        return postgresUrl;
    }

    public void setPostgresUrl(String postgresUrl) {
        this.postgresUrl = postgresUrl;
    }

    public String getPostgresUser() {
        return postgresUser;
    }

    public void setPostgresUser(String postgresUser) {
        this.postgresUser = postgresUser;
    }

    public String getPostgresPassword() {
        return postgresPassword;
    }

    public void setPostgresPassword(String postgresPassword) {
        this.postgresPassword = postgresPassword;
    }

    public String getMongoUrl() {
        return mongoUrl;
    }

    public void setMongoUrl(String mongoUrl) {
        this.mongoUrl = mongoUrl;
    }

    public String getJwtSecret() {
        return jwtSecret;
    }

    public void setJwtSecret(String jwtSecret) {
        this.jwtSecret = jwtSecret;
    }

    public String getDockerImage() {
        return dockerImage;
    }

    public void setDockerImage(String dockerImage) {
        this.dockerImage = dockerImage;
    }

    public String getLogFilePaths() {
        return logFilePaths;
    }

    public void setLogFilePaths(String logFilePaths) {
        this.logFilePaths = logFilePaths;
    }
}
