package com.pms.controller;

import com.pms.dto.request.CommentRequest;
import com.pms.dto.response.ApiResponse;
import com.pms.dto.response.CommentResponse;
import com.pms.service.CommentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/comments")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class CommentController {

    private final CommentService commentService;

    // POST /api/v1/comments
    @PostMapping
    public ResponseEntity<ApiResponse<CommentResponse>> addComment(
            @Valid @RequestBody CommentRequest request) {
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ApiResponse.success(
                        commentService.addComment(request), "Comment added successfully"));
    }

    // GET /api/v1/comments/{id}
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<CommentResponse>> getCommentById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(commentService.getCommentById(id)));
    }

    // GET /api/v1/comments/task/{taskId}
    @GetMapping("/task/{taskId}")
    public ResponseEntity<ApiResponse<List<CommentResponse>>> getCommentsByTask(
            @PathVariable Long taskId) {
        return ResponseEntity.ok(ApiResponse.success(commentService.getCommentsByTask(taskId)));
    }

    // PUT /api/v1/comments/{id}?authorId=
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<CommentResponse>> updateComment(
            @PathVariable Long id,
            @RequestParam Long authorId,
            @RequestBody String content) {
        return ResponseEntity.ok(
                ApiResponse.success(
                        commentService.updateComment(id, authorId, content),
                        "Comment updated successfully"));
    }

    // DELETE /api/v1/comments/{id}?authorId=
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteComment(
            @PathVariable Long id,
            @RequestParam Long authorId) {
        commentService.deleteComment(id, authorId);
        return ResponseEntity.ok(ApiResponse.success(null, "Comment deleted successfully"));
    }
}