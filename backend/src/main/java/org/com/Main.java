package org.com;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.com.config.ConfigurationManager;
import org.com.httpserver.HttpServerSetup;
import org.com.websocket.WebSocketServerSetup;

import java.io.IOException;

public class Main {
    private static final Logger logger = LogManager.getLogger(Main.class);
    public static void main(String[] args) {
        ConfigurationManager configuration = ConfigurationManager.getInstance();
        HttpServerSetup httpServer = new HttpServerSetup();
        WebSocketServerSetup webSocketServer = new WebSocketServerSetup();
        try{
            httpServer.start();
            logger.info("Http server started");

        } catch (IOException e) {
            logger.fatal("Failed to start HTTP server : " + e.getMessage());
            System.exit(1);
        }
        try{
            webSocketServer.start();
            logger.info("WebSocket server started");
        } catch (Exception e){
            logger.fatal("Failed to start WebSocket server: " + e.getMessage());
            System.exit(1);
        }


    }
}