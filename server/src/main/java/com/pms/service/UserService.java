package com.pms.service;

import com.pms.dto.request.UserRequest;
import com.pms.dto.response.UserResponse;
import com.pms.enums.UserRole;

import java.util.List;

public interface UserService {
    UserResponse createUser(UserRequest request);
    UserResponse getUserById(Long id);
    UserResponse getUserByEmail(String email);
    List<UserResponse> getAllUsers();
    List<UserResponse> getUsersByRole(UserRole role);
    List<UserResponse> getUsersByDepartment(String department);
    List<UserResponse> searchUsers(String keyword);
    UserResponse updateUser(Long id, UserRequest request);
    void deleteUser(Long id);
}