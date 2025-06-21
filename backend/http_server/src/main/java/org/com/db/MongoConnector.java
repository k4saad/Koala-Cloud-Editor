package org.com.db;

import com.mongodb.ConnectionString;
import com.mongodb.MongoClientSettings;
import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import com.mongodb.client.model.IndexOptions;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.bson.Document;
import org.com.config.ConfigurationManager;

import java.util.concurrent.TimeUnit;

/**
 * MongoConnector is a class that manages connection
 */
public class MongoConnector {
    private static final Logger logger = LogManager.getLogger(MongoConnector.class);
    private static final MongoClient client;

    static{
        client = MongoClients.create(MongoClientSettings
                .builder()
                .applyConnectionString(new ConnectionString(ConfigurationManager.getInstance().getMongoUrl()))
                .applyToConnectionPoolSettings(builder ->
                        builder
                                .maxSize(5)
                                .maxWaitTime(5, TimeUnit.SECONDS)
                )
                .build()
        );
        client
                .getDatabase("koala_db")
                .getCollection("project_structure")
                .createIndex(new Document("project_id",1),new IndexOptions().unique(true));
        logger.info("Connected to MongoDB");
        Runtime.getRuntime().addShutdownHook(new Thread(MongoConnector::close));
    }

    public static MongoDatabase getDatabase(){
        return client.getDatabase("koala_db");
    }
    public static MongoCollection<Document> getCollection(){
        return getDatabase().getCollection("project_structure");
    }

    public static void close(){
        if(client != null){
            client.close();
            logger.info("MongoDB connection closed");
        }
    }
}
