package com.pms.service.impl;

import com.pms.dto.request.SprintRequest;
import com.pms.dto.response.SprintResponse;
import com.pms.entity.Project;
import com.pms.entity.Sprint;
import com.pms.enums.SprintStatus;
import com.pms.exception.BusinessException;
import com.pms.exception.ResourceNotFoundException;
import com.pms.repository.ProjectRepository;
import com.pms.repository.SprintRepository;
import com.pms.repository.TaskRepository;
import com.pms.service.SprintService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class SprintServiceImpl implements SprintService {

    private final SprintRepository sprintRepository;
    private final ProjectRepository projectRepository;
    private final TaskRepository taskRepository;

    @Override
    public SprintResponse createSprint(SprintRequest request) {
        Project project = findProjectById(request.getProjectId());

        // Only one ACTIVE sprint allowed per project at a time
        if (request.getStatus() == SprintStatus.ACTIVE &&
                sprintRepository.existsByProjectIdAndStatus(request.getProjectId(), SprintStatus.ACTIVE)) {
            throw new BusinessException("Project already has an active sprint. Complete it before starting a new one.");
        }

        Sprint sprint = Sprint.builder()
                .project(project)
                .name(request.getName())
                .goal(request.getGoal())
                .status(request.getStatus())
                .startDate(request.getStartDate())
                .endDate(request.getEndDate())
                .build();

        return mapToResponse(sprintRepository.save(sprint));
    }

    @Override
    @Transactional(readOnly = true)
    public SprintResponse getSprintById(Long id) {
        return mapToResponse(findSprintById(id));
    }

    @Override
    @Transactional(readOnly = true)
    public List<SprintResponse> getSprintsByProject(Long projectId) {
        findProjectById(projectId);
        return sprintRepository.findByProjectId(projectId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<SprintResponse> getSprintsByProjectAndStatus(Long projectId, SprintStatus status) {
        return sprintRepository.findByProjectIdAndStatus(projectId, status).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public SprintResponse updateSprint(Long id, SprintRequest request) {
        Sprint sprint = findSprintById(id);
        Project project = findProjectById(request.getProjectId());

        // Guard: if changing status to ACTIVE, ensure no other active sprint exists
        if (request.getStatus() == SprintStatus.ACTIVE &&
                sprint.getStatus() != SprintStatus.ACTIVE &&
                sprintRepository.existsByProjectIdAndStatus(request.getProjectId(), SprintStatus.ACTIVE)) {
            throw new BusinessException("Another sprint is already active in this project.");
        }

        sprint.setProject(project);
        sprint.setName(request.getName());
        sprint.setGoal(request.getGoal());
        sprint.setStatus(request.getStatus());
        sprint.setStartDate(request.getStartDate());
        sprint.setEndDate(request.getEndDate());

        return mapToResponse(sprintRepository.save(sprint));
    }

    @Override
    public SprintResponse updateSprintStatus(Long id, SprintStatus status) {
        Sprint sprint = findSprintById(id);

        if (status == SprintStatus.ACTIVE &&
                sprint.getStatus() != SprintStatus.ACTIVE &&
                sprintRepository.existsByProjectIdAndStatus(sprint.getProject().getId(), SprintStatus.ACTIVE)) {
            throw new BusinessException("Another sprint is already active in this project.");
        }

        sprint.setStatus(status);
        return mapToResponse(sprintRepository.save(sprint));
    }

    @Override
    public void deleteSprint(Long id) {
        Sprint sprint = findSprintById(id);
        if (sprint.getStatus() == SprintStatus.ACTIVE) {
            throw new BusinessException("Cannot delete an active sprint. Complete it first.");
        }
        sprintRepository.delete(sprint);
    }

    // ─── Private Helpers ────────────────────────────────────────────────────────

    private Sprint findSprintById(Long id) {
        return sprintRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Sprint", id));
    }

    private Project findProjectById(Long id) {
        return projectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Project", id));
    }

    private SprintResponse mapToResponse(Sprint sprint) {
        Integer completedPoints = taskRepository
                .sumCompletedStoryPointsBySprintId(sprint.getId());

        return SprintResponse.builder()
                .id(sprint.getId())
                .projectId(sprint.getProject().getId())
                .projectName(sprint.getProject().getName())
                .name(sprint.getName())
                .goal(sprint.getGoal())
                .status(sprint.getStatus())
                .startDate(sprint.getStartDate())
                .endDate(sprint.getEndDate())
                .taskCount(sprint.getTasks().size())
                .completedStoryPoints(completedPoints != null ? completedPoints : 0)
                .createdAt(sprint.getCreatedAt())
                .build();
    }
}