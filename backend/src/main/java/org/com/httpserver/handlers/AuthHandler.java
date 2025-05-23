package org.com.httpserver.handlers;

import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.com.db.PostgresConnector;
import org.com.util.HandlerUtil;
import org.com.util.JWTUtil;
import org.com.util.JsonUtil;
import org.com.util.PasswordUtil;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
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
        if(path.endsWith("/login") && method.equalsIgnoreCase("POST")){
            handleLogin(exchange);
        }
        if(path.endsWith("/verifyJwtToken") && method.equalsIgnoreCase("GET")){
            handleVerifyJwtToken(exchange);
        }

    }

    /**
     * This handler verify the validity of jwt token
     * @param exchange
     * @throws IOException
     */
    private void handleVerifyJwtToken(HttpExchange exchange) throws IOException {
        try {
            logger.info("Jwt token verification request recevied");
            String authorizationValue = exchange.getRequestHeaders().getFirst("Authorization");
            String token = authorizationValue.substring(7);
            logger.info("After expire function  : " + token);
            if (token == null || !authorizationValue.startsWith("Bearer ")) {
                logger.info("No Token found");
                HandlerUtil.sendResponse(exchange, 401, "Unauthorized");
                return;
            }
            if (JWTUtil.verifyToken(token)) {
                logger.info("Valid Token: " + token);
                exchange.sendResponseHeaders(204,-1);
                return;
            }
            logger.info("Invalid Token: " + token);
            HandlerUtil.sendResponse(exchange, 401, "Invalid Token");

        }
        catch (Exception e){
            HandlerUtil.sendResponse(exchange, 401, "Unauthorized");
        }
    }

    /**
     * This handler login user using postgres database
     * @param exchange
     * @throws IOException
     */
    private void handleLogin(HttpExchange exchange) throws IOException {
        String requestBody = new String(exchange.getRequestBody().readAllBytes(), StandardCharsets.UTF_8);
        Map<String,String> data = JsonUtil.fromJson((requestBody), Map.class);
        if(data == null){
            HandlerUtil.sendResponse(exchange,400, "Request body missing");
            return;
        }
        if(!(data.containsKey("usernameOrEmail") && data.containsKey("password"))){
            HandlerUtil.sendResponse(exchange, 400,"Invalid parameters for user");
            return;
        }

        try(Connection connection = PostgresConnector.getConnection();
        PreparedStatement statement = connection.prepareStatement("SELECT username, password FROM users WHERE username=? or email=?")){
            statement.setString(1,data.get("usernameOrEmail"));
            statement.setString(2,data.get("usernameOrEmail"));
            ResultSet resultSet = statement.executeQuery();
            if(resultSet.next() && PasswordUtil.verifyPassword(data.get("password"), resultSet.getString("password")) ){
                String JWTToken = JWTUtil.generateToken(resultSet.getString("username"));
                HandlerUtil.sendResponse(exchange,200, JsonUtil.toJson(Map.of("token", JWTToken)));
            }
            else{
                HandlerUtil.sendResponse(exchange, 401, "Invalid credentials");
            }
        } catch (SQLException e) {
            logger.fatal("Login error: "+e.getMessage());
            HandlerUtil.sendResponse(exchange,500,"Login failed: " + e.getMessage());
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
            return;
        }

        if(!(data.containsKey("username") && data.containsKey("name") && data.containsKey("email") && data.containsKey("password"))){
            HandlerUtil.sendResponse(exchange, 400,"Invalid parameters for user");
            return;
        }
        try(Connection connection = PostgresConnector.getConnection();
            PreparedStatement statement =
                    connection.prepareStatement("INSERT INTO users (username, name, email, password) VALUES (?,?,?,?) ON CONFLICT DO NOTHING");) {

            statement.setString(1, data.get("username"));
            statement.setString(2, data.get("name"));
            statement.setString(3, data.get("email"));
            statement.setString(4, PasswordUtil.hashPassword(data.get("password")));

            logger.info("Executing query: " + statement);

            int rows = statement.executeUpdate();

            if(rows == 0){
                logger.info("User: " + data.get("username") +" is already registered");
                HandlerUtil.sendResponse(exchange,409,"User is already registered");
            }
            else{
                logger.info("User: " + data.get("username") + " successfully registered");
                HandlerUtil.sendResponse(exchange,200, "User registered successfully");
            }

        } catch (SQLException e) {
            logger.fatal("Registration error: " + e.getMessage());
            HandlerUtil.sendResponse(exchange,500,"Registration failed: " + e.getMessage());
        }

    }

}
