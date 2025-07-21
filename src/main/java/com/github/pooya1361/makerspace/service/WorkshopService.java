package com.github.pooya1361.makerspace.service;

import com.github.pooya1361.makerspace.dto.create.WorkshopCreateDTO;
import com.github.pooya1361.makerspace.dto.response.WorkshopResponseDTO;
import com.github.pooya1361.makerspace.mapper.WorkshopMapper;
import com.github.pooya1361.makerspace.model.Activity;
import com.github.pooya1361.makerspace.model.Workshop;
import com.github.pooya1361.makerspace.repository.ActivityRepository;
import com.github.pooya1361.makerspace.repository.WorkshopRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class WorkshopService {

    private final WorkshopRepository workshopRepository;
    private final WorkshopMapper workshopMapper;
    private final ActivityRepository activityRepository;

    public WorkshopService(WorkshopRepository workshopRepository,
                           WorkshopMapper workshopMapper,
                           ActivityRepository activityRepository) {
        this.workshopRepository = workshopRepository;
        this.workshopMapper = workshopMapper;
        this.activityRepository = activityRepository;
    }

    public List<WorkshopResponseDTO> getAllWorkshops() {
        return workshopMapper.toDtoList(workshopRepository.findAll());
    }

    public Optional<WorkshopResponseDTO> getWorkshopById(Long id) {
        return workshopRepository.findById(id)
                .map(workshopMapper::toDto);
    }

    @Transactional
    public WorkshopResponseDTO createWorkshop(WorkshopCreateDTO workshopCreateDTO) {
        // Convert DTO to entity, setting relationships
        Workshop workshop = workshopMapper.toEntity(workshopCreateDTO);

        // Save the workshop
        Workshop savedWorkshop = workshopRepository.save(workshop);

        // Convert saved entity to response DTO
        return workshopMapper.toDto(savedWorkshop);
    }

    @Transactional
    public WorkshopResponseDTO updateWorkshop(Long id, WorkshopCreateDTO workshopCreateDTO) {
        Workshop existingWorkshop = workshopRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Workshop not found with ID: " + id));

        // 1. Update the workshop's own properties (name, description, size) using the mapper
        workshopMapper.updateWorkshopFromDto(workshopCreateDTO, existingWorkshop);

        // 2. Handle Activity Associations
        List<Long> requestedActivityIds = workshopCreateDTO.getActivityIds() != null ?
                workshopCreateDTO.getActivityIds() :
                Collections.emptyList();

        List<Activity> currentlyAssociatedActivities = existingWorkshop.getActivities();

        List<Activity> newRequestedActivities = requestedActivityIds.stream()
                .map(activityId -> activityRepository.findById(activityId)
                        .orElseThrow(() -> new EntityNotFoundException("Activity not found with ID: " + activityId)))
                .collect(Collectors.toList());

        // 💡 Collect all activities that need to be updated
        List<Activity> activitiesToPersist = new ArrayList<>();

        // A. Activities to DISASSOCIATE
        Set<Activity> activitiesToDisassociate = currentlyAssociatedActivities.stream()
                .filter(activity -> !newRequestedActivities.contains(activity))
                .collect(Collectors.toSet());

        for (Activity activity : activitiesToDisassociate) {
            activity.setWorkshop(null); // Set foreign key to null
            activitiesToPersist.add(activity); // Add to list for batch save
        }

        // B. Activities to ASSOCIATE
        Set<Activity> activitiesToAssociate = newRequestedActivities.stream()
                .filter(activity -> !currentlyAssociatedActivities.contains(activity))
                .collect(Collectors.toSet());

        for (Activity activity : activitiesToAssociate) {
            activity.setWorkshop(existingWorkshop); // Set foreign key to this workshop's ID
            activitiesToPersist.add(activity); // Add to list for batch save
        }

        // 💡 NEW: Perform batch save for all modified activities
        if (!activitiesToPersist.isEmpty()) {
            activityRepository.saveAll(activitiesToPersist);
        }

        // After updating the activities, update the existingWorkshop's collection for consistency
        existingWorkshop.setActivities(newRequestedActivities);

        // 3. Save the updated workshop entity (for its own properties)
        Workshop updatedWorkshop = workshopRepository.save(existingWorkshop);

        // 4. Map the updated workshop entity to DTO for response
        return workshopMapper.toDto(updatedWorkshop);
    }


    @Transactional
    public void deleteWorkshop(Long id) {
        if (!workshopRepository.existsById(id)) {
            throw new EntityNotFoundException("Workshop not found with ID: " + id);
        }
        workshopRepository.deleteById(id);
    }
}