// src/test/java/com/github/pooya1361/makerspace/service/ProposedTimeSlotServiceTest.java
package com.github.pooya1361.makerspace.service;

import com.github.pooya1361.makerspace.dto.create.ProposedTimeSlotCreateDTO;
import com.github.pooya1361.makerspace.dto.response.ProposedTimeSlotResponseDTO;
import com.github.pooya1361.makerspace.mapper.ProposedTimeSlotMapper;
import com.github.pooya1361.makerspace.model.ProposedTimeSlot;
import com.github.pooya1361.makerspace.model.ScheduledLesson;
import com.github.pooya1361.makerspace.repository.ProposedTimeSlotRepository;
import com.github.pooya1361.makerspace.repository.ScheduledLessonRepository;
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
class ProposedTimeSlotServiceTest {

    @Mock
    private ProposedTimeSlotRepository proposedTimeSlotRepository;

    @Mock
    private ProposedTimeSlotMapper proposedTimeSlotMapper;

    @Mock
    private ScheduledLessonRepository scheduledLessonRepository;

    @InjectMocks
    private ProposedTimeSlotService proposedTimeSlotService;

    private ProposedTimeSlot proposedTimeSlot;
    private ScheduledLesson scheduledLesson;
    private ScheduledLesson newScheduledLesson;
    private ProposedTimeSlotCreateDTO proposedTimeSlotCreateDTO;
    private ProposedTimeSlotResponseDTO proposedTimeSlotResponseDTO;
    private OffsetDateTime testDateTime;
    private OffsetDateTime newTestDateTime;

