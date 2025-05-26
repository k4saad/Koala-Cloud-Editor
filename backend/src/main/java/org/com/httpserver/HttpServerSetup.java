package org.com.httpserver;

import com.sun.net.httpserver.HttpHandler;
import com.sun.net.httpserver.HttpServer;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.com.config.ConfigurationManager;
import org.com.httpserver.handlers.AuthHandler;
import org.com.httpserver.handlers.ProjectHandler;
import org.com.util.HandlerUtil;
import org.com.util.ThreadPoolManager;

import java.io.IOException;
import java.net.InetSocketAddress;

/**
 * Http Server
 * Made using this as a reference - <a href="https://datatracker.ietf.org/doc/html/rfc7230">RFC 7230</a>
 *
 */
public class HttpServerSetup {
    private static final Logger logger = LogManager.getLogger(HttpServerSetup.class);
    private static final ConfigurationManager configuration = ConfigurationManager.getInstance();
    private HttpServer httpServer;


    public void start() throws IOException {
        httpServer = HttpServer.create(new InetSocketAddress(configuration.getHttpPort()),0);
        httpServer.setExecutor(ThreadPoolManager.getHttpThreadPool());


        // TODO -- Make handler for each path
        /**
         * This is lambda expression for handling ping request from frontend homepage to start the backend.
         * It Just responds with 204 code no content, To indicate that backend is up and running
         */
        httpServer.createContext("/ping", exchange -> {

            /*
             * Due to JWT Auth token this simple ping request becomes preflighted request,
             * and preflight request must be handled
             */
            HandlerUtil.corsHandler(exchange);
            String method = exchange.getRequestMethod();
            if (method.equalsIgnoreCase("OPTIONS")){
                exchange.sendResponseHeaders(204, -1);
                return;
            }
            try{
                exchange.sendResponseHeaders(204,-1);
                logger.info("Server recevied ping request");
            } catch (IOException e) {
                logger.fatal("Server cant send response +" + e.getMessage());
            }
        });
        httpServer.createContext("/auth", new AuthHandler());
        httpServer.createContext("/projects", new ProjectHandler());
//        httpServer.createContext("/files", new FilesHandler());
//        httpServer.createContext("/execute", new ExecuteHandler());
//        httpServer.createContext("/collaborators", new CollaboratorsHandler());

        httpServer.start();
        logger.info("HTTP server started on port : "+ configuration.getHttpPort());
    }
    public void stop(){
        if(httpServer != null){
            httpServer.stop(0);
        }
        logger.info("HTTP server stoped");
    }
}
