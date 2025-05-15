package org.com.httpserver.handlers;

import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.com.db.PostgresConnector;
import org.com.util.HandlerUtil;
import org.com.util.JsonUtil;
import org.com.util.PasswordUtil;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.util.Map;

/**
 * AuthHandler handles authentication and related stuff, like login, registration etc
 */
public class AuthHandler implements HttpHandler {

    private static final Logger logger = LogManager.getLogger(AuthHandler.class);

    @Override
    public void handle(HttpExchange exchange) throws IOException {

        HandlerUtil.corsHandler(exchange);

        String path = exchange.getRequestURI().getPath();
        String method = exchange.getRequestMethod();
        if (method.equalsIgnoreCase("OPTIONS")){
            exchange.sendResponseHeaders(204, -1);
            return;
        }
        if(path.endsWith("/register") && method.equalsIgnoreCase("POST")){
            handleRegister(exchange);
        }

    }

    /**
     * This handler register new user to the postgres database
     * @param exchange
     * @throws IOException
     */
    private void handleRegister(HttpExchange exchange) throws IOException {

        String requestBody = new String(exchange.getRequestBody().readAllBytes(), StandardCharsets.UTF_8);
        Map<String,String> data = JsonUtil.fromJson(requestBody, Map.class);

        if(data == null){
            HandlerUtil.sendResponse(exchange,400,"Request body missing");
        }

        if(data != null && !(data.containsKey("username") && data.containsKey("name") && data.containsKey("email") && data.containsKey("password"))){
            HandlerUtil.sendResponse(exchange, 400,"Invalid parameters for user");
        }
        try(Connection connection = PostgresConnector.getConnection();
            PreparedStatement statement =
                    connection.prepareStatement("INSERT INTO users (username, name, email, password) VALUES (?,?,?,?) ON CONFLICT DO NOTHING");) {

            statement.setString(1, data.get("username"));
            statement.setString(2, data.get("name"));
            statement.setString(3, data.get("email"));
            statement.setString(4, PasswordUtil.hashPassword(data.get("password")));

            int rows = statement.executeUpdate();

            if(rows == 0){
                HandlerUtil.sendResponse(exchange,409,"User is already registered");
            }
            else{
                HandlerUtil.sendResponse(exchange,200, "User registered successfully");
            }

        } catch (SQLException e) {
            logger.fatal("Registration error: " + e.getMessage());
            HandlerUtil.sendResponse(exchange,500,"Registration failed: " + e.getMessage());
        }

    }

}
