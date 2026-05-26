package com.pms.service;

import com.pms.dto.request.TaskRequest;
import com.pms.dto.response.TaskResponse;
import com.pms.enums.Priority;
import com.pms.enums.TaskStatus;
import com.pms.enums.TaskType;

import java.util.List;

public interface TaskService {
    TaskResponse createTask(TaskRequest request);
    TaskResponse getTaskById(Long id);
    List<TaskResponse> getAllTasks();
    List<TaskResponse> getTasksByProject(Long projectId);
    List<TaskResponse> getTasksBySprint(Long sprintId);
    List<TaskResponse> getTasksByAssignee(Long userId);
    List<TaskResponse> getTasksByProjectAndStatus(Long projectId, TaskStatus status);
    List<TaskResponse> getTasksByProjectAndPriority(Long projectId, Priority priority);
    List<TaskResponse> getTasksByProjectAndType(Long projectId, TaskType type);
    List<TaskResponse> getSubTasks(Long parentTaskId);
    List<TaskResponse> getRootTasksByProject(Long projectId);
    List<TaskResponse> searchTasksInProject(Long projectId, String keyword);
    TaskResponse updateTask(Long id, TaskRequest request);
    TaskResponse updateTaskStatus(Long id, TaskStatus status);
    TaskResponse assignTask(Long taskId, Long userId);
    TaskResponse moveTaskToSprint(Long taskId, Long sprintId);
    void deleteTask(Long id);
}