package com.pms.service.impl;

import com.pms.dto.response.ActivityLogResponse;
import com.pms.entity.ActivityLog;
import com.pms.entity.Project;
import com.pms.entity.Task;
import com.pms.entity.User;
import com.pms.exception.ResourceNotFoundException;
import com.pms.repository.ActivityLogRepository;
import com.pms.service.ActivityLogService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class ActivityLogServiceImpl implements ActivityLogService {

    private final ActivityLogRepository activityLogRepository;
    private final UserServiceImpl userService;

    @Override
    public void log(Project project, Task task, User performedBy,
                    String action, String oldValue, String newValue) {
        ActivityLog log = ActivityLog.builder()
                .project(project)
                .task(task)
                .performedBy(performedBy)
                .action(action)
                .oldValue(oldValue)
                .newValue(newValue)
                .build();

        activityLogRepository.save(log);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ActivityLogResponse> getLogsByProject(Long projectId) {
        return activityLogRepository
                .findByProjectIdOrderByCreatedAtDesc(projectId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<ActivityLogResponse> getLogsByTask(Long taskId) {
        return activityLogRepository
                .findByTaskIdOrderByCreatedAtDesc(taskId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<ActivityLogResponse> getLogsByUser(Long userId) {
        return activityLogRepository
                .findByPerformedByIdOrderByCreatedAtDesc(userId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // ─── Private Helpers ────────────────────────────────────────────────────────

    private ActivityLogResponse mapToResponse(ActivityLog log) {
        return ActivityLogResponse.builder()
                .id(log.getId())
                .projectId(log.getProject().getId())
                .taskId(log.getTask() != null ? log.getTask().getId() : null)
                .performedBy(userService.mapToResponse(log.getPerformedBy()))
                .action(log.getAction())
                .oldValue(log.getOldValue())
                .newValue(log.getNewValue())
                .createdAt(log.getCreatedAt())
                .build();
    }
}