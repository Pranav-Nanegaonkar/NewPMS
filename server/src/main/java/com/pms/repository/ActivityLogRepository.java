package com.pms.repository;

import com.pms.entity.ActivityLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ActivityLogRepository extends JpaRepository<ActivityLog, Long> {

    List<ActivityLog> findByProjectIdOrderByCreatedAtDesc(Long projectId);

    List<ActivityLog> findByTaskIdOrderByCreatedAtDesc(Long taskId);

    List<ActivityLog> findByPerformedByIdOrderByCreatedAtDesc(Long userId);
}