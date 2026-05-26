package com.pms.service.impl;

import com.pms.dto.request.ProjectMemberRequest;
import com.pms.dto.request.ProjectRequest;
import com.pms.dto.response.ProjectMemberResponse;
import com.pms.dto.response.ProjectResponse;
import com.pms.entity.Project;
import com.pms.entity.ProjectMember;
import com.pms.entity.User;
import com.pms.enums.Priority;
import com.pms.enums.ProjectStatus;
import com.pms.exception.BusinessException;
import com.pms.exception.ResourceNotFoundException;
import com.pms.repository.ProjectMemberRepository;
import com.pms.repository.ProjectRepository;
import com.pms.repository.UserRepository;
import com.pms.service.ProjectService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class ProjectServiceImpl implements ProjectService {

    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;
    private final ProjectMemberRepository memberRepository;
    private final UserServiceImpl userService;

    @Override
    public ProjectResponse createProject(ProjectRequest request) {
        User owner = findUserById(request.getOwnerId());

        Project project = Project.builder()
                .name(request.getName())
                .description(request.getDescription())
                .status(request.getStatus())
                .priority(request.getPriority())
                .startDate(request.getStartDate())
                .endDate(request.getEndDate())
                .owner(owner)
                .build();

        return mapToResponse(projectRepository.save(project));
    }

    @Override
    @Transactional(readOnly = true)
    public ProjectResponse getProjectById(Long id) {
        return mapToResponse(findProjectById(id));
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProjectResponse> getAllProjects() {
        return projectRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProjectResponse> getProjectsByStatus(ProjectStatus status) {
        return projectRepository.findByStatus(status).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProjectResponse> getProjectsByPriority(Priority priority) {
        return projectRepository.findByPriority(priority).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProjectResponse> getProjectsByOwner(Long ownerId) {
        return projectRepository.findByOwnerId(ownerId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProjectResponse> getProjectsByMember(Long userId) {
        return projectRepository.findProjectsByMemberId(userId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProjectResponse> searchProjects(String keyword) {
        return projectRepository.searchByKeyword(keyword).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public ProjectResponse updateProject(Long id, ProjectRequest request) {
        Project project = findProjectById(id);
        User owner = findUserById(request.getOwnerId());

        project.setName(request.getName());
        project.setDescription(request.getDescription());
        project.setStatus(request.getStatus());
        project.setPriority(request.getPriority());
        project.setStartDate(request.getStartDate());
        project.setEndDate(request.getEndDate());
        project.setOwner(owner);

        return mapToResponse(projectRepository.save(project));
    }

    @Override
    public ProjectResponse updateProjectStatus(Long id, ProjectStatus status) {
        Project project = findProjectById(id);
        project.setStatus(status);
        return mapToResponse(projectRepository.save(project));
    }

    @Override
    public void deleteProject(Long id) {
        projectRepository.delete(findProjectById(id));
    }

    @Override
    public ProjectMemberResponse addMember(Long projectId, ProjectMemberRequest request) {
        Project project = findProjectById(projectId);
        User user = findUserById(request.getUserId());

        if (memberRepository.existsByProjectIdAndUserId(projectId, request.getUserId())) {
            throw new BusinessException("User is already a member of this project");
        }

        ProjectMember member = ProjectMember.builder()
                .project(project)
                .user(user)
                .roleInProject(request.getRoleInProject())
                .build();

        return mapMemberToResponse(memberRepository.save(member));
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProjectMemberResponse> getProjectMembers(Long projectId) {
        findProjectById(projectId); // validate project exists
        return memberRepository.findByProjectId(projectId).stream()
                .map(this::mapMemberToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public ProjectMemberResponse updateMemberRole(Long projectId, Long userId, ProjectMemberRequest request) {
        ProjectMember member = memberRepository.findByProjectIdAndUserId(projectId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Member not found in project"));
        member.setRoleInProject(request.getRoleInProject());
        return mapMemberToResponse(memberRepository.save(member));
    }

    @Override
    public void removeMember(Long projectId, Long userId) {
        if (!memberRepository.existsByProjectIdAndUserId(projectId, userId)) {
            throw new ResourceNotFoundException("Member not found in project");
        }
        memberRepository.deleteByProjectIdAndUserId(projectId, userId);
    }

    // ─── Private Helpers ────────────────────────────────────────────────────────

    private Project findProjectById(Long id) {
        return projectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Project", id));
    }

    private User findUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User", id));
    }

    private ProjectResponse mapToResponse(Project project) {
        return ProjectResponse.builder()
                .id(project.getId())
                .name(project.getName())
                .description(project.getDescription())
                .status(project.getStatus())
                .priority(project.getPriority())
                .startDate(project.getStartDate())
                .endDate(project.getEndDate())
                .owner(userService.mapToResponse(project.getOwner()))
                .memberCount(project.getMembers().size())
                .taskCount(project.getTasks().size())
                .createdAt(project.getCreatedAt())
                .updatedAt(project.getUpdatedAt())
                .build();
    }

    private ProjectMemberResponse mapMemberToResponse(ProjectMember member) {
        return ProjectMemberResponse.builder()
                .id(member.getId())
                .projectId(member.getProject().getId())
                .projectName(member.getProject().getName())
                .user(userService.mapToResponse(member.getUser()))
                .roleInProject(member.getRoleInProject())
                .joinedAt(member.getJoinedAt())
                .build();
    }
}