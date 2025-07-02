package org.com.util;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.com.db.PostgresConnector;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

public class ProjectUtil {
    private static final Logger logger = LogManager.getLogger(ProjectUtil.class);

    public static boolean hasProjectAccess(String username, Integer projectId){
        try(Connection connection = PostgresConnector.getConnection();
                PreparedStatement statement = connection.prepareStatement(
                        "SELECT 1 FROM projects p WHERE p.id = ? AND p.owner_id = (SELECT id FROM users WHERE username = ?) " +
                                "UNION " +
                            "SELECT 1 FROM collaborators c JOIN users u ON c.user_id = u.id WHERE c.project_id = ? AND u.username = ?"
                )
        ){
            statement.setInt(1,projectId);
            statement.setString(2,username);
            statement.setInt(3,projectId);
            statement.setString(4,username);
            ResultSet result = statement.executeQuery();
            return result.next();
        } catch (SQLException e) {
            logger.warn("Error : " + e.getMessage());
            return false;
        }
    }

    public static boolean isOwner(String username, int projectId) {
        try (Connection connection = PostgresConnector.getConnection();
             PreparedStatement statement = connection.prepareStatement("SELECT 1 FROM projects p WHERE p.id = ? AND p.owner_id = (SELECT id FROM users WHERE username = ?)")
        ){

            statement.setInt(1,projectId);
            statement.setString(2,username);

            ResultSet result = statement.executeQuery();

            if(result.next()){
                logger.info(result);
                return true;
            }
            return false;

        } catch (SQLException e) {
            logger.warn("Error : " + e.getMessage());
            return false;
        }
    }
}
