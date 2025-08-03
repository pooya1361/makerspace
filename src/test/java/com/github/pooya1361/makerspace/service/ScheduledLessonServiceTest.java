// src/test/java/com/github/pooya1361/makerspace/service/ScheduledLessonServiceTest.java
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
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ScheduledLessonServiceTest {

    @Mock
    private ScheduledLessonRepository scheduledLessonRepository;

    @Mock
    private ScheduledLessonMapper scheduledLessonMapper;

    @Mock
    private LessonRepository lessonRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private ScheduledLessonService scheduledLessonService;

    private ScheduledLesson scheduledLesson;
    private Lesson lesson;
    private User instructor;
    private User newInstructor;
    private ScheduledLessonCreateDTO scheduledLessonCreateDTO;
    private ScheduledLessonResponseDTO scheduledLessonResponseDTO;

    @BeforeEach
    void setUp() {
        // Setup Lesson
        lesson = new Lesson();
        lesson.setId(1L);
        lesson.setName("Test Lesson");
        lesson.setDescription("Test Lesson Description");

        // Setup Instructor (User)
        instructor = new User();
        instructor.setId(1L);
        instructor.setFirstName("John");
        instructor.setLastName("Instructor");
        instructor.setEmail("john@example.com");

        // Setup New Instructor for update tests
        newInstructor = new User();
        newInstructor.setId(2L);
        newInstructor.setFirstName("Jane");
        newInstructor.setLastName("Instructor");
        newInstructor.setEmail("jane@example.com");

        // Setup ScheduledLesson
        scheduledLesson = new ScheduledLesson();
        scheduledLesson.setId(1L);
        scheduledLesson.setStartTime(Optional.of(OffsetDateTime.of(2025, 8, 15, 10, 0, 0, 0, ZoneOffset.UTC)));
        scheduledLesson.setDurationInMinutes(90L);
        scheduledLesson.setLesson(lesson);
        scheduledLesson.setInstructor(instructor);

        // Setup DTOs
        scheduledLessonCreateDTO = new ScheduledLessonCreateDTO();
        scheduledLessonCreateDTO.setStartTime(Optional.of(OffsetDateTime.of(2025, 8, 15, 10, 0, 0, 0, ZoneOffset.UTC)));
        scheduledLessonCreateDTO.setDurationInMinutes(90L);
        scheduledLessonCreateDTO.setLessonId(1L);
        scheduledLessonCreateDTO.setInstructorUserId(1L);

        scheduledLessonResponseDTO = new ScheduledLessonResponseDTO();
        scheduledLessonResponseDTO.setId(1L);
        scheduledLessonResponseDTO.setStartTime(Optional.of(OffsetDateTime.of(2025, 8, 15, 10, 0, 0, 0, ZoneOffset.UTC)));
        scheduledLessonResponseDTO.setDurationInMinutes(90L);
    }

    // ==================== CREATE SCHEDULED LESSON TESTS ====================

    @Test
    void createScheduledLesson_Success() {
        // given
        when(lessonRepository.findById(1L)).thenReturn(Optional.of(lesson));
        when(userRepository.findById(1L)).thenReturn(Optional.of(instructor));
        when(scheduledLessonMapper.toEntity(scheduledLessonCreateDTO)).thenReturn(scheduledLesson);
        when(scheduledLessonRepository.save(scheduledLesson)).thenReturn(scheduledLesson);
        when(scheduledLessonMapper.toDto(scheduledLesson)).thenReturn(scheduledLessonResponseDTO);

        // when
        ScheduledLessonResponseDTO result = scheduledLessonService.createScheduledLesson(scheduledLessonCreateDTO);

        // then
        assertThat(result).isNotNull();
        assertThat(result.getDurationInMinutes()).isEqualTo(90L);

        verify(lessonRepository).findById(1L);
        verify(userRepository).findById(1L);
        verify(scheduledLessonMapper).toEntity(scheduledLessonCreateDTO);
        verify(scheduledLessonRepository).save(scheduledLesson);
        verify(scheduledLessonMapper).toDto(scheduledLesson);
    }

    @Test
    void createScheduledLesson_LessonNotFound_ThrowsException() {
        // given
        when(lessonRepository.findById(1L)).thenReturn(Optional.empty());

        // when & then
        assertThatThrownBy(() -> scheduledLessonService.createScheduledLesson(scheduledLessonCreateDTO))
                .isInstanceOf(EntityNotFoundException.class)
                .hasMessage("Lesson not found with ID: 1");

        verify(lessonRepository).findById(1L);
        verify(userRepository, never()).findById(any());
        verify(scheduledLessonRepository, never()).save(any());
    }

    @Test
    void createScheduledLesson_InstructorNotFound_ThrowsException() {
        // given
        when(lessonRepository.findById(1L)).thenReturn(Optional.of(lesson));
        when(userRepository.findById(1L)).thenReturn(Optional.empty());

        // when & then
        assertThatThrownBy(() -> scheduledLessonService.createScheduledLesson(scheduledLessonCreateDTO))
                .isInstanceOf(EntityNotFoundException.class)
                .hasMessage("Instructor not found with ID: 1");

        verify(lessonRepository).findById(1L);
        verify(userRepository).findById(1L);
        verify(scheduledLessonRepository, never()).save(any());
    }

    // ==================== GET ALL SCHEDULED LESSONS TESTS ====================

    @Test
    void getAllScheduledLessons_Success() {
        // given
        List<ScheduledLesson> scheduledLessons = Arrays.asList(scheduledLesson);
        List<ScheduledLessonResponseDTO> expectedDtos = Arrays.asList(scheduledLessonResponseDTO);

        when(scheduledLessonRepository.findAll()).thenReturn(scheduledLessons);
        when(scheduledLessonMapper.toDtoList(scheduledLessons)).thenReturn(expectedDtos);

        // when
        List<ScheduledLessonResponseDTO> result = scheduledLessonService.getAllScheduledLessons();

        // then
        assertThat(result).hasSize(1);
        assertThat(result.get(0).getDurationInMinutes()).isEqualTo(90L);

        verify(scheduledLessonRepository).findAll();
        verify(scheduledLessonMapper).toDtoList(scheduledLessons);
    }

    @Test
    void getAllScheduledLessons_EmptyList() {
        // given
        List<ScheduledLesson> emptyScheduledLessons = Arrays.asList();
        List<ScheduledLessonResponseDTO> emptyDtos = Arrays.asList();

        when(scheduledLessonRepository.findAll()).thenReturn(emptyScheduledLessons);
        when(scheduledLessonMapper.toDtoList(emptyScheduledLessons)).thenReturn(emptyDtos);

        // when
        List<ScheduledLessonResponseDTO> result = scheduledLessonService.getAllScheduledLessons();

        // then
        assertThat(result).isEmpty();
        verify(scheduledLessonRepository).findAll();
        verify(scheduledLessonMapper).toDtoList(emptyScheduledLessons);
    }

    // ==================== GET SCHEDULED LESSON BY ID TESTS ====================

    @Test
    void getScheduledLessonById_Success() {
        // given
        when(scheduledLessonRepository.findById(1L)).thenReturn(Optional.of(scheduledLesson));
        when(scheduledLessonMapper.toDto(scheduledLesson)).thenReturn(scheduledLessonResponseDTO);

        // when
        Optional<ScheduledLessonResponseDTO> result = scheduledLessonService.getScheduledLessonById(1L);

        // then
        assertThat(result).isPresent();
        assertThat(result.get().getDurationInMinutes()).isEqualTo(90L);

        verify(scheduledLessonRepository).findById(1L);
        verify(scheduledLessonMapper).toDto(scheduledLesson);
    }

    @Test
    void getScheduledLessonById_NotFound() {
        // given
        when(scheduledLessonRepository.findById(1L)).thenReturn(Optional.empty());

        // when
        Optional<ScheduledLessonResponseDTO> result = scheduledLessonService.getScheduledLessonById(1L);

        // then
        assertThat(result).isEmpty();
        verify(scheduledLessonRepository).findById(1L);
        verify(scheduledLessonMapper, never()).toDto(any());
    }

    // ==================== UPDATE SCHEDULED LESSON TESTS ====================

    @Test
    void updateScheduledLesson_ChangeBothLessonAndInstructor_Success() {
        // given
        Lesson newLesson = new Lesson();
        newLesson.setId(2L);
        newLesson.setName("New Lesson");

        ScheduledLessonCreateDTO updateDTO = new ScheduledLessonCreateDTO();
        updateDTO.setStartTime(Optional.of(OffsetDateTime.of(2025, 8, 16, 14, 0, 0, 0, ZoneOffset.UTC)));
        updateDTO.setDurationInMinutes(120L);
        updateDTO.setLessonId(2L); // Change lesson
        updateDTO.setInstructorUserId(2L); // Change instructor

        when(scheduledLessonRepository.findById(1L)).thenReturn(Optional.of(scheduledLesson));
        when(lessonRepository.findById(2L)).thenReturn(Optional.of(newLesson));
        when(userRepository.findById(2L)).thenReturn(Optional.of(newInstructor));
        when(scheduledLessonRepository.save(scheduledLesson)).thenReturn(scheduledLesson);
        when(scheduledLessonMapper.toDto(scheduledLesson)).thenReturn(scheduledLessonResponseDTO);

        // when
        ScheduledLessonResponseDTO result = scheduledLessonService.updateScheduledLesson(1L, updateDTO);

        // then
        assertThat(result).isNotNull();

        verify(scheduledLessonRepository).findById(1L);
        verify(scheduledLessonMapper).updateScheduledLessonFromDto(updateDTO, scheduledLesson);
        verify(lessonRepository).findById(2L);
        verify(userRepository).findById(2L);
        verify(scheduledLessonRepository).save(scheduledLesson);
        verify(scheduledLessonMapper).toDto(scheduledLesson);
    }

    @Test
    void updateScheduledLesson_ChangeLessonOnly_Success() {
        // given
        Lesson newLesson = new Lesson();
        newLesson.setId(2L);
        newLesson.setName("New Lesson");

        ScheduledLessonCreateDTO updateDTO = new ScheduledLessonCreateDTO();
        updateDTO.setStartTime(Optional.of(OffsetDateTime.of(2025, 8, 16, 14, 0, 0, 0, ZoneOffset.UTC)));
        updateDTO.setDurationInMinutes(120L);
        updateDTO.setLessonId(2L); // Change lesson
        updateDTO.setInstructorUserId(null); // Don't change instructor

        when(scheduledLessonRepository.findById(1L)).thenReturn(Optional.of(scheduledLesson));
        when(lessonRepository.findById(2L)).thenReturn(Optional.of(newLesson));
        when(scheduledLessonRepository.save(scheduledLesson)).thenReturn(scheduledLesson);
        when(scheduledLessonMapper.toDto(scheduledLesson)).thenReturn(scheduledLessonResponseDTO);

        // when
        ScheduledLessonResponseDTO result = scheduledLessonService.updateScheduledLesson(1L, updateDTO);

        // then
        assertThat(result).isNotNull();

        verify(scheduledLessonRepository).findById(1L);
        verify(scheduledLessonMapper).updateScheduledLessonFromDto(updateDTO, scheduledLesson);
        verify(lessonRepository).findById(2L);
        verify(userRepository, never()).findById(any()); // Should not look for instructor
        verify(scheduledLessonRepository).save(scheduledLesson);
        verify(scheduledLessonMapper).toDto(scheduledLesson);
    }

    @Test
    void updateScheduledLesson_ChangeInstructorOnly_Success() {
        // given
        ScheduledLessonCreateDTO updateDTO = new ScheduledLessonCreateDTO();
        updateDTO.setStartTime(Optional.of(OffsetDateTime.of(2025, 8, 16, 14, 0, 0, 0, ZoneOffset.UTC)));
        updateDTO.setDurationInMinutes(120L);
        updateDTO.setLessonId(null); // Don't change lesson
        updateDTO.setInstructorUserId(2L); // Change instructor

        when(scheduledLessonRepository.findById(1L)).thenReturn(Optional.of(scheduledLesson));
        when(userRepository.findById(2L)).thenReturn(Optional.of(newInstructor));
        when(scheduledLessonRepository.save(scheduledLesson)).thenReturn(scheduledLesson);
        when(scheduledLessonMapper.toDto(scheduledLesson)).thenReturn(scheduledLessonResponseDTO);

        // when
        ScheduledLessonResponseDTO result = scheduledLessonService.updateScheduledLesson(1L, updateDTO);

        // then
        assertThat(result).isNotNull();

        verify(scheduledLessonRepository).findById(1L);
        verify(scheduledLessonMapper).updateScheduledLessonFromDto(updateDTO, scheduledLesson);
        verify(lessonRepository, never()).findById(any()); // Should not look for lesson
        verify(userRepository).findById(2L);
        verify(scheduledLessonRepository).save(scheduledLesson);
        verify(scheduledLessonMapper).toDto(scheduledLesson);
    }

    @Test
    void updateScheduledLesson_NoRelationshipChanges_Success() {
        // given
        ScheduledLessonCreateDTO updateDTO = new ScheduledLessonCreateDTO();
        updateDTO.setStartTime(Optional.of(OffsetDateTime.of(2025, 8, 16, 14, 0, 0, 0, ZoneOffset.UTC)));
        updateDTO.setDurationInMinutes(120L);
        updateDTO.setLessonId(null); // Don't change lesson
        updateDTO.setInstructorUserId(null); // Don't change instructor

        when(scheduledLessonRepository.findById(1L)).thenReturn(Optional.of(scheduledLesson));
        when(scheduledLessonRepository.save(scheduledLesson)).thenReturn(scheduledLesson);
        when(scheduledLessonMapper.toDto(scheduledLesson)).thenReturn(scheduledLessonResponseDTO);

        // when
        ScheduledLessonResponseDTO result = scheduledLessonService.updateScheduledLesson(1L, updateDTO);

        // then
        assertThat(result).isNotNull();

        verify(scheduledLessonRepository).findById(1L);
        verify(scheduledLessonMapper).updateScheduledLessonFromDto(updateDTO, scheduledLesson);
        verify(lessonRepository, never()).findById(any());
        verify(userRepository, never()).findById(any());
        verify(scheduledLessonRepository).save(scheduledLesson);
        verify(scheduledLessonMapper).toDto(scheduledLesson);
    }

    @Test
    void updateScheduledLesson_ScheduledLessonNotFound_ThrowsException() {
        // given
        ScheduledLessonCreateDTO updateDTO = new ScheduledLessonCreateDTO();
        when(scheduledLessonRepository.findById(1L)).thenReturn(Optional.empty());

        // when & then
        assertThatThrownBy(() -> scheduledLessonService.updateScheduledLesson(1L, updateDTO))
                .isInstanceOf(EntityNotFoundException.class)
                .hasMessage("ScheduledLesson not found with ID: 1");

        verify(scheduledLessonRepository, never()).save(any());
    }

    @Test
    void updateScheduledLesson_LessonNotFound_ThrowsException() {
        // given
        ScheduledLessonCreateDTO updateDTO = new ScheduledLessonCreateDTO();
        updateDTO.setLessonId(999L); // Non-existent lesson

        when(scheduledLessonRepository.findById(1L)).thenReturn(Optional.of(scheduledLesson));
        when(lessonRepository.findById(999L)).thenReturn(Optional.empty());

        // when & then
        assertThatThrownBy(() -> scheduledLessonService.updateScheduledLesson(1L, updateDTO))
                .isInstanceOf(EntityNotFoundException.class)
                .hasMessage("Lesson not found with ID: 999");

        verify(scheduledLessonRepository, never()).save(any());
    }

    @Test
    void updateScheduledLesson_InstructorNotFound_ThrowsException() {
        // given
        ScheduledLessonCreateDTO updateDTO = new ScheduledLessonCreateDTO();
        updateDTO.setInstructorUserId(999L); // Non-existent instructor

        when(scheduledLessonRepository.findById(1L)).thenReturn(Optional.of(scheduledLesson));
        when(userRepository.findById(999L)).thenReturn(Optional.empty());

        // when & then
        assertThatThrownBy(() -> scheduledLessonService.updateScheduledLesson(1L, updateDTO))
                .isInstanceOf(EntityNotFoundException.class)
                .hasMessage("Instructor not found with ID: 999");

        verify(scheduledLessonRepository, never()).save(any());
    }

    // ==================== DELETE SCHEDULED LESSON TESTS ====================

    @Test
    void deleteScheduledLesson_Success() {
        // given
        when(scheduledLessonRepository.existsById(1L)).thenReturn(true);

        // when
        scheduledLessonService.deleteScheduledLesson(1L);

        // then
        verify(scheduledLessonRepository).existsById(1L);
        verify(scheduledLessonRepository).deleteById(1L);
    }

    @Test
    void deleteScheduledLesson_NotFound_ThrowsException() {
        // given
        when(scheduledLessonRepository.existsById(1L)).thenReturn(false);

        // when & then
        assertThatThrownBy(() -> scheduledLessonService.deleteScheduledLesson(1L))
                .isInstanceOf(EntityNotFoundException.class)
                .hasMessage("ScheduledLesson not found with ID: 1");

        verify(scheduledLessonRepository).existsById(1L);
        verify(scheduledLessonRepository, never()).deleteById(any());
    }
}