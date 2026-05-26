package com.pms.dto.response;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class ActivityLogResponse {
    private Long id;
    private Long projectId;
    private Long taskId;
    private UserResponse performedBy;
    private String action;
    private String oldValue;
    private String newValue;
    private LocalDateTime createdAt;
}