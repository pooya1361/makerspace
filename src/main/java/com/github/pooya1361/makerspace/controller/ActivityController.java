package com.github.pooya1361.makerspace.controller;

import com.github.pooya1361.makerspace.dto.create.ActivityCreateDTO;
import com.github.pooya1361.makerspace.dto.response.ActivityResponseDTO;
import com.github.pooya1361.makerspace.mapper.ActivityMapper;
import com.github.pooya1361.makerspace.model.Activity;
import com.github.pooya1361.makerspace.repository.ActivityRepository;
import com.github.pooya1361.makerspace.service.ActivityService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/activities")
@Tag(name = "Activity management", description = "Endpoints for activity administration")
public class ActivityController {
    private final ActivityRepository activityRepository;
    private final ActivityService activityService;

    @Autowired
    private ActivityMapper activityMapper;

    @Autowired // Spring automatically injects ActivityRepository
    public ActivityController(ActivityRepository activityRepository, ActivityService activityService) {
        this.activityRepository = activityRepository;
        this.activityService = activityService;
    }

    @GetMapping()
    public ResponseEntity<List<ActivityResponseDTO>> getActivities() {
        List<Activity> activities = activityRepository.findAll();
        List<ActivityResponseDTO> activityResponseDTOs = activityMapper.toDtoList(activities);
        return new ResponseEntity<>(activityResponseDTOs, HttpStatus.OK);
    }

    @PostMapping
    @Operation(summary = "Add a activity", description = "Adds a activity to the system.")
    public ResponseEntity<ActivityResponseDTO> createActivity(@Valid @RequestBody ActivityCreateDTO activityCreateDTO) {
        ActivityResponseDTO createdActivity = activityService.createActivity(activityCreateDTO);
        return new ResponseEntity<>(createdActivity, HttpStatus.CREATED);
    }


    @GetMapping("/{id}")
    @Operation(summary = "Get an activity by id", description = "Retrieves an activity from the system by its ID.")
    public ResponseEntity<ActivityResponseDTO> getActivityById(@PathVariable Long id) {
        return activityService.getActivityById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PatchMapping("/{id}")
    @Operation(summary = "Update an activity", description = "Updates an existing activity's information.")
    public ResponseEntity<ActivityResponseDTO> updateActivity(@PathVariable Long id, @Valid @RequestBody ActivityCreateDTO updateDTO) {
        ActivityResponseDTO updatedActivity = activityService.updateActivity(id, updateDTO);
        return ResponseEntity.ok(updatedActivity);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete an activity", description = "Removes an activity from the system.")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteActivity(@PathVariable Long id) {
        activityService.deleteActivity(id);
    }
}
