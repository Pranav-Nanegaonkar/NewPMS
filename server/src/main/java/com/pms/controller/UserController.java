package com.pms.controller;

import com.pms.dto.request.UserRequest;
import com.pms.dto.response.ApiResponse;
import com.pms.dto.response.UserResponse;
import com.pms.enums.UserRole;
import com.pms.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class UserController {

    private final UserService userService;

    // POST /api/v1/users
    @PostMapping
    public ResponseEntity<ApiResponse<UserResponse>> createUser(
            @Valid @RequestBody UserRequest request) {
        UserResponse response = userService.createUser(request);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ApiResponse.success(response, "User created successfully"));
    }

    // GET /api/v1/users/{id}
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<UserResponse>> getUserById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(userService.getUserById(id)));
    }

    // GET /api/v1/users/email/{email}
    @GetMapping("/email/{email}")
    public ResponseEntity<ApiResponse<UserResponse>> getUserByEmail(@PathVariable String email) {
        return ResponseEntity.ok(ApiResponse.success(userService.getUserByEmail(email)));
    }

    // GET /api/v1/users
    @GetMapping
    public ResponseEntity<ApiResponse<List<UserResponse>>> getAllUsers() {
        return ResponseEntity.ok(ApiResponse.success(userService.getAllUsers()));
    }

    // GET /api/v1/users/role/{role}
    @GetMapping("/role/{role}")
    public ResponseEntity<ApiResponse<List<UserResponse>>> getUsersByRole(
            @PathVariable UserRole role) {
        return ResponseEntity.ok(ApiResponse.success(userService.getUsersByRole(role)));
    }

    // GET /api/v1/users/department/{department}
    @GetMapping("/department/{department}")
    public ResponseEntity<ApiResponse<List<UserResponse>>> getUsersByDepartment(
            @PathVariable String department) {
        return ResponseEntity.ok(ApiResponse.success(userService.getUsersByDepartment(department)));
    }

    // GET /api/v1/users/search?keyword=
    @GetMapping("/search")
    public ResponseEntity<ApiResponse<List<UserResponse>>> searchUsers(
            @RequestParam String keyword) {
        return ResponseEntity.ok(ApiResponse.success(userService.searchUsers(keyword)));
    }

    // PUT /api/v1/users/{id}
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<UserResponse>> updateUser(
            @PathVariable Long id,
            @Valid @RequestBody UserRequest request) {
        return ResponseEntity.ok(
                ApiResponse.success(userService.updateUser(id, request), "User updated successfully"));
    }

    // DELETE /api/v1/users/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.ok(ApiResponse.success(null, "User deleted successfully"));
    }
}