package org.com;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.com.config.ConfigurationManager;

public class Main {
    private static final Logger logger = LogManager.getLogger(Main.class);
    public static void main(String[] args) {
        ConfigurationManager configuration = ConfigurationManager.getInstance();
        logger.info("Starting server");

    }
}