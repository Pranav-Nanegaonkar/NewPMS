package com.pms.dto.response;

import com.pms.enums.UserRole;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.Set;

@Data
@Builder
public class UserResponse {
    private Long id;
    private String fullName;
    private String email;
    private UserRole role;
    private Set<String> roles;
    private String department;
    private boolean enabled;
    private boolean accountNonLocked;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}