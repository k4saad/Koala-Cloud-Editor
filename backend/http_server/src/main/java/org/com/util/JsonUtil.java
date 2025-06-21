package org.com.util;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

/**
 * JsonUtil handles JSON serialization and deserialization using Jackson object mapper
 */
public class JsonUtil {
    private static final ObjectMapper mapper = new ObjectMapper();
    private static final Logger logger = LogManager.getLogger(JsonUtil.class);
    public static <T> T fromJson(String json, Class<T> clazz){
        try{
            return mapper.readValue(json, clazz);
        }
        catch (Exception e){
            logger.fatal("JSON Deserialization error");
            return null;
        }
    }
    public static String toJson(Object object){
        try{
            return mapper.writeValueAsString(object);
        } catch (JsonProcessingException e) {
            logger.fatal("JSON Serialization error: " + e.getMessage());
            return "{}";
        }
    }
}
