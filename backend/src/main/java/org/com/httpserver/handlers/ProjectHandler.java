package org.com.httpserver.handlers;

import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.com.db.PostgresConnector;
import org.com.util.HandlerUtil;
import org.com.util.JWTUtil;
import org.com.util.JsonUtil;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * Project Handler handles project CRUD operation
 */
public class ProjectHandler implements HttpHandler {

    private static final Logger logger = LogManager.getLogger(ProjectHandler.class);

    @Override
    public void handle(HttpExchange exchange) throws IOException {
        HandlerUtil.corsHandler(exchange);

        String method = exchange.getRequestMethod();

        if (method.equalsIgnoreCase("OPTIONS")){
            logger.info("preflight request arrived");
            exchange.sendResponseHeaders(204, -1);
            return;
        }
        if(method.equalsIgnoreCase("GET")){
            getAllProjects(exchange);
        }
        if(method.equalsIgnoreCase("POST")){
            createProject(exchange);
        }
        else{
            exchange.sendResponseHeaders(404,-1);
            return;
        }

    }

    private void getAllProjects(HttpExchange exchange) throws IOException {

        String token = JWTUtil.getToken(exchange);
        if(token == null){
            HandlerUtil.sendResponse(exchange, 401, "Unauthorized");
            return;
        }
        try(Connection connection = PostgresConnector.getConnection();
            PreparedStatement statement = connection.prepareStatement("SELECT p.id, p.name, p.created_at FROM projects p JOIN users u ON p.owner_id = u.id WHERE u.username = ?");
        ) {
            statement.setString(1,JWTUtil.extractUserName(token));
            ResultSet resultSet = statement.executeQuery();
            List<Map<String,Object>> projects = new ArrayList<>();
            while(resultSet.next()){
                projects.add(Map.of("id", resultSet.getInt("id"), "name" , resultSet.getString("name"), "creationDate", resultSet.getTimestamp("created_at")));
            }
            HandlerUtil.sendResponse(exchange,200, JsonUtil.toJson(projects));
        } catch (SQLException e) {
            logger.fatal("Project fetching error: " + e.getMessage());
            HandlerUtil.sendResponse(exchange,500,"Project fetching error: " + e.getMessage());
        }
    }

    private void createProject(HttpExchange exchange) throws IOException {

        String token = JWTUtil.getToken(exchange);
        if(token == null){
            HandlerUtil.sendResponse(exchange, 401, "Unauthorized");
            return;
        }

        String requestBody = new String(exchange.getRequestBody().readAllBytes(),StandardCharsets.UTF_8);
        Map<String,String> data = JsonUtil.fromJson(requestBody,Map.class);
        if(data == null || !(data.containsKey("projectName"))){
            logger.error("Unauthorized access");
            HandlerUtil.sendResponse(exchange, 400, "Project name not found");
            return;
        }
        try(Connection connection = PostgresConnector.getConnection();
            PreparedStatement statement = connection.prepareStatement("INSERT INTO projects (name, owner_id) SELECT ?, users.id FROM users WHERE username = ? RETURNING id");
        ){
            statement.setString(1,data.get("projectName"));
            statement.setString(2,JWTUtil.extractUserName(token));
            ResultSet resultSet = statement.executeQuery();
            if(resultSet.next()){
                logger.info("Project created successfully");
                int projectId = resultSet.getInt("id");
                HandlerUtil.sendResponse(exchange, 200, JsonUtil.toJson(Map.of("id", projectId)));
            }
            else{
                logger.fatal("Project creation error");
                HandlerUtil.sendResponse(exchange,500,"Project creation error");
            }

        } catch (SQLException e) {
            logger.fatal("Project creation error: " + e.getMessage());
            HandlerUtil.sendResponse(exchange,500,"Project creation error: " + e.getMessage());
        }
    }
}
