package com.pms.service.impl;

import com.pms.dto.request.TaskRequest;
import com.pms.dto.response.TaskResponse;
import com.pms.dto.response.UserResponse;
import com.pms.entity.*;
import com.pms.enums.Priority;
import com.pms.enums.TaskStatus;
import com.pms.enums.TaskType;
import com.pms.exception.BusinessException;
import com.pms.exception.ResourceNotFoundException;
import com.pms.repository.*;
import com.pms.service.TaskService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class TaskServiceImpl implements TaskService {

    private final TaskRepository taskRepository;
    private final ProjectRepository projectRepository;
    private final SprintRepository sprintRepository;
    private final UserRepository userRepository;
    private final CommentRepository commentRepository;
    private final UserServiceImpl userService;

    @Override
    public TaskResponse createTask(TaskRequest request) {
        Project project = findProjectById(request.getProjectId());
        User reporter = findUserById(request.getReporterId());

        User assignee = null;
        if (request.getAssigneeId() != null) {
            assignee = findUserById(request.getAssigneeId());
        }

        Sprint sprint = null;
        if (request.getSprintId() != null) {
            sprint = findSprintById(request.getSprintId());
            if (!sprint.getProject().getId().equals(request.getProjectId())) {
                throw new BusinessException("Sprint does not belong to the specified project");
            }
        }

        Task parentTask = null;
        if (request.getParentTaskId() != null) {
            parentTask = findTaskById(request.getParentTaskId());
            if (!parentTask.getProject().getId().equals(request.getProjectId())) {
                throw new BusinessException("Parent task does not belong to the specified project");
            }
        }

        Task task = Task.builder()
                .project(project)
                .sprint(sprint)
                .parentTask(parentTask)
                .title(request.getTitle())
                .description(request.getDescription())
                .type(request.getType())
                .status(request.getStatus())
                .priority(request.getPriority())
                .assignee(assignee)
                .reporter(reporter)
                .storyPoints(request.getStoryPoints())
                .dueDate(request.getDueDate())
                .build();

        return mapToResponse(taskRepository.save(task));
    }

    @Override
    @Transactional(readOnly = true)
    public TaskResponse getTaskById(Long id) {
        return mapToResponse(findTaskById(id));
    }

    @Override
    @Transactional(readOnly = true)
    public List<TaskResponse> getAllTasks() {
        return taskRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<TaskResponse> getTasksByProject(Long projectId) {
        findProjectById(projectId);
        return taskRepository.findByProjectId(projectId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<TaskResponse> getTasksBySprint(Long sprintId) {
        findSprintById(sprintId);
        return taskRepository.findBySprintId(sprintId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<TaskResponse> getTasksByAssignee(Long userId) {
        findUserById(userId);
        return taskRepository.findByAssigneeId(userId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<TaskResponse> getTasksByProjectAndStatus(Long projectId, TaskStatus status) {
        return taskRepository.findByProjectIdAndStatus(projectId, status).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<TaskResponse> getTasksByProjectAndPriority(Long projectId, Priority priority) {
        return taskRepository.findByProjectIdAndPriority(projectId, priority).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<TaskResponse> getTasksByProjectAndType(Long projectId, TaskType type) {
        return taskRepository.findByProjectIdAndType(projectId, type).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<TaskResponse> getSubTasks(Long parentTaskId) {
        findTaskById(parentTaskId);
        return taskRepository.findByParentTaskId(parentTaskId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<TaskResponse> getRootTasksByProject(Long projectId) {
        findProjectById(projectId);
        return taskRepository.findRootTasksByProjectId(projectId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<TaskResponse> searchTasksInProject(Long projectId, String keyword) {
        return taskRepository.searchByTitleInProject(keyword, projectId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public TaskResponse updateTask(Long id, TaskRequest request) {
        Task task = findTaskById(id);
        Project project = findProjectById(request.getProjectId());
        User reporter = findUserById(request.getReporterId());

        User assignee = null;
        if (request.getAssigneeId() != null) {
            assignee = findUserById(request.getAssigneeId());
        }

        Sprint sprint = null;
        if (request.getSprintId() != null) {
            sprint = findSprintById(request.getSprintId());
        }

        Task parentTask = null;
        if (request.getParentTaskId() != null) {
            parentTask = findTaskById(request.getParentTaskId());
            if (parentTask.getId().equals(id)) {
                throw new BusinessException("A task cannot be its own parent");
            }
        }

        task.setProject(project);
        task.setSprint(sprint);
        task.setParentTask(parentTask);
        task.setTitle(request.getTitle());
        task.setDescription(request.getDescription());
        task.setType(request.getType());
        task.setStatus(request.getStatus());
        task.setPriority(request.getPriority());
        task.setAssignee(assignee);
        task.setReporter(reporter);
        task.setStoryPoints(request.getStoryPoints());
        task.setDueDate(request.getDueDate());

        return mapToResponse(taskRepository.save(task));
    }

    @Override
    public TaskResponse updateTaskStatus(Long id, TaskStatus status) {
        Task task = findTaskById(id);
        task.setStatus(status);
        return mapToResponse(taskRepository.save(task));
    }

    @Override
    public TaskResponse assignTask(Long taskId, Long userId) {
        Task task = findTaskById(taskId);
        User assignee = findUserById(userId);
        task.setAssignee(assignee);
        return mapToResponse(taskRepository.save(task));
    }

    @Override
    public TaskResponse moveTaskToSprint(Long taskId, Long sprintId) {
        Task task = findTaskById(taskId);
        Sprint sprint = findSprintById(sprintId);

        if (!sprint.getProject().getId().equals(task.getProject().getId())) {
            throw new BusinessException("Sprint does not belong to the same project as the task");
        }

        task.setSprint(sprint);
        return mapToResponse(taskRepository.save(task));
    }

    @Override
    public void deleteTask(Long id) {
        taskRepository.delete(findTaskById(id));
    }

    // ─── Private Helpers ────────────────────────────────────────────────────────

    private Task findTaskById(Long id) {
        return taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task", id));
    }

    private Project findProjectById(Long id) {
        return projectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Project", id));
    }

    private Sprint findSprintById(Long id) {
        return sprintRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Sprint", id));
    }

    private User findUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User", id));
    }

    public TaskResponse mapToResponse(Task task) {
        UserResponse assigneeResponse = task.getAssignee() != null
                ? userService.mapToResponse(task.getAssignee()) : null;

        List<TaskResponse> subTaskResponses = task.getSubTasks().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());

        long commentCount = commentRepository.countByTaskId(task.getId());

        return TaskResponse.builder()
                .id(task.getId())
                .projectId(task.getProject().getId())
                .projectName(task.getProject().getName())
                .sprintId(task.getSprint() != null ? task.getSprint().getId() : null)
                .sprintName(task.getSprint() != null ? task.getSprint().getName() : null)
                .parentTaskId(task.getParentTask() != null ? task.getParentTask().getId() : null)
                .title(task.getTitle())
                .description(task.getDescription())
                .type(task.getType())
                .status(task.getStatus())
                .priority(task.getPriority())
                .assignee(assigneeResponse)
                .reporter(userService.mapToResponse(task.getReporter()))
                .storyPoints(task.getStoryPoints())
                .dueDate(task.getDueDate())
                .commentCount((int) commentCount)
                .subTasks(subTaskResponses)
                .createdAt(task.getCreatedAt())
                .updatedAt(task.getUpdatedAt())
                .build();
    }
}