package com.pms.controller;

import com.pms.dto.request.TaskRequest;
import com.pms.dto.response.ApiResponse;
import com.pms.dto.response.TaskResponse;
import com.pms.enums.Priority;
import com.pms.enums.TaskStatus;
import com.pms.enums.TaskType;
import com.pms.service.TaskService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/tasks")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class TaskController {

    private final TaskService taskService;

    // POST /api/v1/tasks
    @PostMapping
    public ResponseEntity<ApiResponse<TaskResponse>> createTask(
            @Valid @RequestBody TaskRequest request) {
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ApiResponse.success(
                        taskService.createTask(request), "Task created successfully"));
    }

    // GET /api/v1/tasks/{id}
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<TaskResponse>> getTaskById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(taskService.getTaskById(id)));
    }

    // GET /api/v1/tasks
    @GetMapping
    public ResponseEntity<ApiResponse<List<TaskResponse>>> getAllTasks() {
        return ResponseEntity.ok(ApiResponse.success(taskService.getAllTasks()));
    }

    // GET /api/v1/tasks/project/{projectId}
    @GetMapping("/project/{projectId}")
    public ResponseEntity<ApiResponse<List<TaskResponse>>> getTasksByProject(
            @PathVariable Long projectId) {
        return ResponseEntity.ok(ApiResponse.success(taskService.getTasksByProject(projectId)));
    }

    // GET /api/v1/tasks/project/{projectId}/root
    @GetMapping("/project/{projectId}/root")
    public ResponseEntity<ApiResponse<List<TaskResponse>>> getRootTasksByProject(
            @PathVariable Long projectId) {
        return ResponseEntity.ok(ApiResponse.success(taskService.getRootTasksByProject(projectId)));
    }

    // GET /api/v1/tasks/sprint/{sprintId}
    @GetMapping("/sprint/{sprintId}")
    public ResponseEntity<ApiResponse<List<TaskResponse>>> getTasksBySprint(
            @PathVariable Long sprintId) {
        return ResponseEntity.ok(ApiResponse.success(taskService.getTasksBySprint(sprintId)));
    }

    // GET /api/v1/tasks/assignee/{userId}
    @GetMapping("/assignee/{userId}")
    public ResponseEntity<ApiResponse<List<TaskResponse>>> getTasksByAssignee(
            @PathVariable Long userId) {
        return ResponseEntity.ok(ApiResponse.success(taskService.getTasksByAssignee(userId)));
    }

    // GET /api/v1/tasks/{id}/subtasks
    @GetMapping("/{id}/subtasks")
    public ResponseEntity<ApiResponse<List<TaskResponse>>> getSubTasks(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(taskService.getSubTasks(id)));
    }

    // GET /api/v1/tasks/project/{projectId}/filter?status=&priority=&type=
    @GetMapping("/project/{projectId}/filter")
    public ResponseEntity<ApiResponse<List<TaskResponse>>> filterTasks(
            @PathVariable Long projectId,
            @RequestParam(required = false) TaskStatus status,
            @RequestParam(required = false) Priority priority,
            @RequestParam(required = false) TaskType type) {

        List<TaskResponse> result;

        if (status != null) {
            result = taskService.getTasksByProjectAndStatus(projectId, status);
        } else if (priority != null) {
            result = taskService.getTasksByProjectAndPriority(projectId, priority);
        } else if (type != null) {
            result = taskService.getTasksByProjectAndType(projectId, type);
        } else {
            result = taskService.getTasksByProject(projectId);
        }

        return ResponseEntity.ok(ApiResponse.success(result));
    }

    // GET /api/v1/tasks/project/{projectId}/search?keyword=
    @GetMapping("/project/{projectId}/search")
    public ResponseEntity<ApiResponse<List<TaskResponse>>> searchTasksInProject(
            @PathVariable Long projectId,
            @RequestParam String keyword) {
        return ResponseEntity.ok(
                ApiResponse.success(taskService.searchTasksInProject(projectId, keyword)));
    }

    // PUT /api/v1/tasks/{id}
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<TaskResponse>> updateTask(
            @PathVariable Long id,
            @Valid @RequestBody TaskRequest request) {
        return ResponseEntity.ok(
                ApiResponse.success(taskService.updateTask(id, request), "Task updated successfully"));
    }

    // PATCH /api/v1/tasks/{id}/status
    @PatchMapping("/{id}/status")
    public ResponseEntity<ApiResponse<TaskResponse>> updateTaskStatus(
            @PathVariable Long id,
            @RequestParam TaskStatus status) {
        return ResponseEntity.ok(
                ApiResponse.success(taskService.updateTaskStatus(id, status), "Task status updated"));
    }

    // PATCH /api/v1/tasks/{id}/assign/{userId}
    @PatchMapping("/{id}/assign/{userId}")
    public ResponseEntity<ApiResponse<TaskResponse>> assignTask(
            @PathVariable Long id,
            @PathVariable Long userId) {
        return ResponseEntity.ok(
                ApiResponse.success(taskService.assignTask(id, userId), "Task assigned successfully"));
    }

    // PATCH /api/v1/tasks/{id}/sprint/{sprintId}
    @PatchMapping("/{id}/sprint/{sprintId}")
    public ResponseEntity<ApiResponse<TaskResponse>> moveTaskToSprint(
            @PathVariable Long id,
            @PathVariable Long sprintId) {
        return ResponseEntity.ok(
                ApiResponse.success(taskService.moveTaskToSprint(id, sprintId), "Task moved to sprint"));
    }

    // DELETE /api/v1/tasks/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteTask(@PathVariable Long id) {
        taskService.deleteTask(id);
        return ResponseEntity.ok(ApiResponse.success(null, "Task deleted successfully"));
    }
}