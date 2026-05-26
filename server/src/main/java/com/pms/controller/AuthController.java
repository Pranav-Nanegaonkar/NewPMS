package com.pms.controller;

import com.pms.dto.request.ChangePasswordRequest;
import com.pms.dto.request.LoginRequest;
import com.pms.dto.request.SignupRequest;
import com.pms.dto.response.ApiResponse;
import com.pms.dto.response.AuthResponse;
import com.pms.service.AuthService;
import com.pms.service.JwtService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final JwtService jwtService;

    @PostMapping("/signup")
    public ResponseEntity<ApiResponse<AuthResponse>> signup(
            @Valid @RequestBody SignupRequest request) {
        AuthResponse response = authService.signup(request);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ApiResponse.success(response, "User registered successfully"));
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(
            @Valid @RequestBody LoginRequest request) {
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(ApiResponse.success(response, "Login successful"));
    }

    @PostMapping("/change-password")
    public ResponseEntity<ApiResponse<Void>> changePassword(
            @RequestHeader("Authorization") String authHeader,
            @Valid @RequestBody ChangePasswordRequest request) {

        String token = extractToken(authHeader);
        Long userId = jwtService.extractUserId(token);
        authService.changePassword(userId, request);
        return ResponseEntity.ok(ApiResponse.success(null, "Password changed successfully"));
    }

    @GetMapping("/validate")
    public ResponseEntity<ApiResponse<Boolean>> validateToken(
            @RequestHeader("Authorization") String authHeader) {
        String token = extractToken(authHeader);
        boolean valid = authService.validateToken(token);
        return ResponseEntity.ok(ApiResponse.success(valid, "Token validation result"));
    }

    private String extractToken(String authHeader) {
        if (StringUtils.hasText(authHeader) && authHeader.startsWith("Bearer ")) {
            return authHeader.substring(7);
        }
        throw new IllegalArgumentException("Invalid Authorization header");
    }
}
