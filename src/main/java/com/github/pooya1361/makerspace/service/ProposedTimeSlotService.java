// src/main/java/com/github/pooya1361/makerspace/service/ProposedTimeSlotService.java
package com.github.pooya1361.makerspace.service;

import com.github.pooya1361.makerspace.dto.create.ProposedTimeSlotCreateDTO;
import com.github.pooya1361.makerspace.dto.response.ProposedTimeSlotResponseDTO;
import com.github.pooya1361.makerspace.mapper.ProposedTimeSlotMapper;
import com.github.pooya1361.makerspace.model.ProposedTimeSlot;
import com.github.pooya1361.makerspace.model.ScheduledLesson;
import com.github.pooya1361.makerspace.repository.ProposedTimeSlotRepository;
import com.github.pooya1361.makerspace.repository.ScheduledLessonRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class ProposedTimeSlotService {

    private final ProposedTimeSlotRepository proposedTimeSlotRepository;
    private final ProposedTimeSlotMapper proposedTimeSlotMapper;
    private final ScheduledLessonRepository scheduledLessonRepository;

    public ProposedTimeSlotService(ProposedTimeSlotRepository proposedTimeSlotRepository,
                                   ProposedTimeSlotMapper proposedTimeSlotMapper,
                                   ScheduledLessonRepository scheduledLessonRepository) {
        this.proposedTimeSlotRepository = proposedTimeSlotRepository;
        this.proposedTimeSlotMapper = proposedTimeSlotMapper;
        this.scheduledLessonRepository = scheduledLessonRepository;
    }

    @Transactional
    public ProposedTimeSlotResponseDTO createProposedTimeSlot(ProposedTimeSlotCreateDTO createDTO) {
        ScheduledLesson scheduledLesson = scheduledLessonRepository.findById(createDTO.getScheduledLessonId())
                .orElseThrow(() -> new EntityNotFoundException("ScheduledLesson not found with ID: " + createDTO.getScheduledLessonId()));

        ProposedTimeSlot proposedTimeSlot = proposedTimeSlotMapper.toEntity(createDTO);
        proposedTimeSlot.setScheduledLesson(scheduledLesson);
        ProposedTimeSlot savedProposedTimeSlot = proposedTimeSlotRepository.save(proposedTimeSlot);
        return proposedTimeSlotMapper.toDto(savedProposedTimeSlot);
    }

    public List<ProposedTimeSlotResponseDTO> getAllProposedTimeSlots() {
        return proposedTimeSlotMapper.toDtoList(proposedTimeSlotRepository.findAll());
    }

    public Optional<ProposedTimeSlotResponseDTO> getProposedTimeSlotById(Long id) {
        return proposedTimeSlotRepository.findById(id)
                .map(proposedTimeSlotMapper::toDto);
    }

    @Transactional
    public ProposedTimeSlotResponseDTO updateProposedTimeSlot(Long id, ProposedTimeSlotCreateDTO updateDTO) {
        ProposedTimeSlot existingProposedTimeSlot = proposedTimeSlotRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("ProposedTimeSlot not found with ID: " + id));

        proposedTimeSlotMapper.updateProposedTimeSlotFromDto(updateDTO, existingProposedTimeSlot);

        if (updateDTO.getScheduledLessonId() != null) {
            ScheduledLesson newScheduledLesson = scheduledLessonRepository.findById(updateDTO.getScheduledLessonId())
                    .orElseThrow(() -> new EntityNotFoundException("ScheduledLesson not found with ID: " + updateDTO.getScheduledLessonId()));
            existingProposedTimeSlot.setScheduledLesson(newScheduledLesson);
        }

        ProposedTimeSlot updatedProposedTimeSlot = proposedTimeSlotRepository.save(existingProposedTimeSlot);
        return proposedTimeSlotMapper.toDto(updatedProposedTimeSlot);
    }

    @Transactional
    public void deleteProposedTimeSlot(Long id) {
        if (!proposedTimeSlotRepository.existsById(id)) {
            throw new EntityNotFoundException("ProposedTimeSlot not found with ID: " + id);
        }
        // Consider cascading deletes or manual deletion of related Votes here
        proposedTimeSlotRepository.deleteById(id);
    }
}