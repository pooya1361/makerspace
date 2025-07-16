// src/main/java/com/github/pooya1361/makerspace/service/ScheduledLessonService.java
package com.github.pooya1361.makerspace.service;

import com.github.pooya1361.makerspace.dto.create.ScheduledLessonCreateDTO;
import com.github.pooya1361.makerspace.dto.response.ScheduledLessonResponseDTO;
import com.github.pooya1361.makerspace.mapper.ScheduledLessonMapper;
import com.github.pooya1361.makerspace.model.Lesson;
import com.github.pooya1361.makerspace.model.ScheduledLesson;
import com.github.pooya1361.makerspace.model.User;
import com.github.pooya1361.makerspace.repository.LessonRepository;
import com.github.pooya1361.makerspace.repository.ScheduledLessonRepository;
import com.github.pooya1361.makerspace.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class ScheduledLessonService {

    private final ScheduledLessonRepository scheduledLessonRepository;
    private final ScheduledLessonMapper scheduledLessonMapper;
    private final LessonRepository lessonRepository;
    private final UserRepository userRepository;

    public ScheduledLessonService(ScheduledLessonRepository scheduledLessonRepository,
                                  ScheduledLessonMapper scheduledLessonMapper,
                                  LessonRepository lessonRepository,
                                  UserRepository userRepository) {
        this.scheduledLessonRepository = scheduledLessonRepository;
        this.scheduledLessonMapper = scheduledLessonMapper;
        this.lessonRepository = lessonRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public ScheduledLessonResponseDTO createScheduledLesson(ScheduledLessonCreateDTO createDTO) {
        Lesson lesson = lessonRepository.findById(createDTO.getLessonId())
                .orElseThrow(() -> new EntityNotFoundException("Lesson not found with ID: " + createDTO.getLessonId()));
        User instructor = userRepository.findById(createDTO.getInstructorUserId())
                .orElseThrow(() -> new EntityNotFoundException("Instructor not found with ID: " + createDTO.getInstructorUserId()));

        ScheduledLesson scheduledLesson = scheduledLessonMapper.toEntity(createDTO);
        scheduledLesson.setLesson(lesson);
        scheduledLesson.setInstructor(instructor);
        ScheduledLesson savedScheduledLesson = scheduledLessonRepository.save(scheduledLesson);
        return scheduledLessonMapper.toDto(savedScheduledLesson);
    }

    public List<ScheduledLessonResponseDTO> getAllScheduledLessons() {
        return scheduledLessonMapper.toDtoList(scheduledLessonRepository.findAll());
    }

    public Optional<ScheduledLessonResponseDTO> getScheduledLessonById(Long id) {
        return scheduledLessonRepository.findById(id)
                .map(scheduledLessonMapper::toDto);
    }

    @Transactional
    public ScheduledLessonResponseDTO updateScheduledLesson(Long id, ScheduledLessonCreateDTO updateDTO) {
        ScheduledLesson existingScheduledLesson = scheduledLessonRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("ScheduledLesson not found with ID: " + id));

        scheduledLessonMapper.updateScheduledLessonFromDto(updateDTO, existingScheduledLesson);

        if (updateDTO.getLessonId() != null) {
            Lesson newLesson = lessonRepository.findById(updateDTO.getLessonId())
                    .orElseThrow(() -> new EntityNotFoundException("Lesson not found with ID: " + updateDTO.getLessonId()));
            existingScheduledLesson.setLesson(newLesson);
        }
        if (updateDTO.getInstructorUserId() != null) {
            User newInstructor = userRepository.findById(updateDTO.getInstructorUserId())
                    .orElseThrow(() -> new EntityNotFoundException("Instructor not found with ID: " + updateDTO.getInstructorUserId()));
            existingScheduledLesson.setInstructor(newInstructor);
        }

        ScheduledLesson updatedScheduledLesson = scheduledLessonRepository.save(existingScheduledLesson);
        return scheduledLessonMapper.toDto(updatedScheduledLesson);
    }

    @Transactional
    public void deleteScheduledLesson(Long id) {
        if (!scheduledLessonRepository.existsById(id)) {
            throw new EntityNotFoundException("ScheduledLesson not found with ID: " + id);
        }
        // Consider cascading deletes or manual deletion of related ProposedTimeSlots here
        scheduledLessonRepository.deleteById(id);
    }
}