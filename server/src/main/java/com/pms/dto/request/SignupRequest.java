package com.pms.dto.request;

import com.pms.enums.UserRole;
import jakarta.validation.constraints.*;

public record SignupRequest(
        @NotBlank(message = "Full name is required")
        @Size(min = 2, max = 100, message = "Full name must be between 2 and 100 characters")
        String fullName,

        @NotBlank(message = "Email is required")
        @Email(message = "Invalid email format")
        String email,

        @NotBlank(message = "Password is required")
        @Pattern(
                regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$",
                message = "Password must be at least 8 characters with uppercase, lowercase, digit, and special character"
        )
        String password,

        @NotNull(message = "Role is required")
        UserRole role,

        String department
) {}
