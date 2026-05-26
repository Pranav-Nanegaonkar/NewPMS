package com.pms.dto.request;

import com.pms.enums.ProjectMemberRole;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ProjectMemberRequest {

    @NotNull(message = "User ID is required")
    private Long userId;

    @NotNull(message = "Role is required")
    private ProjectMemberRole roleInProject;
}