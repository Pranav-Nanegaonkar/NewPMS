package com.pms.service;

import com.pms.dto.request.ChangePasswordRequest;
import com.pms.dto.request.LoginRequest;
import com.pms.dto.request.SignupRequest;
import com.pms.dto.response.AuthResponse;

public interface AuthService {

    AuthResponse login(LoginRequest request);

    AuthResponse signup(SignupRequest request);

    void changePassword(Long userId, ChangePasswordRequest request);

    boolean validateToken(String token);
}
