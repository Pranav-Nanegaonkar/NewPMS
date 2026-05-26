package com.pms.repository;

import com.pms.entity.Comment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {

    List<Comment> findByTaskIdOrderByCreatedAtAsc(Long taskId);

    List<Comment> findByAuthorId(Long authorId);

    long countByTaskId(Long taskId);
}