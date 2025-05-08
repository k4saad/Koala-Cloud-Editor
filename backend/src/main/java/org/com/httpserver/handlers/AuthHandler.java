package org.com.httpserver.handlers;

import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;

import java.io.IOException;

/**
 * AuthHandler handles authentication and related stuff, like login, registration etc
 */
public class AuthHandler implements HttpHandler {
    @Override
    public void handle(HttpExchange exchange) throws IOException {
        String path = exchange.getRequestURI().getPath();
        String method = exchange.getRequestMethod();

        if(path.endsWith("/register") && method.equalsIgnoreCase("POST")){
            handleRegister(exchange);
        }

    }

    private void handleRegister(HttpExchange exchange) throws IOException {
        // TODO -- Register user in postgres db
        exchange.sendResponseHeaders(204,-1);
    }
}
