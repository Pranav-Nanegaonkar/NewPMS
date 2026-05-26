package com.pms.controller;

import com.pms.dto.response.ActivityLogResponse;
import com.pms.dto.response.ApiResponse;
import com.pms.service.ActivityLogService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/activity-logs")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ActivityLogController {

    private final ActivityLogService activityLogService;

    // GET /api/v1/activity-logs/project/{projectId}
    @GetMapping("/project/{projectId}")
    public ResponseEntity<ApiResponse<List<ActivityLogResponse>>> getLogsByProject(
            @PathVariable Long projectId) {
        return ResponseEntity.ok(
                ApiResponse.success(activityLogService.getLogsByProject(projectId)));
    }

    // GET /api/v1/activity-logs/task/{taskId}
    @GetMapping("/task/{taskId}")
    public ResponseEntity<ApiResponse<List<ActivityLogResponse>>> getLogsByTask(
            @PathVariable Long taskId) {
        return ResponseEntity.ok(
                ApiResponse.success(activityLogService.getLogsByTask(taskId)));
    }

    // GET /api/v1/activity-logs/user/{userId}
    @GetMapping("/user/{userId}")
    public ResponseEntity<ApiResponse<List<ActivityLogResponse>>> getLogsByUser(
            @PathVariable Long userId) {
        return ResponseEntity.ok(
                ApiResponse.success(activityLogService.getLogsByUser(userId)));
    }
}