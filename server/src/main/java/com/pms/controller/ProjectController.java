package com.pms.controller;

import com.pms.dto.request.ProjectMemberRequest;
import com.pms.dto.request.ProjectRequest;
import com.pms.dto.response.ApiResponse;
import com.pms.dto.response.ProjectMemberResponse;
import com.pms.dto.response.ProjectResponse;
import com.pms.enums.Priority;
import com.pms.enums.ProjectStatus;
import com.pms.service.ProjectService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/projects")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ProjectController {

    private final ProjectService projectService;

    // POST /api/v1/projects
    @PostMapping
    public ResponseEntity<ApiResponse<ProjectResponse>> createProject(
            @Valid @RequestBody ProjectRequest request) {
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ApiResponse.success(
                        projectService.createProject(request), "Project created successfully"));
    }

    // GET /api/v1/projects/{id}
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ProjectResponse>> getProjectById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(projectService.getProjectById(id)));
    }

    // GET /api/v1/projects
    @GetMapping
    public ResponseEntity<ApiResponse<List<ProjectResponse>>> getAllProjects() {
        return ResponseEntity.ok(ApiResponse.success(projectService.getAllProjects()));
    }

    // GET /api/v1/projects/status/{status}
    @GetMapping("/status/{status}")
    public ResponseEntity<ApiResponse<List<ProjectResponse>>> getProjectsByStatus(
            @PathVariable ProjectStatus status) {
        return ResponseEntity.ok(ApiResponse.success(projectService.getProjectsByStatus(status)));
    }

    // GET /api/v1/projects/priority/{priority}
    @GetMapping("/priority/{priority}")
    public ResponseEntity<ApiResponse<List<ProjectResponse>>> getProjectsByPriority(
            @PathVariable Priority priority) {
        return ResponseEntity.ok(ApiResponse.success(projectService.getProjectsByPriority(priority)));
    }

    // GET /api/v1/projects/owner/{ownerId}
    @GetMapping("/owner/{ownerId}")
    public ResponseEntity<ApiResponse<List<ProjectResponse>>> getProjectsByOwner(
            @PathVariable Long ownerId) {
        return ResponseEntity.ok(ApiResponse.success(projectService.getProjectsByOwner(ownerId)));
    }

    // GET /api/v1/projects/member/{userId}
    @GetMapping("/member/{userId}")
    public ResponseEntity<ApiResponse<List<ProjectResponse>>> getProjectsByMember(
            @PathVariable Long userId) {
        return ResponseEntity.ok(ApiResponse.success(projectService.getProjectsByMember(userId)));
    }

    // GET /api/v1/projects/search?keyword=
    @GetMapping("/search")
    public ResponseEntity<ApiResponse<List<ProjectResponse>>> searchProjects(
            @RequestParam String keyword) {
        return ResponseEntity.ok(ApiResponse.success(projectService.searchProjects(keyword)));
    }

    // PUT /api/v1/projects/{id}
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<ProjectResponse>> updateProject(
            @PathVariable Long id,
            @Valid @RequestBody ProjectRequest request) {
        return ResponseEntity.ok(
                ApiResponse.success(projectService.updateProject(id, request), "Project updated successfully"));
    }

    // PATCH /api/v1/projects/{id}/status
    @PatchMapping("/{id}/status")
    public ResponseEntity<ApiResponse<ProjectResponse>> updateProjectStatus(
            @PathVariable Long id,
            @RequestParam ProjectStatus status) {
        return ResponseEntity.ok(
                ApiResponse.success(projectService.updateProjectStatus(id, status), "Status updated"));
    }

    // DELETE /api/v1/projects/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteProject(@PathVariable Long id) {
        projectService.deleteProject(id);
        return ResponseEntity.ok(ApiResponse.success(null, "Project deleted successfully"));
    }

    // ─── Member Endpoints ───────────────────────────────────────────────────────

    // POST /api/v1/projects/{projectId}/members
    @PostMapping("/{projectId}/members")
    public ResponseEntity<ApiResponse<ProjectMemberResponse>> addMember(
            @PathVariable Long projectId,
            @Valid @RequestBody ProjectMemberRequest request) {
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ApiResponse.success(
                        projectService.addMember(projectId, request), "Member added successfully"));
    }

    // GET /api/v1/projects/{projectId}/members
    @GetMapping("/{projectId}/members")
    public ResponseEntity<ApiResponse<List<ProjectMemberResponse>>> getProjectMembers(
            @PathVariable Long projectId) {
        return ResponseEntity.ok(ApiResponse.success(projectService.getProjectMembers(projectId)));
    }

    // PUT /api/v1/projects/{projectId}/members/{userId}
    @PutMapping("/{projectId}/members/{userId}")
    public ResponseEntity<ApiResponse<ProjectMemberResponse>> updateMemberRole(
            @PathVariable Long projectId,
            @PathVariable Long userId,
            @Valid @RequestBody ProjectMemberRequest request) {
        return ResponseEntity.ok(
                ApiResponse.success(
                        projectService.updateMemberRole(projectId, userId, request),
                        "Member role updated"));
    }

    // DELETE /api/v1/projects/{projectId}/members/{userId}
    @DeleteMapping("/{projectId}/members/{userId}")
    public ResponseEntity<ApiResponse<Void>> removeMember(
            @PathVariable Long projectId,
            @PathVariable Long userId) {
        projectService.removeMember(projectId, userId);
        return ResponseEntity.ok(ApiResponse.success(null, "Member removed successfully"));
    }
}