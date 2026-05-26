package com.pms.service;

import com.pms.dto.response.ActivityLogResponse;
import com.pms.entity.Project;
import com.pms.entity.Task;
import com.pms.entity.User;

import java.util.List;

public interface ActivityLogService {
    void log(Project project, Task task, User performedBy,
             String action, String oldValue, String newValue);

    List<ActivityLogResponse> getLogsByProject(Long projectId);
    List<ActivityLogResponse> getLogsByTask(Long taskId);
    List<ActivityLogResponse> getLogsByUser(Long userId);
}