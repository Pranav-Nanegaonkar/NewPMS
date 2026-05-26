package com.pms.dto.request;

import com.pms.enums.Priority;
import com.pms.enums.ProjectStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;

@Data
public class ProjectRequest {

    @NotBlank(message = "Project name is required")
    private String name;

    private String description;

    @NotNull(message = "Status is required")
    private ProjectStatus status;

    @NotNull(message = "Priority is required")
    private Priority priority;

    private LocalDate startDate;

    private LocalDate endDate;

    @NotNull(message = "Owner ID is required")
    private Long ownerId;
}