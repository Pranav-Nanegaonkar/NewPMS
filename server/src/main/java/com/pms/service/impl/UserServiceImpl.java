package com.pms.service.impl;

import com.pms.dto.request.UserRequest;
import com.pms.dto.response.UserResponse;
import com.pms.entity.User;
import com.pms.enums.UserRole;
import com.pms.exception.BusinessException;
import com.pms.exception.ResourceNotFoundException;
import com.pms.repository.UserRepository;
import com.pms.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    @Override
    public UserResponse createUser(UserRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BusinessException("User with email " + request.getEmail() + " already exists");
        }

        User user = User.builder()
                .fullName(request.getFullName())
                .email(request.getEmail())
                .role(request.getRole())
                .department(request.getDepartment())
                .build();

        return mapToResponse(userRepository.save(user));
    }

    @Override
    @Transactional(readOnly = true)
    public UserResponse getUserById(Long id) {
        return mapToResponse(findUserById(id));
    }

    @Override
    @Transactional(readOnly = true)
    public UserResponse getUserByEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));
        return mapToResponse(user);
    }

    @Override
    @Transactional(readOnly = true)
    public List<UserResponse> getAllUsers() {
        return userRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<UserResponse> getUsersByRole(UserRole role) {
        return userRepository.findByRole(role).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<UserResponse> getUsersByDepartment(String department) {
        return userRepository.findByDepartment(department).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<UserResponse> searchUsers(String keyword) {
        return userRepository.searchByKeyword(keyword).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public UserResponse updateUser(Long id, UserRequest request) {
        User user = findUserById(id);

        if (!user.getEmail().equals(request.getEmail()) &&
                userRepository.existsByEmail(request.getEmail())) {
            throw new BusinessException("Email " + request.getEmail() + " is already taken");
        }

        user.setFullName(request.getFullName());
        user.setEmail(request.getEmail());
        user.setRole(request.getRole());
        user.setDepartment(request.getDepartment());

        return mapToResponse(userRepository.save(user));
    }

    @Override
    public void deleteUser(Long id) {
        User user = findUserById(id);
        userRepository.delete(user);
    }

    // ─── Private Helpers ────────────────────────────────────────────────────────

    private User findUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User", id));
    }

    public UserResponse mapToResponse(User user) {
        Set<String> roleNames = user.getRoles() != null
                ? user.getRoles().stream()
                        .map(r -> r.getName().name())
                        .collect(java.util.stream.Collectors.toSet())
                : new java.util.HashSet<>();

        return UserResponse.builder()
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
    }
}