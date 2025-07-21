package com.github.pooya1361.makerspace.service;

import com.github.pooya1361.makerspace.dto.create.ActivityCreateDTO;
import com.github.pooya1361.makerspace.dto.response.ActivityResponseDTO;
import com.github.pooya1361.makerspace.mapper.ActivityMapper;
import com.github.pooya1361.makerspace.model.Activity;
import com.github.pooya1361.makerspace.model.Workshop;
import com.github.pooya1361.makerspace.repository.ActivityRepository;
import com.github.pooya1361.makerspace.repository.WorkshopRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
public class ActivityService {

    private final WorkshopRepository workshopRepository;
    private final ActivityRepository activityRepository;
    private final ActivityMapper activityMapper;

    public ActivityService(WorkshopRepository workshopRepository,
                           ActivityRepository activityRepository, ActivityMapper activityMapper) {
        this.workshopRepository = workshopRepository;
        this.activityRepository = activityRepository;
        this.activityMapper = activityMapper;
    }

    @Transactional
    public ActivityResponseDTO createActivity(ActivityCreateDTO activityCreateDTO) {
        // Convert DTO to entity, setting relationships
        Activity activity = activityMapper.toEntity(activityCreateDTO);

        if (activityCreateDTO.getWorkshopId() != null) {
            Workshop workshop = workshopRepository.findById(activityCreateDTO.getWorkshopId())
                    .orElseThrow(() -> new EntityNotFoundException("Workshop not found with ID: " + activityCreateDTO.getWorkshopId()));
            activity.setWorkshop(workshop);
        }

        // Save the activity
        Activity savedActivity = activityRepository.save(activity);

        // Convert saved entity to response DTO
        return activityMapper.toDto(savedActivity);
    }

    public Optional<ActivityResponseDTO> getActivityById(Long id) {
        return activityRepository.findById(id)
                .map(activityMapper::toDto);
    }

    @Transactional
    public ActivityResponseDTO updateActivity(Long id, ActivityCreateDTO activityCreateDTO) {
        Activity existingActivity = activityRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Activity not found with ID: " + id));

        activityMapper.updateActivityFromDto(activityCreateDTO, existingActivity); // Map non-null fields from DTO

        if (activityCreateDTO.getWorkshopId() != null) {
            Workshop newWorkshop = workshopRepository.findById(activityCreateDTO.getWorkshopId())
                    .orElseThrow(() -> new EntityNotFoundException("Workshop not found with ID: " + activityCreateDTO.getWorkshopId()));
            existingActivity.setWorkshop(newWorkshop);
        }

        Activity updatedActivity = activityRepository.save(existingActivity);
        return activityMapper.toDto(updatedActivity);
    }

    @Transactional
    public void deleteActivity(Long id) {
        if (!activityRepository.existsById(id)) {
            throw new EntityNotFoundException("Activity not found with ID: " + id);
        }
        // Consider cascading deletes or manual deletion of related Lessons here if not handled by JPA cascade
        activityRepository.deleteById(id);
    }
}