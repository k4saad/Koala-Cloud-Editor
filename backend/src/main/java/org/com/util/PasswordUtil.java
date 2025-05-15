package org.com.util;

import org.mindrot.jbcrypt.BCrypt;

/**
 * This handles password hashing and verification using Bcrypt
 */
public class PasswordUtil {

    public static String hashPassword(String password){
        return BCrypt.hashpw(password, BCrypt.gensalt());
    }
    public static boolean verifyPassword(String password, String hashedPassword){
        return BCrypt.checkpw(password,hashedPassword);
    }
}
