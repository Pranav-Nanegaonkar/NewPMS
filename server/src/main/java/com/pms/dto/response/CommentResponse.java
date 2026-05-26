package com.pms.dto.response;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class CommentResponse {
    private Long id;
    private Long taskId;
    private UserResponse author;
    private String content;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}