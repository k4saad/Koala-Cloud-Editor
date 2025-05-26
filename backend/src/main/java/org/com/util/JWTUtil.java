package org.com.util;

import com.sun.net.httpserver.HttpExchange;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;

import javax.crypto.KeyGenerator;
import javax.crypto.SecretKey;
import java.security.NoSuchAlgorithmException;
import java.util.Base64;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

/**
 * This JWTUtil class deals with functions related to jwt tokens like generation, verification etc
 */
public class JWTUtil {
    private static final String secretKey;

    static{
        try {
            KeyGenerator keyGen = KeyGenerator.getInstance("HmacSHA256");
            SecretKey sk = keyGen.generateKey();
            secretKey = Base64.getEncoder().encodeToString(sk.getEncoded());
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException(e);
        }
    }

    /**
     * This method generate token for forget password link, and is sent via email, and is valid for 3 hours
     * @param email
     * @return
     */
    public static String generateTokenForEmail(String email) {
        Map<String, Object> claims = new HashMap<>();
        return Jwts.builder()
                .claims()
                .add(claims)
                .subject(email)
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60 * 3))
                .and()
                .signWith(getKey())
                .compact();
    }

    /**
     * This method generate token for authentication, token is valid for 10 hours
     * @param username
     * @return
     */
    public static String generateToken(String username) {
        Map<String, Object> claims = new HashMap<>();

        return Jwts.builder()
                .claims()
                .add(claims)
                .subject(username)
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis() + 60 * 60 * 1000 * 10))
                .and()
                .signWith(getKey())
                .compact();
    }

    private static SecretKey getKey() {
        byte[] keyBytes = Decoders.BASE64.decode(secretKey);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    /**
     * Extract the username from jwt token
     * @param token
     * @return
     */
    public static String extractUserName(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    /**
     * Extract email from jwt token
     * @param token
     * @return
     */
    public static String extractEmail(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    private static <T> T extractClaim(String token, Function<Claims, T> claimResolver) {
        final Claims claims = extractAllClaims(token);
        return claimResolver.apply(claims);
    }

    private static Claims extractAllClaims(String token) {
        return Jwts.parser()
                .verifyWith(getKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    public static boolean verifyToken(String token, String username) {
        final String JWTUserName = extractUserName(token);
        return (JWTUserName.equals(username) && !isTokenExpired(token));
    }

    public static boolean verifyToken(String token) {
        return (!isTokenExpired(token));
    }

    public static boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    public static Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    public static String getToken(HttpExchange exchange) {
        String authorizationValue = exchange.getRequestHeaders().getFirst("Authorization");
        if (!authorizationValue.startsWith("Bearer ")) {
            return null;
        }
        return authorizationValue.substring(7);
    }
}
