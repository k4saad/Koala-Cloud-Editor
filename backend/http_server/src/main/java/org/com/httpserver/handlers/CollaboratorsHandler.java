package org.com.httpserver.handlers;

import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.com.db.PostgresConnector;
import org.com.util.HandlerUtil;
import org.com.util.JWTUtil;
import org.com.util.JsonUtil;
import org.com.util.ProjectUtil;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * CollaboratorsHandler manages collaborators
 */
public class CollaboratorsHandler implements HttpHandler {
    private static final Logger logger = LogManager.getLogger(CollaboratorsHandler.class);

    @Override
    public void handle(HttpExchange exchange) throws IOException {
        HandlerUtil.corsHandler(exchange);

        String method = exchange.getRequestMethod();

        switch (method) {
            case "OPTIONS" -> exchange.sendResponseHeaders(204, -1);
            case "GET" -> getCollaborators(exchange);
            case "DELETE" -> deleteCollaborators(exchange);
            case "POST" -> addCollaborator(exchange);
            default -> exchange.sendResponseHeaders(404, -1);
        }

    }

    private void addCollaborator(HttpExchange exchange) throws IOException {
        String token = JWTUtil.getToken(exchange);
        try{
            if (token == null || !JWTUtil.verifyToken(token)) {
                HandlerUtil.sendResponse(exchange, 401, "Unauthorized");
                return;
            }
        }catch (Exception exception){
            logger.warn(exception.getMessage());
            HandlerUtil.sendResponse(exchange, 401, "Unauthorized");
            return;
        }

        String requestBody = new String(exchange.getRequestBody().readAllBytes(), StandardCharsets.UTF_8);
        Map<String, String> data = JsonUtil.fromJson(requestBody, Map.class);
        int projectId;
        String usernameOrEmail;

        if(data == null || !(data.containsKey("usernameOrEmail") || !(data.containsKey("projectId")))){
            logger.error("usernameOrEmail or projectId not specified");
            HandlerUtil.sendResponse(exchange, 400, "UsernameOrEmail or projectId not present");
            return;
        }

        try{
            projectId = Integer.parseInt(data.get("projectId"));
            usernameOrEmail = data.get("usernameOrEmail");
        }catch (Exception exception){
            logger.info(exception);
            HandlerUtil.sendResponse(exchange, 500, "Adding collaborator error: " + exception.getMessage());
            return;
        }
        if(!ProjectUtil.isOwner(JWTUtil.extractUserName(token), projectId)){
            HandlerUtil.sendResponse(exchange, 401, "Unauthorized");
            return;
        }

        try(Connection connection = PostgresConnector.getConnection();
            PreparedStatement statement = connection.prepareStatement("INSERT INTO collaborators (project_id, user_id) VALUES (?, (SELECT id FROM users WHERE username = ? or email = ?))")
        ) {
            statement.setInt(1, projectId);
            statement.setString(2, usernameOrEmail);
            statement.setString(3, usernameOrEmail);

            int rowsAffected = statement.executeUpdate();
            if(rowsAffected > 0){
                logger.info("rows affected");
                HandlerUtil.sendResponse(exchange,201, JsonUtil.toJson(Map.of("name" , usernameOrEmail)));
                return;
            }
            else{
                logger.info("no rows affected");
            }
        } catch (SQLException exception) {
            logger.fatal("Adding collaborator error: " + exception.getMessage());
            HandlerUtil.sendResponse(exchange, 409, "No user found");
        } catch (Exception exception){
            logger.fatal("Adding collaborator error: " + exception.getMessage());
            HandlerUtil.sendResponse(exchange, 500, "Adding collaborator error: " + exception.getMessage());
        }
    }

    private void deleteCollaborators(HttpExchange exchange) throws IOException {
        String token = JWTUtil.getToken(exchange);
        String username;
        Integer projectId;
        try{
            if (token == null || !JWTUtil.verifyToken(token)) {
                HandlerUtil.sendResponse(exchange, 401, "Unauthorized");
                return;
            }
        }catch (Exception exception){
            logger.warn(exception.getMessage());
            HandlerUtil.sendResponse(exchange, 401, "Unauthorized");
            return;
        }

        String[] query = exchange.getRequestURI().getQuery().split("&");
        logger.info(query);
        if(query.length != 2){
            logger.warn("Missing query parameters");
            HandlerUtil.sendResponse(exchange, 400, "Missing username or projectId");
            return;
        }

        try{
            username = query[0];
            projectId = Integer.parseInt(query[1]);
        }catch (Exception exception){
            logger.warn("Invalid query parameters");
            HandlerUtil.sendResponse(exchange, 400, "Invalid username or projectId");
            return;
        }

        try(Connection connection = PostgresConnector.getConnection();
            PreparedStatement statement = connection.prepareStatement("DELETE FROM collaborators c WHERE c.project_id = ? AND c.user_id = (SELECT id FROM users u WHERE u.username = ?)")
        ){
            statement.setInt(1,projectId);
            statement.setString(2,username);

            int rowsAffected = statement.executeUpdate();
            if(rowsAffected > 0){
                HandlerUtil.sendResponse(exchange,200, JsonUtil.toJson(Map.of("name", username)));
                return;
            }
            else{
                logger.info("No rows affected");
                HandlerUtil.sendResponse(exchange, 400, "Error");
                return;
            }
        } catch (SQLException exception) {
            logger.error("Exception: {}", exception.getMessage());
            HandlerUtil.sendResponse(exchange, 500, "Error: " + exception.getMessage());
            return;
        }
    }

    private void getCollaborators(HttpExchange exchange) throws IOException {
        String token = JWTUtil.getToken(exchange);
        try{
            if (token == null || !JWTUtil.verifyToken(token)) {
                HandlerUtil.sendResponse(exchange, 401, "Unauthorized");
                return;
            }
        }catch (Exception exception){
            logger.warn(exception.getMessage());
            HandlerUtil.sendResponse(exchange, 401, "Unauthorized");
            return;
        }
        // method to handle parameterized request
        if(exchange.getRequestURI().getQuery() != null){
            Integer projectId;
            try{
                projectId = Integer.parseInt(exchange.getRequestURI().getQuery());
            } catch (Exception exception){
                logger.warn("Invalid query parameters");
                HandlerUtil.sendResponse(exchange, 400, "Invalid projectId");
                return;
            }
            try(Connection connection = PostgresConnector.getConnection();
                PreparedStatement statement = connection.prepareStatement("SELECT u.username FROM collaborators c JOIN users u on c.user_id = u.id WHERE c.project_id = ?")
            ) {
                statement.setInt(1,projectId);
                ResultSet resultSet = statement.executeQuery();
                List<Map<String, Object>> collaborators = new ArrayList<>();
                while (resultSet.next()) {
                    collaborators.add(Map.of("username", resultSet.getString("username")));
                }
                HandlerUtil.sendResponse(exchange, 200, JsonUtil.toJson(collaborators));
                return;
            } catch (SQLException exception) {
                logger.error("Exception: {}", exception.getMessage());
                HandlerUtil.sendResponse(exchange, 500, "Error: " + exception.getMessage());
                return;
            }
        }
        else{
            logger.error("Invalid url format");
            HandlerUtil.sendResponse(exchange,400, "Invalid url format");
            return;
        }
    }
}
