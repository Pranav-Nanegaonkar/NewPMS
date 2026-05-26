package com.pms.service.impl;

import com.pms.dto.request.ChangePasswordRequest;
import com.pms.dto.request.LoginRequest;
import com.pms.dto.request.SignupRequest;
import com.pms.dto.response.AuthResponse;
import com.pms.dto.response.UserResponse;
import com.pms.entity.Role;
import com.pms.entity.User;
import com.pms.exception.BusinessException;
import com.pms.exception.ResourceNotFoundException;
import com.pms.repository.RoleRepository;
import com.pms.repository.UserRepository;
import com.pms.service.AuthService;
import com.pms.service.JwtService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.LockedException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;

    @Override
    public AuthResponse login(LoginRequest request) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.email(), request.password())
            );
        } catch (DisabledException e) {
            throw new BusinessException("Account is disabled");
        } catch (LockedException e) {
            throw new BusinessException("Account is locked");
        } catch (BadCredentialsException e) {
            throw new BusinessException("Invalid email or password");
        }

        User user = userRepository.findByEmail(request.email())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        String token = jwtService.generateToken(user);
        return buildAuthResponse(token, user);
    }

    @Override
    public AuthResponse signup(SignupRequest request) {
        if (userRepository.existsByEmail(request.email())) {
            throw new BusinessException("Email already in use: " + request.email());
        }

        Role role = roleRepository.findByName(request.role())
                .orElseThrow(() -> new ResourceNotFoundException("Role not found: " + request.role()));

        Set<Role> roles = new HashSet<>();
        roles.add(role);

        User user = User.builder()
                .fullName(request.fullName())
                .email(request.email())
                .password(passwordEncoder.encode(request.password()))
                .role(request.role())
                .department(request.department())
                .enabled(true)
                .accountNonLocked(true)
                .roles(roles)
                .build();

        user = userRepository.save(user);
        String token = jwtService.generateToken(user);
        return buildAuthResponse(token, user);
    }

    @Override
    public void changePassword(Long userId, ChangePasswordRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", userId));

        if (!passwordEncoder.matches(request.currentPassword(), user.getPassword())) {
            throw new BusinessException("Current password is incorrect");
        }

        if (!request.newPassword().equals(request.confirmPassword())) {
            throw new BusinessException("New password and confirm password do not match");
        }

        user.setPassword(passwordEncoder.encode(request.newPassword()));
        userRepository.save(user);
        log.info("Password changed successfully for user: {}", user.getEmail());
    }

    @Override
    @Transactional(readOnly = true)
    public boolean validateToken(String token) {
        return jwtService.validateToken(token);
    }

    // ─── Private Helpers ────────────────────────────────────────────────────────

    private AuthResponse buildAuthResponse(String token, User user) {
        Set<String> roleNames = user.getRoles().stream()
                .map(r -> r.getName().name())
                .collect(Collectors.toSet());

        UserResponse userResponse = UserResponse.builder()
                .id(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .role(user.getRole())
                .roles(roleNames)
                .department(user.getDepartment())
                .enabled(user.isEnabled())
                .accountNonLocked(user.isAccountNonLocked())
                .createdAt(user.getCreatedAt())
                .updatedAt(user.getUpdatedAt())
                .build();

        return AuthResponse.builder()
                .token(token)
                .user(userResponse)
                .build();
    }
}
