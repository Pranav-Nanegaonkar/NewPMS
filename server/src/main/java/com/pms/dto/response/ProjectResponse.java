package com.pms.dto.response;

import com.pms.enums.Priority;
import com.pms.enums.ProjectStatus;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
public class ProjectResponse {
    private Long id;
    private String name;
    private String description;
    private ProjectStatus status;
    private Priority priority;
    private LocalDate startDate;
    private LocalDate endDate;
    private UserResponse owner;
    private int memberCount;
    private int taskCount;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}