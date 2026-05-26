package com.pms.service;

import com.pms.dto.request.ProjectMemberRequest;
import com.pms.dto.request.ProjectRequest;
import com.pms.dto.response.ProjectMemberResponse;
import com.pms.dto.response.ProjectResponse;
import com.pms.enums.Priority;
import com.pms.enums.ProjectStatus;

import java.util.List;

public interface ProjectService {
    ProjectResponse createProject(ProjectRequest request);
    ProjectResponse getProjectById(Long id);
    List<ProjectResponse> getAllProjects();
    List<ProjectResponse> getProjectsByStatus(ProjectStatus status);
    List<ProjectResponse> getProjectsByPriority(Priority priority);
    List<ProjectResponse> getProjectsByOwner(Long ownerId);
    List<ProjectResponse> getProjectsByMember(Long userId);
    List<ProjectResponse> searchProjects(String keyword);
    ProjectResponse updateProject(Long id, ProjectRequest request);
    ProjectResponse updateProjectStatus(Long id, ProjectStatus status);
    void deleteProject(Long id);

    // Member management
    ProjectMemberResponse addMember(Long projectId, ProjectMemberRequest request);
    List<ProjectMemberResponse> getProjectMembers(Long projectId);
    ProjectMemberResponse updateMemberRole(Long projectId, Long userId, ProjectMemberRequest request);
    void removeMember(Long projectId, Long userId);
}