// src/main/java/com/github/pooya1361/makerspace/service/LessonService.java
package com.github.pooya1361.makerspace.service;

import com.github.pooya1361.makerspace.dto.create.LessonCreateDTO;
import com.github.pooya1361.makerspace.dto.response.LessonResponseDTO;
import com.github.pooya1361.makerspace.mapper.LessonMapper;
import com.github.pooya1361.makerspace.model.Activity;
import com.github.pooya1361.makerspace.model.Lesson;
import com.github.pooya1361.makerspace.repository.ActivityRepository;
import com.github.pooya1361.makerspace.repository.LessonRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class LessonService {

    private final LessonRepository lessonRepository;
    private final LessonMapper lessonMapper;
    private final ActivityRepository activityRepository;

    public LessonService(LessonRepository lessonRepository, LessonMapper lessonMapper, ActivityRepository activityRepository) {
        this.lessonRepository = lessonRepository;
        this.lessonMapper = lessonMapper;
        this.activityRepository = activityRepository;
    }

    @Transactional
    public LessonResponseDTO createLesson(LessonCreateDTO createDTO) {
        Lesson lesson = lessonMapper.toEntity(createDTO);

        if (createDTO.getActivityId() != null) {
            Activity activity = activityRepository.findById(createDTO.getActivityId())
                    .orElseThrow(() -> new EntityNotFoundException("Activity not found with ID: " + createDTO.getActivityId()));
            lesson.setActivity(activity);
        }

        Lesson savedLesson = lessonRepository.save(lesson);
        return lessonMapper.toDto(savedLesson);
    }

    public List<LessonResponseDTO> getAllLessons() {
        return lessonMapper.toDtoList(lessonRepository.findAll());
    }

    public Optional<LessonResponseDTO> getLessonById(Long id) {
        return lessonRepository.findById(id)
                .map(lessonMapper::toDto);
    }

    @Transactional
    public LessonResponseDTO updateLesson(Long id, LessonCreateDTO updateDTO) {
        Lesson existingLesson = lessonRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Lesson not found with ID: " + id));

        lessonMapper.updateLessonFromDto(updateDTO, existingLesson);

        existingLesson.setActivity(null);
        if (updateDTO.getActivityId() != null) {
            Activity newActivity = activityRepository.findById(updateDTO.getActivityId())
                    .orElseThrow(() -> new EntityNotFoundException("Activity not found with ID: " + updateDTO.getActivityId()));
            existingLesson.setActivity(newActivity);
        }

        Lesson updatedLesson = lessonRepository.save(existingLesson);
        return lessonMapper.toDto(updatedLesson);
    }

    @Transactional
    public void deleteLesson(Long id) {
        if (!lessonRepository.existsById(id)) {
            throw new EntityNotFoundException("Lesson not found with ID: " + id);
        }
        // Consider cascading deletes or manual deletion of related ScheduledLessons here
        lessonRepository.deleteById(id);
    }
}