package com.github.pooya1361.makerspace.controller;

import com.github.pooya1361.makerspace.dto.ActivityResponseDTO;
import com.github.pooya1361.makerspace.model.Activity;
import com.github.pooya1361.makerspace.repository.ActivityRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api")
public class ActivityController {
    private final ActivityRepository activityRepository;

    @Autowired // Spring automatically injects ActivityRepository
    public ActivityController(ActivityRepository activityRepository) {
        this.activityRepository = activityRepository;
    }

    @GetMapping("/activities")
    public List<ActivityResponseDTO> getActivities() {
        return activityRepository.findAll().stream()
                .map(ActivityResponseDTO::new)
                .toList();
    }

}
