package org.com.httpserver.handlers;

import com.mongodb.client.MongoCollection;
import com.mongodb.client.model.Filters;
import com.mongodb.client.result.DeleteResult;
import com.mongodb.client.result.InsertOneResult;
import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.bson.Document;
import org.bson.conversions.Bson;
import org.com.db.MongoConnector;
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
import java.util.Arrays;
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

        switch (method){
            case "OPTIONS" -> exchange.sendResponseHeaders(204, -1);
            case "GET" -> getAllProjects(exchange);
            case "POST" -> createProject(exchange);
            case "DELETE" -> deleteProject(exchange);
            default -> exchange.sendResponseHeaders(404,-1);
        }

    }

    private void deleteProject(HttpExchange exchange) throws IOException {
        String token = JWTUtil.getToken(exchange);
        if(token == null){
            HandlerUtil.sendResponse(exchange, 401, "Unauthorized");
            return;
        }
        try(Connection connection = PostgresConnector.getConnection();
            PreparedStatement statement = connection.prepareStatement("DELETE FROM projects WHERE id = ? AND owner_id = (SELECT id FROM users WHERE username = ?)");
        ){
            String path = exchange.getRequestURI().getPath();
            Integer id = Integer.parseInt(path.substring(path.lastIndexOf("/")+1));

            statement.setInt(1,id);
            statement.setString(2,JWTUtil.extractUserName(token));

            int rows = statement.executeUpdate();

            if (rows == 0) {
                HandlerUtil.sendResponse(exchange, 404, "Project not found");
            } else {

                // Here I delete the project structure stored in mongoDB
                MongoCollection<Document> collection = MongoConnector.getCollection();
                Bson filter = Filters.eq("project_id", id);
                DeleteResult deleteResult = collection.deleteOne(filter);
                logger.info("Deleted projects: " + deleteResult.getDeletedCount());

                HandlerUtil.sendResponse(exchange, 200, "Project deleted");
            }

        } catch (NumberFormatException e){
           logger.error("Invalid url format");
           HandlerUtil.sendResponse(exchange,400, "Error parsing project id");
        } catch (SQLException e) {
            logger.fatal("Project deletion error: " + e.getMessage());
            HandlerUtil.sendResponse(exchange,500,"Project deletion error: " + e.getMessage());
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
                int projectId = resultSet.getInt("id");
                HandlerUtil.sendResponse(exchange, 200, JsonUtil.toJson(Map.of("id", projectId)));

                String empty_project = String.format("""
                    {
                        "project_id" : %d,
                        "root" : []
                    }
                """, projectId);
                // Here I will add default project structure in mongo db
                MongoCollection<Document> collection = MongoConnector.getCollection();
                InsertOneResult result = collection.insertOne(Document.parse(empty_project));
                logger.info("Project created successfully");
                logger.info("Added project structure to the mongoDB with id: {}", result.getInsertedId().asObjectId().getValue());

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
