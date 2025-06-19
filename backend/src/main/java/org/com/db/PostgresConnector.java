package org.com.db;

import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.com.config.ConfigurationManager;

import java.sql.Connection;
import java.sql.SQLException;
import java.sql.Statement;

/**
 * PostgresConnector class is the class that uses HikariCP and provide connection pool to
 * postgres db
 */
public class PostgresConnector {

    private static final Logger logger = LogManager.getLogger(PostgresConnector.class);
    private static final HikariDataSource dataSource;

    static {
        HikariConfig hikariConfig = new HikariConfig();
        hikariConfig.setJdbcUrl(ConfigurationManager.getInstance().getPostgresUrl());
        hikariConfig.setUsername(ConfigurationManager.getInstance().getPostgresUser());
        hikariConfig.setPassword(ConfigurationManager.getInstance().getPostgresPassword());
        hikariConfig.setMaximumPoolSize(10);
        dataSource = new HikariDataSource(hikariConfig);
        logger.info("Connection pool initialized for Postgres with max pool size: {}", hikariConfig.getMaximumPoolSize());

        createTables();
    }


    public static Connection getConnection() throws SQLException {
        Connection connection = dataSource.getConnection();
        logger.info("Connection obtained from HikariCP pool. Active connections: {}", dataSource.getHikariPoolMXBean().getActiveConnections());
        return connection;
    }

    private static void createTables() {
        String createTablesSql = """
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                username VARCHAR(50) UNIQUE NOT NULL,
                name VARCHAR(100) NOT NULL,
                email VARCHAR(100) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL
            );
            CREATE TABLE IF NOT EXISTS projects (
                id SERIAL PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                owner_id INTEGER NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE,
                CONSTRAINT unique_project_name_per_user UNIQUE (owner_id, name)
            );
            CREATE TABLE IF NOT EXISTS collaborators (
                project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE,
                user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
                PRIMARY KEY (project_id, user_id)
            );
        """;
        try(Connection connection = getConnection();
        Statement statement = connection.createStatement()){
            statement.executeUpdate(createTablesSql);
            logger.info("Tables Created");
        } catch (SQLException e) {
            logger.fatal("Error: " + e.getMessage());
        }
        Runtime.getRuntime().addShutdownHook(new Thread(PostgresConnector::close));
    }

    public static void close(){
        if(dataSource != null){
            dataSource.close();
            logger.info("Hikaricp connection pool closed");
        }
    }
}

