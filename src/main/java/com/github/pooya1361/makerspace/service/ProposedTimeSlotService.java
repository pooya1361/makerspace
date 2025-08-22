// src/main/java/com/github/pooya1361/makerspace/service/ProposedTimeSlotService.java
package com.github.pooya1361.makerspace.service;

import com.github.pooya1361.makerspace.dto.create.ProposedTimeSlotCreateDTO;
import com.github.pooya1361.makerspace.dto.response.ProposedTimeSlotResponseDTO;
import com.github.pooya1361.makerspace.mapper.ProposedTimeSlotMapper;
import com.github.pooya1361.makerspace.model.ProposedTimeSlot;
import com.github.pooya1361.makerspace.model.ScheduledLesson;
import com.github.pooya1361.makerspace.model.User;
import com.github.pooya1361.makerspace.repository.LessonUserRepository;
import com.github.pooya1361.makerspace.repository.ProposedTimeSlotRepository;
import com.github.pooya1361.makerspace.repository.ScheduledLessonRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Value;

@Service
@RequiredArgsConstructor
@Slf4j
public class ProposedTimeSlotService {

    @Value("${app.email.notification-cooldown-minutes:30}")
    private int notificationCooldownMinutes;

    private final ProposedTimeSlotRepository proposedTimeSlotRepository;
    private final ProposedTimeSlotMapper proposedTimeSlotMapper;
    private final ScheduledLessonRepository scheduledLessonRepository;
    private final LessonUserRepository lessonUserRepository;
    private final EmailService emailService;

    @Transactional
    public ProposedTimeSlotResponseDTO createProposedTimeSlot(ProposedTimeSlotCreateDTO createDTO) {
        // Find the scheduled lesson
        ScheduledLesson scheduledLesson = scheduledLessonRepository.findById(createDTO.getScheduledLessonId())
                .orElseThrow(() -> new EntityNotFoundException("ScheduledLesson not found with id: " + createDTO.getScheduledLessonId()));

        // *** NEW: Check if we should send email notifications ***
        boolean shouldSendNotification = shouldSendEmailNotification(scheduledLesson.getId());

        // Create the proposed time slot (same as before)
        ProposedTimeSlot proposedTimeSlot = new ProposedTimeSlot();
        proposedTimeSlot.setProposedStartTime(createDTO.getProposedStartTime());
        proposedTimeSlot.setScheduledLesson(scheduledLesson);
        // createdAt will be set automatically by @CreationTimestamp

        // Save the proposed time slot
        ProposedTimeSlot savedProposedTimeSlot = proposedTimeSlotRepository.save(proposedTimeSlot);

        // *** NEW: Only send emails if no recent notifications ***
        System.out.println("shouldSendNotification: " + shouldSendNotification);
        if (shouldSendNotification) {
            sendEmailNotificationsToInterestedUsers(scheduledLesson, savedProposedTimeSlot);
        } else {
            System.out.println("Skipping email notification - recent notification already sent for scheduled lesson {}" +
                    scheduledLesson.getId());
        }

        return proposedTimeSlotMapper.toDto(savedProposedTimeSlot);
    }

    private boolean shouldSendEmailNotification(Long scheduledLessonId) {
        OffsetDateTime cutoffTime = OffsetDateTime.now().minusMinutes(notificationCooldownMinutes);
        boolean hasRecentTimeSlots = proposedTimeSlotRepository.existsByScheduledLessonIdAndCreatedAtAfter(
                scheduledLessonId, cutoffTime);

        log.debug("Notification check for lesson {}: hasRecentTimeSlots={}, cutoffTime={}",
                scheduledLessonId, hasRecentTimeSlots, cutoffTime);

        return !hasRecentTimeSlots; // Send email only if NO recent time slots
    }

    private void sendEmailNotificationsToInterestedUsers(ScheduledLesson scheduledLesson, ProposedTimeSlot proposedTimeSlot) {
        try {
            List<User> interestedUsers = lessonUserRepository.findUsersByLessonId(scheduledLesson.getLesson().getId());

            if (interestedUsers.isEmpty()) {
                log.info("No interested users found for lesson {}", scheduledLesson.getLesson().getId());
                return;
            }

            for (User user : interestedUsers) {
                emailService.sendNewScheduledLessonNotification(user, scheduledLesson, proposedTimeSlot);
            }

            log.info("Sent email notifications to {} users for new proposed time slot", interestedUsers.size());
        } catch (Exception e) {
            log.error("Failed to send email notifications: {}", e.getMessage(), e);
        }
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