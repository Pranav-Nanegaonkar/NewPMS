package com.pms.service;

import com.pms.dto.request.CommentRequest;
import com.pms.dto.response.CommentResponse;

import java.util.List;

public interface CommentService {
    CommentResponse addComment(CommentRequest request);
    CommentResponse getCommentById(Long id);
    List<CommentResponse> getCommentsByTask(Long taskId);
    CommentResponse updateComment(Long id, Long authorId, String content);
    void deleteComment(Long id, Long authorId);
}