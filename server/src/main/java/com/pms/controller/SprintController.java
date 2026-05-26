package com.pms.controller;

import com.pms.dto.request.SprintRequest;
import com.pms.dto.response.ApiResponse;
import com.pms.dto.response.SprintResponse;
import com.pms.enums.SprintStatus;
import com.pms.service.SprintService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/sprints")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class SprintController {

    private final SprintService sprintService;

    // POST /api/v1/sprints
    @PostMapping
    public ResponseEntity<ApiResponse<SprintResponse>> createSprint(
            @Valid @RequestBody SprintRequest request) {
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ApiResponse.success(
                        sprintService.createSprint(request), "Sprint created successfully"));
    }

    // GET /api/v1/sprints/{id}
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<SprintResponse>> getSprintById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(sprintService.getSprintById(id)));
    }

    // GET /api/v1/sprints/project/{projectId}
    @GetMapping("/project/{projectId}")
    public ResponseEntity<ApiResponse<List<SprintResponse>>> getSprintsByProject(
            @PathVariable Long projectId) {
        return ResponseEntity.ok(ApiResponse.success(sprintService.getSprintsByProject(projectId)));
    }

    // GET /api/v1/sprints/project/{projectId}/status/{status}
    @GetMapping("/project/{projectId}/status/{status}")
    public ResponseEntity<ApiResponse<List<SprintResponse>>> getSprintsByProjectAndStatus(
            @PathVariable Long projectId,
            @PathVariable SprintStatus status) {
        return ResponseEntity.ok(
                ApiResponse.success(sprintService.getSprintsByProjectAndStatus(projectId, status)));
    }

    // PUT /api/v1/sprints/{id}
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<SprintResponse>> updateSprint(
            @PathVariable Long id,
            @Valid @RequestBody SprintRequest request) {
        return ResponseEntity.ok(
                ApiResponse.success(sprintService.updateSprint(id, request), "Sprint updated successfully"));
    }

    // PATCH /api/v1/sprints/{id}/status
    @PatchMapping("/{id}/status")
    public ResponseEntity<ApiResponse<SprintResponse>> updateSprintStatus(
            @PathVariable Long id,
            @RequestParam SprintStatus status) {
        return ResponseEntity.ok(
                ApiResponse.success(sprintService.updateSprintStatus(id, status), "Sprint status updated"));
    }

    // DELETE /api/v1/sprints/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteSprint(@PathVariable Long id) {
        sprintService.deleteSprint(id);
        return ResponseEntity.ok(ApiResponse.success(null, "Sprint deleted successfully"));
    }
}