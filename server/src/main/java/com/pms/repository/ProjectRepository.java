package com.pms.repository;

import com.pms.entity.Project;
import com.pms.enums.Priority;
import com.pms.enums.ProjectStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProjectRepository extends JpaRepository<Project, Long> {

    List<Project> findByStatus(ProjectStatus status);

    List<Project> findByPriority(Priority priority);

    List<Project> findByOwnerId(Long ownerId);

    @Query("SELECT p FROM Project p WHERE p.name LIKE %:keyword% OR p.description LIKE %:keyword%")
    List<Project> searchByKeyword(@Param("keyword") String keyword);

    @Query("SELECT p FROM Project p JOIN p.members m WHERE m.user.id = :userId")
    List<Project> findProjectsByMemberId(@Param("userId") Long userId);

    @Query("SELECT p FROM Project p WHERE p.status = :status AND p.priority = :priority")
    List<Project> findByStatusAndPriority(@Param("status") ProjectStatus status,
                                          @Param("priority") Priority priority);

    long countByStatus(ProjectStatus status);
}