package com.pms.service;

import com.pms.dto.request.SprintRequest;
import com.pms.dto.response.SprintResponse;
import com.pms.enums.SprintStatus;

import java.util.List;

public interface SprintService {
    SprintResponse createSprint(SprintRequest request);
    SprintResponse getSprintById(Long id);
    List<SprintResponse> getSprintsByProject(Long projectId);
    List<SprintResponse> getSprintsByProjectAndStatus(Long projectId, SprintStatus status);
    SprintResponse updateSprint(Long id, SprintRequest request);
    SprintResponse updateSprintStatus(Long id, SprintStatus status);
    void deleteSprint(Long id);
}