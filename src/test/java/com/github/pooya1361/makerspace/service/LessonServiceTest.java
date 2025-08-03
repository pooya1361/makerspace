// src/test/java/com/github/pooya1361/makerspace/service/LessonServiceTest.java
package com.github.pooya1361.makerspace.service;

import com.github.pooya1361.makerspace.dto.create.LessonCreateDTO;
import com.github.pooya1361.makerspace.dto.response.LessonResponseDTO;
import com.github.pooya1361.makerspace.mapper.LessonMapper;
import com.github.pooya1361.makerspace.model.Activity;
import com.github.pooya1361.makerspace.model.Lesson;
import com.github.pooya1361.makerspace.repository.ActivityRepository;
import com.github.pooya1361.makerspace.repository.LessonRepository;
import jakarta.persistence.EntityNotFoundException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class LessonServiceTest {

    @Mock
    private LessonRepository lessonRepository;

    @Mock
    private LessonMapper lessonMapper;

    @Mock
    private ActivityRepository activityRepository;

    @InjectMocks
    private LessonService lessonService;

    private Lesson lesson;
    private Activity activity;
    private LessonCreateDTO lessonCreateDTO;
    private LessonResponseDTO lessonResponseDTO;

    @BeforeEach
    void setUp() {
        // Setup Activity
        activity = new Activity();
        activity.setId(1L);
        activity.setName("Test Activity");
        activity.setDescription("Test Activity Description");

        // Setup Lesson
        lesson = new Lesson();
        lesson.setId(1L);
        lesson.setName("Test Lesson");
        lesson.setDescription("Test Lesson Description");
        lesson.setActivity(activity);

        // Setup DTOs
        lessonCreateDTO = new LessonCreateDTO();
        lessonCreateDTO.setName("Test Lesson");
        lessonCreateDTO.setDescription("Test Lesson Description");
        lessonCreateDTO.setActivityId(1L);

        lessonResponseDTO = new LessonResponseDTO();
        lessonResponseDTO.setId(1L);
        lessonResponseDTO.setName("Test Lesson");
        lessonResponseDTO.setDescription("Test Lesson Description");
    }

    // ==================== CREATE LESSON TESTS ====================

    @Test
    void createLesson_WithActivity_Success() {
        // given
        when(lessonMapper.toEntity(lessonCreateDTO)).thenReturn(lesson);
        when(activityRepository.findById(1L)).thenReturn(Optional.of(activity));
        when(lessonRepository.save(lesson)).thenReturn(lesson);
        when(lessonMapper.toDto(lesson)).thenReturn(lessonResponseDTO);

        // when
        LessonResponseDTO result = lessonService.createLesson(lessonCreateDTO);

        // then
        assertThat(result).isNotNull();
        assertThat(result.getName()).isEqualTo("Test Lesson");

        verify(lessonMapper).toEntity(lessonCreateDTO);
        verify(activityRepository).findById(1L);
        verify(lessonRepository).save(lesson);
        verify(lessonMapper).toDto(lesson);
        // Note: We can't verify setActivity on real object, but we verify activity was found
    }

    @Test
    void createLesson_WithoutActivity_Success() {
        // given
        lessonCreateDTO.setActivityId(null); // No activity
        Lesson lessonWithoutActivity = new Lesson();
        lessonWithoutActivity.setName("Test Lesson");

        when(lessonMapper.toEntity(lessonCreateDTO)).thenReturn(lessonWithoutActivity);
        when(lessonRepository.save(lessonWithoutActivity)).thenReturn(lessonWithoutActivity);
        when(lessonMapper.toDto(lessonWithoutActivity)).thenReturn(lessonResponseDTO);

        // when
        LessonResponseDTO result = lessonService.createLesson(lessonCreateDTO);

        // then
        assertThat(result).isNotNull();
        assertThat(result.getName()).isEqualTo("Test Lesson");

        verify(lessonMapper).toEntity(lessonCreateDTO);
        verify(activityRepository, never()).findById(any()); // Should not look for activity
        verify(lessonRepository).save(lessonWithoutActivity);
        verify(lessonMapper).toDto(lessonWithoutActivity);
    }

    @Test
    void createLesson_ActivityNotFound_ThrowsException() {
        // given
        when(lessonMapper.toEntity(lessonCreateDTO)).thenReturn(lesson);
        when(activityRepository.findById(1L)).thenReturn(Optional.empty());

        // when & then
        assertThatThrownBy(() -> lessonService.createLesson(lessonCreateDTO))
                .isInstanceOf(EntityNotFoundException.class)
                .hasMessage("Activity not found with ID: 1");

        verify(lessonRepository, never()).save(any());
    }

    // ==================== GET ALL LESSONS TESTS ====================

    @Test
    void getAllLessons_Success() {
        // given
        List<Lesson> lessons = Arrays.asList(lesson);
        List<LessonResponseDTO> expectedDtos = Arrays.asList(lessonResponseDTO);

        when(lessonRepository.findAll()).thenReturn(lessons);
        when(lessonMapper.toDtoList(lessons)).thenReturn(expectedDtos);

        // when
        List<LessonResponseDTO> result = lessonService.getAllLessons();

        // then
        assertThat(result).hasSize(1);
        assertThat(result.get(0).getName()).isEqualTo("Test Lesson");

        verify(lessonRepository).findAll();
        verify(lessonMapper).toDtoList(lessons);
    }

    @Test
    void getAllLessons_EmptyList() {
        // given
        List<Lesson> emptyLessons = Arrays.asList();
        List<LessonResponseDTO> emptyDtos = Arrays.asList();

        when(lessonRepository.findAll()).thenReturn(emptyLessons);
        when(lessonMapper.toDtoList(emptyLessons)).thenReturn(emptyDtos);

        // when
        List<LessonResponseDTO> result = lessonService.getAllLessons();

        // then
        assertThat(result).isEmpty();
        verify(lessonRepository).findAll();
        verify(lessonMapper).toDtoList(emptyLessons);
    }

    // ==================== GET LESSON BY ID TESTS ====================

    @Test
    void getLessonById_Success() {
        // given
        when(lessonRepository.findById(1L)).thenReturn(Optional.of(lesson));
        when(lessonMapper.toDto(lesson)).thenReturn(lessonResponseDTO);

        // when
        Optional<LessonResponseDTO> result = lessonService.getLessonById(1L);

        // then
        assertThat(result).isPresent();
        assertThat(result.get().getName()).isEqualTo("Test Lesson");

        verify(lessonRepository).findById(1L);
        verify(lessonMapper).toDto(lesson);
    }

    @Test
    void getLessonById_NotFound() {
        // given
        when(lessonRepository.findById(1L)).thenReturn(Optional.empty());

        // when
        Optional<LessonResponseDTO> result = lessonService.getLessonById(1L);

        // then
        assertThat(result).isEmpty();
        verify(lessonRepository).findById(1L);
        verify(lessonMapper, never()).toDto(any());
    }

    // ==================== UPDATE LESSON TESTS ====================

    @Test
    void updateLesson_WithNewActivity_Success() {
        // given
        Activity newActivity = new Activity();
        newActivity.setId(2L);
        newActivity.setName("New Activity");

        LessonCreateDTO updateDTO = new LessonCreateDTO();
        updateDTO.setName("Updated Lesson");
        updateDTO.setActivityId(2L);

        when(lessonRepository.findById(1L)).thenReturn(Optional.of(lesson));
        when(activityRepository.findById(2L)).thenReturn(Optional.of(newActivity));
        when(lessonRepository.save(lesson)).thenReturn(lesson);
        when(lessonMapper.toDto(lesson)).thenReturn(lessonResponseDTO);

        // when
        LessonResponseDTO result = lessonService.updateLesson(1L, updateDTO);

        // then
        assertThat(result).isNotNull();

        verify(lessonRepository).findById(1L);
        verify(lessonMapper).updateLessonFromDto(updateDTO, lesson);
        verify(activityRepository).findById(2L);
        verify(lessonRepository).save(lesson);
        verify(lessonMapper).toDto(lesson);
        // Note: Can't verify setActivity calls on real object, but we verify the flow
    }

    @Test
    void updateLesson_RemoveActivity_Success() {
        // given
        LessonCreateDTO updateDTO = new LessonCreateDTO();
        updateDTO.setName("Updated Lesson");
        updateDTO.setActivityId(null); // Remove activity

        when(lessonRepository.findById(1L)).thenReturn(Optional.of(lesson));
        when(lessonRepository.save(lesson)).thenReturn(lesson);
        when(lessonMapper.toDto(lesson)).thenReturn(lessonResponseDTO);

        // when
        LessonResponseDTO result = lessonService.updateLesson(1L, updateDTO);

        // then
        assertThat(result).isNotNull();

        verify(lessonRepository).findById(1L);
        verify(lessonMapper).updateLessonFromDto(updateDTO, lesson);
        verify(activityRepository, never()).findById(any()); // Should not look for activity
        verify(lessonRepository).save(lesson);
        verify(lessonMapper).toDto(lesson);
        // Note: Can't verify setActivity(null) on real object, but we verify no activity lookup
    }

    @Test
    void updateLesson_LessonNotFound_ThrowsException() {
        // given
        LessonCreateDTO updateDTO = new LessonCreateDTO();
        when(lessonRepository.findById(1L)).thenReturn(Optional.empty());

        // when & then
        assertThatThrownBy(() -> lessonService.updateLesson(1L, updateDTO))
                .isInstanceOf(EntityNotFoundException.class)
                .hasMessage("Lesson not found with ID: 1");

        verify(lessonRepository, never()).save(any());
    }

    @Test
    void updateLesson_ActivityNotFound_ThrowsException() {
        // given
        LessonCreateDTO updateDTO = new LessonCreateDTO();
        updateDTO.setActivityId(999L); // Non-existent activity

        when(lessonRepository.findById(1L)).thenReturn(Optional.of(lesson));
        when(activityRepository.findById(999L)).thenReturn(Optional.empty());

        // when & then
        assertThatThrownBy(() -> lessonService.updateLesson(1L, updateDTO))
                .isInstanceOf(EntityNotFoundException.class)
                .hasMessage("Activity not found with ID: 999");

        verify(lessonRepository, never()).save(any());
    }

    // ==================== DELETE LESSON TESTS ====================

    @Test
    void deleteLesson_Success() {
        // given
        when(lessonRepository.existsById(1L)).thenReturn(true);

        // when
        lessonService.deleteLesson(1L);

        // then
        verify(lessonRepository).existsById(1L);
        verify(lessonRepository).deleteById(1L);
    }

    @Test
    void deleteLesson_NotFound_ThrowsException() {
        // given
        when(lessonRepository.existsById(1L)).thenReturn(false);

        // when & then
        assertThatThrownBy(() -> lessonService.deleteLesson(1L))
                .isInstanceOf(EntityNotFoundException.class)
                .hasMessage("Lesson not found with ID: 1");

        verify(lessonRepository).existsById(1L);
        verify(lessonRepository, never()).deleteById(any());
    }
}