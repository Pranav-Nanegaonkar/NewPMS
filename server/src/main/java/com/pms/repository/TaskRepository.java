package com.pms.repository;

import com.pms.entity.Task;
import com.pms.enums.Priority;
import com.pms.enums.TaskStatus;
import com.pms.enums.TaskType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {

    List<Task> findByProjectId(Long projectId);

    List<Task> findBySprintId(Long sprintId);

    List<Task> findByAssigneeId(Long assigneeId);

    List<Task> findByReporterId(Long reporterId);

    List<Task> findByProjectIdAndStatus(Long projectId, TaskStatus status);

    List<Task> findByProjectIdAndPriority(Long projectId, Priority priority);

    List<Task> findByProjectIdAndType(Long projectId, TaskType type);

    List<Task> findByParentTaskId(Long parentTaskId);

    @Query("SELECT t FROM Task t WHERE t.project.id = :projectId AND t.parentTask IS NULL")
    List<Task> findRootTasksByProjectId(@Param("projectId") Long projectId);

    @Query("SELECT t FROM Task t WHERE t.assignee.id = :userId AND t.status != 'DONE'")
    List<Task> findOpenTasksByAssignee(@Param("userId") Long userId);

    @Query("SELECT t FROM Task t WHERE t.title LIKE %:keyword% AND t.project.id = :projectId")
    List<Task> searchByTitleInProject(@Param("keyword") String keyword,
                                      @Param("projectId") Long projectId);

    long countByProjectIdAndStatus(Long projectId, TaskStatus status);

    @Query("SELECT SUM(t.storyPoints) FROM Task t WHERE t.sprint.id = :sprintId AND t.status = 'DONE'")
    Integer sumCompletedStoryPointsBySprintId(@Param("sprintId") Long sprintId);
}