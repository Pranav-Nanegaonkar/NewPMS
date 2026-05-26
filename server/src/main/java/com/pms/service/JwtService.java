package com.pms.service;

import com.pms.entity.User;

import java.util.List;

public interface JwtService {

    String generateToken(User user);

    boolean validateToken(String token);

    Long extractUserId(String token);

    String extractEmail(String token);

    List<String> extractRoles(String token);

    boolean isTokenExpired(String token);
}