    @BeforeEach
    void setUp() {
        // Setup test times
        testDateTime = OffsetDateTime.of(2025, 8, 15, 14, 30, 0, 0, ZoneOffset.UTC);
        newTestDateTime = OffsetDateTime.of(2025, 8, 16, 16, 0, 0, 0, ZoneOffset.UTC);

        // Setup ScheduledLesson
        scheduledLesson = new ScheduledLesson();
        scheduledLesson.setId(1L);
        scheduledLesson.setDurationInMinutes(90L);

        // Setup New ScheduledLesson for update tests
        newScheduledLesson = new ScheduledLesson();
        newScheduledLesson.setId(2L);
        newScheduledLesson.setDurationInMinutes(120L);

        // Setup ProposedTimeSlot
        proposedTimeSlot = new ProposedTimeSlot();
        proposedTimeSlot.setId(1L);
        proposedTimeSlot.setProposedStartTime(testDateTime);
        proposedTimeSlot.setScheduledLesson(scheduledLesson);

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
    void createProposedTimeSlot_Success() {
        // given
        when(scheduledLessonRepository.findById(1L)).thenReturn(Optional.of(scheduledLesson));
        when(proposedTimeSlotMapper.toEntity(proposedTimeSlotCreateDTO)).thenReturn(proposedTimeSlot);
        when(proposedTimeSlotRepository.save(proposedTimeSlot)).thenReturn(proposedTimeSlot);
        when(proposedTimeSlotMapper.toDto(proposedTimeSlot)).thenReturn(proposedTimeSlotResponseDTO);

        // when
        ProposedTimeSlotResponseDTO result = proposedTimeSlotService.createProposedTimeSlot(proposedTimeSlotCreateDTO);

        // then
        assertThat(result).isNotNull();
        assertThat(result.getProposedStartTime()).isEqualTo(testDateTime);

        verify(scheduledLessonRepository).findById(1L);
        verify(proposedTimeSlotMapper).toEntity(proposedTimeSlotCreateDTO);
        verify(proposedTimeSlotRepository).save(proposedTimeSlot);
        verify(proposedTimeSlotMapper).toDto(proposedTimeSlot);
    }

    @Test
    void createProposedTimeSlot_ScheduledLessonNotFound_ThrowsException() {
        // given
        when(scheduledLessonRepository.findById(1L)).thenReturn(Optional.empty());

        // when & then
        assertThatThrownBy(() -> proposedTimeSlotService.createProposedTimeSlot(proposedTimeSlotCreateDTO))
                .isInstanceOf(EntityNotFoundException.class)
                .hasMessage("ScheduledLesson not found with ID: 1");

        verify(scheduledLessonRepository).findById(1L);
        verify(proposedTimeSlotRepository, never()).save(any());
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

    @Test
    void updateProposedTimeSlot_WithoutChangingScheduledLesson_Success() {
        // given
        ProposedTimeSlotCreateDTO updateDTO = new ProposedTimeSlotCreateDTO();
        updateDTO.setProposedStartTime(newTestDateTime);
        updateDTO.setScheduledLessonId(null); // Don't change scheduled lesson

        when(proposedTimeSlotRepository.findById(1L)).thenReturn(Optional.of(proposedTimeSlot));
        when(proposedTimeSlotRepository.save(proposedTimeSlot)).thenReturn(proposedTimeSlot);
        when(proposedTimeSlotMapper.toDto(proposedTimeSlot)).thenReturn(proposedTimeSlotResponseDTO);

        // when
        ProposedTimeSlotResponseDTO result = proposedTimeSlotService.updateProposedTimeSlot(1L, updateDTO);

        // then
        assertThat(result).isNotNull();

        verify(proposedTimeSlotRepository).findById(1L);
        verify(proposedTimeSlotMapper).updateProposedTimeSlotFromDto(updateDTO, proposedTimeSlot);
        verify(scheduledLessonRepository, never()).findById(any()); // Should not look for scheduled lesson
        verify(proposedTimeSlotRepository).save(proposedTimeSlot);
        verify(proposedTimeSlotMapper).toDto(proposedTimeSlot);
    }

    @Test
    void updateProposedTimeSlot_ProposedTimeSlotNotFound_ThrowsException() {
        // given
        ProposedTimeSlotCreateDTO updateDTO = new ProposedTimeSlotCreateDTO();
        when(proposedTimeSlotRepository.findById(1L)).thenReturn(Optional.empty());

        // when & then
        assertThatThrownBy(() -> proposedTimeSlotService.updateProposedTimeSlot(1L, updateDTO))
                .isInstanceOf(EntityNotFoundException.class)
                .hasMessage("ProposedTimeSlot not found with ID: 1");

        verify(proposedTimeSlotRepository, never()).save(any());
    }

    @Test
    void updateProposedTimeSlot_ScheduledLessonNotFound_ThrowsException() {
        // given
        ProposedTimeSlotCreateDTO updateDTO = new ProposedTimeSlotCreateDTO();
        updateDTO.setScheduledLessonId(999L); // Non-existent scheduled lesson

        when(proposedTimeSlotRepository.findById(1L)).thenReturn(Optional.of(proposedTimeSlot));
        when(scheduledLessonRepository.findById(999L)).thenReturn(Optional.empty());

        // when & then
        assertThatThrownBy(() -> proposedTimeSlotService.updateProposedTimeSlot(1L, updateDTO))
                .isInstanceOf(EntityNotFoundException.class)
                .hasMessage("ScheduledLesson not found with ID: 999");

        verify(proposedTimeSlotRepository, never()).save(any());
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

    // ==================== EDGE CASE TESTS ====================

    @Test
    void updateProposedTimeSlot_KeepSameScheduledLesson_Success() {
        // given - update with the same scheduled lesson ID
        ProposedTimeSlotCreateDTO updateDTO = new ProposedTimeSlotCreateDTO();
        updateDTO.setProposedStartTime(newTestDateTime);
        updateDTO.setScheduledLessonId(1L); // Same as current scheduled lesson

        when(proposedTimeSlotRepository.findById(1L)).thenReturn(Optional.of(proposedTimeSlot));
        when(scheduledLessonRepository.findById(1L)).thenReturn(Optional.of(scheduledLesson));
        when(proposedTimeSlotRepository.save(proposedTimeSlot)).thenReturn(proposedTimeSlot);
        when(proposedTimeSlotMapper.toDto(proposedTimeSlot)).thenReturn(proposedTimeSlotResponseDTO);

        // when
        ProposedTimeSlotResponseDTO result = proposedTimeSlotService.updateProposedTimeSlot(1L, updateDTO);

        // then
        assertThat(result).isNotNull();

        verify(proposedTimeSlotRepository).findById(1L);
        verify(proposedTimeSlotMapper).updateProposedTimeSlotFromDto(updateDTO, proposedTimeSlot);
        verify(scheduledLessonRepository).findById(1L); // Should still validate the scheduled lesson exists
        verify(proposedTimeSlotRepository).save(proposedTimeSlot);
        verify(proposedTimeSlotMapper).toDto(proposedTimeSlot);
    }

    @Test
    void createProposedTimeSlot_WithDifferentTimeZone_Success() {
        // given - test with different timezone
        OffsetDateTime easternTime = OffsetDateTime.of(2025, 8, 15, 10, 30, 0, 0, ZoneOffset.ofHours(-5));

        ProposedTimeSlotCreateDTO createDTO = new ProposedTimeSlotCreateDTO();
        createDTO.setProposedStartTime(easternTime);
        createDTO.setScheduledLessonId(1L);

        ProposedTimeSlot timeSlotWithEasternTime = new ProposedTimeSlot();
        timeSlotWithEasternTime.setId(1L);
        timeSlotWithEasternTime.setProposedStartTime(easternTime);
        timeSlotWithEasternTime.setScheduledLesson(scheduledLesson);

        ProposedTimeSlotResponseDTO responseWithEasternTime = new ProposedTimeSlotResponseDTO();
        responseWithEasternTime.setId(1L);
        responseWithEasternTime.setProposedStartTime(easternTime);

        when(scheduledLessonRepository.findById(1L)).thenReturn(Optional.of(scheduledLesson));
        when(proposedTimeSlotMapper.toEntity(createDTO)).thenReturn(timeSlotWithEasternTime);
        when(proposedTimeSlotRepository.save(timeSlotWithEasternTime)).thenReturn(timeSlotWithEasternTime);
        when(proposedTimeSlotMapper.toDto(timeSlotWithEasternTime)).thenReturn(responseWithEasternTime);

        // when
        ProposedTimeSlotResponseDTO result = proposedTimeSlotService.createProposedTimeSlot(createDTO);

        // then
        assertThat(result).isNotNull();
        assertThat(result.getProposedStartTime()).isEqualTo(easternTime);
        assertThat(result.getProposedStartTime().getOffset()).isEqualTo(ZoneOffset.ofHours(-5));

        verify(scheduledLessonRepository).findById(1L);
        verify(proposedTimeSlotMapper).toEntity(createDTO);
        verify(proposedTimeSlotRepository).save(timeSlotWithEasternTime);
        verify(proposedTimeSlotMapper).toDto(timeSlotWithEasternTime);
    }
}