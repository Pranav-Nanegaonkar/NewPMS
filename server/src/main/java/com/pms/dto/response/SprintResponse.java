package com.pms.dto.response;

import com.pms.enums.SprintStatus;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
public class SprintResponse {
    private Long id;
    private Long projectId;
    private String projectName;
    private String name;
    private String goal;
    private SprintStatus status;
    private LocalDate startDate;
    private LocalDate endDate;
    private int taskCount;
    private Integer completedStoryPoints;
    private LocalDateTime createdAt;
}