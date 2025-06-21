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
        hikariConfig.setMaximumPoolSize(5);
        dataSource = new HikariDataSource(hikariConfig);
        logger.info("Connection pool initialized for Postgres with max pool size: {}", hikariConfig.getMaximumPoolSize());

        Runtime.getRuntime().addShutdownHook(new Thread(PostgresConnector::close));
    }


    public static Connection getConnection() throws SQLException {
        Connection connection = dataSource.getConnection();
        logger.info("Connection obtained from HikariCP pool. Active connections: {}", dataSource.getHikariPoolMXBean().getActiveConnections());
        return connection;
    }



    public static void close(){
        if(dataSource != null){
            dataSource.close();
            logger.info("Hikaricp connection pool closed");
        }
    }
}

