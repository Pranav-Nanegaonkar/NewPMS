package com.pms.service.impl;

import com.pms.dto.request.CommentRequest;
import com.pms.dto.response.CommentResponse;
import com.pms.entity.Comment;
import com.pms.entity.Task;
import com.pms.entity.User;
import com.pms.exception.BusinessException;
import com.pms.exception.ResourceNotFoundException;
import com.pms.repository.CommentRepository;
import com.pms.repository.TaskRepository;
import com.pms.repository.UserRepository;
import com.pms.service.CommentService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class CommentServiceImpl implements CommentService {

    private final CommentRepository commentRepository;
    private final TaskRepository taskRepository;
    private final UserRepository userRepository;
    private final UserServiceImpl userService;

    @Override
    public CommentResponse addComment(CommentRequest request) {
        Task task = findTaskById(request.getTaskId());
        User author = findUserById(request.getAuthorId());

        Comment comment = Comment.builder()
                .task(task)
                .author(author)
                .content(request.getContent())
                .build();

        return mapToResponse(commentRepository.save(comment));
    }

    @Override
    @Transactional(readOnly = true)
    public CommentResponse getCommentById(Long id) {
        return mapToResponse(findCommentById(id));
    }

    @Override
    @Transactional(readOnly = true)
    public List<CommentResponse> getCommentsByTask(Long taskId) {
        findTaskById(taskId);
        return commentRepository.findByTaskIdOrderByCreatedAtAsc(taskId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public CommentResponse updateComment(Long id, Long authorId, String content) {
        Comment comment = findCommentById(id);

        if (!comment.getAuthor().getId().equals(authorId)) {
            throw new BusinessException("You can only edit your own comments");
        }

        if (content == null || content.isBlank()) {
            throw new BusinessException("Comment content cannot be empty");
        }

        comment.setContent(content);
        return mapToResponse(commentRepository.save(comment));
    }

    @Override
    public void deleteComment(Long id, Long authorId) {
        Comment comment = findCommentById(id);

        if (!comment.getAuthor().getId().equals(authorId)) {
            throw new BusinessException("You can only delete your own comments");
        }

        commentRepository.delete(comment);
    }

    // ─── Private Helpers ────────────────────────────────────────────────────────

    private Comment findCommentById(Long id) {
        return commentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Comment", id));
    }

    private Task findTaskById(Long id) {
        return taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task", id));
    }

    private User findUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User", id));
    }

    private CommentResponse mapToResponse(Comment comment) {
        return CommentResponse.builder()
                .id(comment.getId())
                .taskId(comment.getTask().getId())
                .author(userService.mapToResponse(comment.getAuthor()))
                .content(comment.getContent())
                .createdAt(comment.getCreatedAt())
                .updatedAt(comment.getUpdatedAt())
                .build();
    }
}