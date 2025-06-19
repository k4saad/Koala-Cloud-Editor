package org.com.websocket;

import com.mongodb.client.MongoCollection;
import com.mongodb.client.model.Filters;
import com.mongodb.client.result.UpdateResult;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.bson.Document;
import org.com.config.ConfigurationManager;
import org.com.db.MongoConnector;
import org.com.util.JWTUtil;
import org.com.util.ThreadPoolManager;
import org.java_websocket.WebSocket;
import org.java_websocket.handshake.ClientHandshake;
import org.java_websocket.server.WebSocketServer;

import java.net.InetSocketAddress;
import java.util.HashMap;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ExecutorService;

import static org.com.util.ProjectUtil.hasProjectAccess;

public class WebSocketServerSetup extends WebSocketServer {
    private static final Logger logger = LogManager.getLogger(WebSocketServerSetup.class);
    private final Map<Integer, Set<WebSocket>> projectClients = new ConcurrentHashMap<>();
    private final ExecutorService executorService = ThreadPoolManager.getWebSocketThreadPool();

    public WebSocketServerSetup() {
        super(new InetSocketAddress(ConfigurationManager.getInstance().getWebSocketPort()));
    }

    @Override
    public void onOpen(WebSocket conn, ClientHandshake handshake) {
        Map<String, String> queryParams = new HashMap<>();
        String query = handshake.getResourceDescriptor();
        if (query.startsWith("/?")) {
            query = query.substring(2);
        }

        String[] pairs = query.split("&");
        for (String pair : pairs) {
            String[] keyValue = pair.split("=", 2);
            if (keyValue.length == 2) {
                queryParams.put(keyValue[0], keyValue[1]);
            }
        }
        if(!queryParams.containsKey("projectId") || !queryParams.containsKey("Authorization")){
            conn.close(1008, "Missing parameters");
            return;
        }
        String token = queryParams.get("Authorization").substring(9);
        System.out.println(queryParams.get("Authorization"));
        System.out.println(token);

        Integer projectId = Integer.parseInt(queryParams.get("projectId"));
        String username = JWTUtil.extractUserName(token);
        try{
            if(!hasProjectAccess(username, projectId)){
                logger.warn("User " + username + " has no access to project " + projectId);
                conn.close(1008, "Unauthorized");
                return;
            }
        } catch (Exception exception){
            logger.warn("Username cannot be extracted");
            conn.close(1008, "Unauthorized");
        }

        // now add the user to the map
        projectClients.computeIfAbsent(projectId, k -> ConcurrentHashMap.newKeySet()).add(conn);
        logger.info("WebSocket connection opened for project: " + projectId + ", user: " + username);
    }

    @Override
    public void onClose(WebSocket conn, int code, String reason, boolean remote) {
        projectClients.values().forEach(k -> k.remove(conn));
        logger.info("WebSocket connection closed: " + reason);
    }

    @Override
    public void onMessage(WebSocket conn, String message) {
        executorService.submit(() -> {
            Integer projectId = null;
            for(Map.Entry<Integer, Set<WebSocket>> entry : projectClients.entrySet()){
                if(entry.getValue().contains(conn)){
                    projectId = entry.getKey();
                    break;
                }
            }
            // save in db
            MongoCollection<Document> collection = MongoConnector.getCollection();
            UpdateResult result = collection.replaceOne(Filters.eq("project_id", projectId),Document.parse(message));
            logger.info(result.toString());
            if(result.getModifiedCount() > 0){
                Set<WebSocket> clients = projectClients.get(projectId);
                for(WebSocket client : clients){
                    if(client != conn && client.isOpen()){
                        client.send(message);
                    }
                }
                logger.info("Broadcast message to project:" + projectId);
            }
        });
    }

    @Override
    public void onError(WebSocket conn, Exception ex) {
        logger.fatal("WebSocket Error: " + ex.getMessage());
        if(conn != null){
            conn.close(1011, "Server Error");
        }
    }

    @Override
    public void onStart() {
        logger.info("WebSocket server started on port " + ConfigurationManager.getInstance().getWebSocketPort());
    }
}
