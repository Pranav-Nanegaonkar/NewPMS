package com.pms.dto.response;

import com.pms.enums.Priority;
import com.pms.enums.TaskStatus;
import com.pms.enums.TaskType;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class TaskResponse {
    private Long id;
    private Long projectId;
    private String projectName;
    private Long sprintId;
    private String sprintName;
    private Long parentTaskId;
    private String title;
    private String description;
    private TaskType type;
    private TaskStatus status;
    private Priority priority;
    private UserResponse assignee;
    private UserResponse reporter;
    private Integer storyPoints;
    private LocalDate dueDate;
    private int commentCount;
    private List<TaskResponse> subTasks;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}