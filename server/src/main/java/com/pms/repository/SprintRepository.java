package com.pms.repository;

import com.pms.entity.Sprint;
import com.pms.enums.SprintStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SprintRepository extends JpaRepository<Sprint, Long> {

    List<Sprint> findByProjectId(Long projectId);

    List<Sprint> findByProjectIdAndStatus(Long projectId, SprintStatus status);

    Optional<Sprint> findByProjectIdAndStatus(Long projectId, SprintStatus status, Class<?> type);

    boolean existsByProjectIdAndStatus(Long projectId, SprintStatus status);
}