package com.github.pooya1361.makerspace.service;

import com.github.pooya1361.makerspace.dto.create.ProposedTimeSlotCreateDTO;
import com.github.pooya1361.makerspace.dto.create.WorkshopCreateDTO;
import com.github.pooya1361.makerspace.dto.response.ProposedTimeSlotResponseDTO;
import com.github.pooya1361.makerspace.dto.response.WorkshopResponseDTO;
import com.github.pooya1361.makerspace.mapper.ProposedTimeSlotMapper;
import com.github.pooya1361.makerspace.mapper.WorkshopMapper;
import com.github.pooya1361.makerspace.model.ProposedTimeSlot;
import com.github.pooya1361.makerspace.model.ScheduledLesson;
import com.github.pooya1361.makerspace.model.Workshop;
import com.github.pooya1361.makerspace.repository.ProposedTimeSlotRepository;
import com.github.pooya1361.makerspace.repository.ScheduledLessonRepository;
import com.github.pooya1361.makerspace.repository.WorkshopRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
public class WorkshopService {

    private final WorkshopRepository workshopRepository;
    private final ScheduledLessonRepository scheduledLessonRepository;
    private final WorkshopMapper workshopMapper;

    public WorkshopService(WorkshopRepository workshopRepository,
                           ScheduledLessonRepository scheduledLessonRepository, WorkshopMapper workshopMapper) {
        this.workshopRepository = workshopRepository;
        this.scheduledLessonRepository = scheduledLessonRepository;
        this.workshopMapper = workshopMapper;
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

        workshopMapper.updateWorkshopFromDto(workshopCreateDTO, existingWorkshop);
        Workshop updatedWorkshop = workshopRepository.save(existingWorkshop);
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