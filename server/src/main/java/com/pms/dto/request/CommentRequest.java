package com.pms.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CommentRequest {

    @NotNull(message = "Task ID is required")
    private Long taskId;

    @NotNull(message = "Author ID is required")
    private Long authorId;

    @NotBlank(message = "Content is required")
    private String content;
}