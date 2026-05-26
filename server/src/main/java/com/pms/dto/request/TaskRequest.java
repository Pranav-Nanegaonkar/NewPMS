package com.pms.dto.request;

import com.pms.enums.Priority;
import com.pms.enums.TaskStatus;
import com.pms.enums.TaskType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;

@Data
public class TaskRequest {

    @NotNull(message = "Project ID is required")
    private Long projectId;

    private Long sprintId;

    private Long parentTaskId;

    @NotBlank(message = "Title is required")
    private String title;

    private String description;

    @NotNull(message = "Task type is required")
    private TaskType type;

    @NotNull(message = "Status is required")
    private TaskStatus status;

    @NotNull(message = "Priority is required")
    private Priority priority;

    private Long assigneeId;

    @NotNull(message = "Reporter ID is required")
    private Long reporterId;

    private Integer storyPoints;

    private LocalDate dueDate;
}