// src/test/java/com/github/pooya1361/makerspace/service/ProposedTimeSlotServiceTest.java
package com.github.pooya1361.makerspace.service;

import com.github.pooya1361.makerspace.dto.create.ProposedTimeSlotCreateDTO;
import com.github.pooya1361.makerspace.dto.response.ProposedTimeSlotResponseDTO;
import com.github.pooya1361.makerspace.mapper.ProposedTimeSlotMapper;
import com.github.pooya1361.makerspace.model.Lesson;
import com.github.pooya1361.makerspace.model.ProposedTimeSlot;
import com.github.pooya1361.makerspace.model.ScheduledLesson;
import com.github.pooya1361.makerspace.model.User;
import com.github.pooya1361.makerspace.repository.LessonUserRepository;
import com.github.pooya1361.makerspace.repository.ProposedTimeSlotRepository;
import com.github.pooya1361.makerspace.repository.ScheduledLessonRepository;
import jakarta.persistence.EntityNotFoundException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ProposedTimeSlotServiceTest {

    @Mock
    private ProposedTimeSlotRepository proposedTimeSlotRepository;

    @Mock
    private ProposedTimeSlotMapper proposedTimeSlotMapper;

    @Mock
    private ScheduledLessonRepository scheduledLessonRepository;

    @Mock
    private LessonUserRepository lessonUserRepository;

    @Mock
    private EmailService emailService;

    @InjectMocks
    private ProposedTimeSlotService proposedTimeSlotService;

    private ProposedTimeSlot proposedTimeSlot;
    private ScheduledLesson scheduledLesson;
    private ScheduledLesson newScheduledLesson;
    private Lesson lesson;
    private User user1;
    private User user2;
    private ProposedTimeSlotCreateDTO proposedTimeSlotCreateDTO;
    private ProposedTimeSlotResponseDTO proposedTimeSlotResponseDTO;
    private OffsetDateTime testDateTime;
    private OffsetDateTime newTestDateTime;

    @BeforeEach
    void setUp() {
        // Set the notification cooldown minutes using ReflectionTestUtils
        ReflectionTestUtils.setField(proposedTimeSlotService, "notificationCooldownMinutes", 30);

        // Setup test times
        testDateTime = OffsetDateTime.of(2025, 8, 15, 14, 30, 0, 0, ZoneOffset.UTC);
        newTestDateTime = OffsetDateTime.of(2025, 8, 16, 16, 0, 0, 0, ZoneOffset.UTC);

        // Setup Lesson
        lesson = new Lesson();
        lesson.setId(1L);
        lesson.setName("Java Programming");
        lesson.setDescription("Learn Java basics");

        // Setup ScheduledLesson
        scheduledLesson = new ScheduledLesson();
        scheduledLesson.setId(1L);
        scheduledLesson.setDurationInMinutes(90L);
        scheduledLesson.setLesson(lesson);

        // Setup New ScheduledLesson for update tests
        newScheduledLesson = new ScheduledLesson();
        newScheduledLesson.setId(2L);
        newScheduledLesson.setDurationInMinutes(120L);
        newScheduledLesson.setLesson(lesson);

        // Setup ProposedTimeSlot
        proposedTimeSlot = new ProposedTimeSlot();
        proposedTimeSlot.setId(1L);
        proposedTimeSlot.setProposedStartTime(testDateTime);
        proposedTimeSlot.setScheduledLesson(scheduledLesson);

        // Setup Users
        user1 = new User();
        user1.setId(1L);
        user1.setEmail("user1@example.com");
        user1.setFirstName("John");

        user2 = new User();
        user2.setId(2L);
        user2.setEmail("user2@example.com");
        user2.setFirstName("Jane");

        // Setup DTOs
        proposedTimeSlotCreateDTO = new ProposedTimeSlotCreateDTO();
        proposedTimeSlotCreateDTO.setProposedStartTime(testDateTime);
        proposedTimeSlotCreateDTO.setScheduledLessonId(1L);

        proposedTimeSlotResponseDTO = new ProposedTimeSlotResponseDTO();
        proposedTimeSlotResponseDTO.setId(1L);
        proposedTimeSlotResponseDTO.setProposedStartTime(testDateTime);
    }

    // ==================== CREATE PROPOSED TIME SLOT TESTS ====================

    @Test
    void createProposedTimeSlot_WithEmailNotification_Success() {
        // given
        List<User> interestedUsers = Arrays.asList(user1, user2);

        when(scheduledLessonRepository.findById(1L)).thenReturn(Optional.of(scheduledLesson));
        when(proposedTimeSlotRepository.save(any(ProposedTimeSlot.class))).thenReturn(proposedTimeSlot);
        when(proposedTimeSlotMapper.toDto(proposedTimeSlot)).thenReturn(proposedTimeSlotResponseDTO);

        // Mock anti-spam check - no recent time slots
        when(proposedTimeSlotRepository.existsByScheduledLessonIdAndCreatedAtAfter(eq(1L), any(OffsetDateTime.class)))
                .thenReturn(false);

        // Mock interested users
        when(lessonUserRepository.findUsersByLessonId(1L)).thenReturn(interestedUsers);

        // when
        ProposedTimeSlotResponseDTO result = proposedTimeSlotService.createProposedTimeSlot(proposedTimeSlotCreateDTO);

        // then
        assertThat(result).isNotNull();
        assertThat(result.getProposedStartTime()).isEqualTo(testDateTime);

        // Verify email notifications were sent
        verify(emailService).sendNewScheduledLessonNotification(user1, scheduledLesson, proposedTimeSlot);
        verify(emailService).sendNewScheduledLessonNotification(user2, scheduledLesson, proposedTimeSlot);
    }

    @Test
    void createProposedTimeSlot_ScheduledLessonNotFound_ThrowsException() {
        // given
        when(scheduledLessonRepository.findById(1L)).thenReturn(Optional.empty());

        // when & then
        assertThatThrownBy(() -> proposedTimeSlotService.createProposedTimeSlot(proposedTimeSlotCreateDTO))
                .isInstanceOf(EntityNotFoundException.class)
                .hasMessage("ScheduledLesson not found with id: 1");

        verify(scheduledLessonRepository).findById(1L);
        verify(proposedTimeSlotRepository, never()).save(any());
        verify(emailService, never()).sendNewScheduledLessonNotification(any(), any(), any());
    }

    @Test
    void createProposedTimeSlot_WithRecentTimeSlots_SkipsEmailNotification() {
        // given
        when(scheduledLessonRepository.findById(1L)).thenReturn(Optional.of(scheduledLesson));
        when(proposedTimeSlotRepository.save(any(ProposedTimeSlot.class))).thenReturn(proposedTimeSlot);
        when(proposedTimeSlotMapper.toDto(proposedTimeSlot)).thenReturn(proposedTimeSlotResponseDTO);

        // Mock anti-spam check - recent time slots exist (within 30 minutes)
        when(proposedTimeSlotRepository.existsByScheduledLessonIdAndCreatedAtAfter(eq(1L), any(OffsetDateTime.class)))
                .thenReturn(true);

        // when
        ProposedTimeSlotResponseDTO result = proposedTimeSlotService.createProposedTimeSlot(proposedTimeSlotCreateDTO);

        // then
        assertThat(result).isNotNull();

        // Verify email notifications were NOT sent due to anti-spam
        verify(lessonUserRepository, never()).findUsersByLessonId(any());
        verify(emailService, never()).sendNewScheduledLessonNotification(any(), any(), any());
    }

    @Test
    void createProposedTimeSlot_WithNoInterestedUsers_SkipsEmailNotification() {
        // given
        when(scheduledLessonRepository.findById(1L)).thenReturn(Optional.of(scheduledLesson));
        when(proposedTimeSlotRepository.save(any(ProposedTimeSlot.class))).thenReturn(proposedTimeSlot);
        when(proposedTimeSlotMapper.toDto(proposedTimeSlot)).thenReturn(proposedTimeSlotResponseDTO);

        // Mock anti-spam check - no recent time slots
        when(proposedTimeSlotRepository.existsByScheduledLessonIdAndCreatedAtAfter(eq(1L), any(OffsetDateTime.class)))
                .thenReturn(false);

        // Mock no interested users
        when(lessonUserRepository.findUsersByLessonId(1L)).thenReturn(Collections.emptyList());

        // when
        ProposedTimeSlotResponseDTO result = proposedTimeSlotService.createProposedTimeSlot(proposedTimeSlotCreateDTO);

        // then
        assertThat(result).isNotNull();

        verify(lessonUserRepository).findUsersByLessonId(1L);
        verify(emailService, never()).sendNewScheduledLessonNotification(any(), any(), any());
    }

    @Test
    void createProposedTimeSlot_EmailServiceThrowsException_ContinuesSuccessfully() {
        // given
        List<User> interestedUsers = Arrays.asList(user1);

        when(scheduledLessonRepository.findById(1L)).thenReturn(Optional.of(scheduledLesson));
        when(proposedTimeSlotRepository.save(any(ProposedTimeSlot.class))).thenReturn(proposedTimeSlot);
        when(proposedTimeSlotMapper.toDto(proposedTimeSlot)).thenReturn(proposedTimeSlotResponseDTO);

        when(proposedTimeSlotRepository.existsByScheduledLessonIdAndCreatedAtAfter(eq(1L), any(OffsetDateTime.class)))
                .thenReturn(false);
        when(lessonUserRepository.findUsersByLessonId(1L)).thenReturn(interestedUsers);

        // Mock email service to throw exception
        doThrow(new RuntimeException("Email service error"))
                .when(emailService).sendNewScheduledLessonNotification(any(), any(), any());

        // when
        ProposedTimeSlotResponseDTO result = proposedTimeSlotService.createProposedTimeSlot(proposedTimeSlotCreateDTO);

        // then - should complete successfully despite email error
        assertThat(result).isNotNull();
        verify(proposedTimeSlotRepository).save(any(ProposedTimeSlot.class));
        verify(emailService).sendNewScheduledLessonNotification(user1, scheduledLesson, proposedTimeSlot);
    }

    // ==================== GET ALL PROPOSED TIME SLOTS TESTS ====================

    @Test
    void getAllProposedTimeSlots_Success() {
        // given
        List<ProposedTimeSlot> proposedTimeSlots = Arrays.asList(proposedTimeSlot);
        List<ProposedTimeSlotResponseDTO> expectedDtos = Arrays.asList(proposedTimeSlotResponseDTO);

        when(proposedTimeSlotRepository.findAll()).thenReturn(proposedTimeSlots);
        when(proposedTimeSlotMapper.toDtoList(proposedTimeSlots)).thenReturn(expectedDtos);

        // when
        List<ProposedTimeSlotResponseDTO> result = proposedTimeSlotService.getAllProposedTimeSlots();

        // then
        assertThat(result).hasSize(1);
        assertThat(result.get(0).getProposedStartTime()).isEqualTo(testDateTime);

        verify(proposedTimeSlotRepository).findAll();
        verify(proposedTimeSlotMapper).toDtoList(proposedTimeSlots);
    }

    @Test
    void getAllProposedTimeSlots_EmptyList() {
        // given
        List<ProposedTimeSlot> emptyProposedTimeSlots = Arrays.asList();
        List<ProposedTimeSlotResponseDTO> emptyDtos = Arrays.asList();

        when(proposedTimeSlotRepository.findAll()).thenReturn(emptyProposedTimeSlots);
        when(proposedTimeSlotMapper.toDtoList(emptyProposedTimeSlots)).thenReturn(emptyDtos);

        // when
        List<ProposedTimeSlotResponseDTO> result = proposedTimeSlotService.getAllProposedTimeSlots();

        // then
        assertThat(result).isEmpty();
        verify(proposedTimeSlotRepository).findAll();
        verify(proposedTimeSlotMapper).toDtoList(emptyProposedTimeSlots);
    }

    // ==================== GET PROPOSED TIME SLOT BY ID TESTS ====================

    @Test
    void getProposedTimeSlotById_Success() {
        // given
        when(proposedTimeSlotRepository.findById(1L)).thenReturn(Optional.of(proposedTimeSlot));
        when(proposedTimeSlotMapper.toDto(proposedTimeSlot)).thenReturn(proposedTimeSlotResponseDTO);

        // when
        Optional<ProposedTimeSlotResponseDTO> result = proposedTimeSlotService.getProposedTimeSlotById(1L);

        // then
        assertThat(result).isPresent();
        assertThat(result.get().getProposedStartTime()).isEqualTo(testDateTime);

        verify(proposedTimeSlotRepository).findById(1L);
        verify(proposedTimeSlotMapper).toDto(proposedTimeSlot);
    }

    @Test
    void getProposedTimeSlotById_NotFound() {
        // given
        when(proposedTimeSlotRepository.findById(1L)).thenReturn(Optional.empty());

        // when
        Optional<ProposedTimeSlotResponseDTO> result = proposedTimeSlotService.getProposedTimeSlotById(1L);

        // then
        assertThat(result).isEmpty();
        verify(proposedTimeSlotRepository).findById(1L);
        verify(proposedTimeSlotMapper, never()).toDto(any());
    }

    // ==================== UPDATE PROPOSED TIME SLOT TESTS ====================

    @Test
    void updateProposedTimeSlot_WithNewScheduledLesson_Success() {
        // given
        ProposedTimeSlotCreateDTO updateDTO = new ProposedTimeSlotCreateDTO();
        updateDTO.setProposedStartTime(newTestDateTime);
        updateDTO.setScheduledLessonId(2L); // Change scheduled lesson

        when(proposedTimeSlotRepository.findById(1L)).thenReturn(Optional.of(proposedTimeSlot));
        when(scheduledLessonRepository.findById(2L)).thenReturn(Optional.of(newScheduledLesson));
        when(proposedTimeSlotRepository.save(proposedTimeSlot)).thenReturn(proposedTimeSlot);
        when(proposedTimeSlotMapper.toDto(proposedTimeSlot)).thenReturn(proposedTimeSlotResponseDTO);

        // when
        ProposedTimeSlotResponseDTO result = proposedTimeSlotService.updateProposedTimeSlot(1L, updateDTO);

        // then
        assertThat(result).isNotNull();

        verify(proposedTimeSlotRepository).findById(1L);
        verify(proposedTimeSlotMapper).updateProposedTimeSlotFromDto(updateDTO, proposedTimeSlot);
        verify(scheduledLessonRepository).findById(2L);
        verify(proposedTimeSlotRepository).save(proposedTimeSlot);
        verify(proposedTimeSlotMapper).toDto(proposedTimeSlot);
    }

    // ==================== DELETE PROPOSED TIME SLOT TESTS ====================

    @Test
    void deleteProposedTimeSlot_Success() {
        // given
        when(proposedTimeSlotRepository.existsById(1L)).thenReturn(true);

        // when
        proposedTimeSlotService.deleteProposedTimeSlot(1L);

        // then
        verify(proposedTimeSlotRepository).existsById(1L);
        verify(proposedTimeSlotRepository).deleteById(1L);
    }

    @Test
    void deleteProposedTimeSlot_NotFound_ThrowsException() {
        // given
        when(proposedTimeSlotRepository.existsById(1L)).thenReturn(false);

        // when & then
        assertThatThrownBy(() -> proposedTimeSlotService.deleteProposedTimeSlot(1L))
                .isInstanceOf(EntityNotFoundException.class)
                .hasMessage("ProposedTimeSlot not found with ID: 1");

        verify(proposedTimeSlotRepository).existsById(1L);
        verify(proposedTimeSlotRepository, never()).deleteById(any());
    }
}