package org.com;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.com.config.ConfigurationManager;
import org.com.websocket.WebSocketServerSetup;


public class Main {
    private static final Logger logger = LogManager.getLogger(Main.class);
    public static void main(String[] args) {
        ConfigurationManager configuration = ConfigurationManager.getInstance();
        WebSocketServerSetup webSocketServer = new WebSocketServerSetup();
        try{
            webSocketServer.start();
            logger.info("WebSocket server started");
        } catch (Exception e){
            logger.fatal("Failed to start WebSocket server: " + e.getMessage());
            System.exit(1);
        }


    }
}