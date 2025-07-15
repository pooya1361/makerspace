package com.github.pooya1361.makerspace.controller;

import com.github.pooya1361.makerspace.dto.ActivityResponseDTO;
import com.github.pooya1361.makerspace.mapper.ActivityMapper;
import com.github.pooya1361.makerspace.model.Activity;
import com.github.pooya1361.makerspace.repository.ActivityRepository;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/activities")
@Tag(name = "Activity management", description = "Endpoints for activity administration")
public class ActivityController {
    private final ActivityRepository activityRepository;

    @Autowired
    private ActivityMapper activityMapper;

    @Autowired // Spring automatically injects ActivityRepository
    public ActivityController(ActivityRepository activityRepository) {
        this.activityRepository = activityRepository;
    }

    @GetMapping()
    public ResponseEntity<List<ActivityResponseDTO>> getActivities() {
        List<Activity> activities = activityRepository.findAll();
        List<ActivityResponseDTO> activityResponseDTOs = activityMapper.toDtoList(activities);
        return new ResponseEntity<>(activityResponseDTOs, HttpStatus.OK);
    }

}
