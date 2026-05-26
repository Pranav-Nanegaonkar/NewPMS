package com.pms.dto.response;

import com.pms.enums.ProjectMemberRole;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class ProjectMemberResponse {
    private Long id;
    private Long projectId;
    private String projectName;
    private UserResponse user;
    private ProjectMemberRole roleInProject;
    private LocalDateTime joinedAt;
}