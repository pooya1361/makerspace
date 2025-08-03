// src/test/java/com/github/pooya1361/makerspace/service/ActivityServiceTest.java
package com.github.pooya1361.makerspace.service;

import com.github.pooya1361.makerspace.dto.create.ActivityCreateDTO;
import com.github.pooya1361.makerspace.dto.response.ActivityResponseDTO;
import com.github.pooya1361.makerspace.mapper.ActivityMapper;
import com.github.pooya1361.makerspace.model.Activity;
import com.github.pooya1361.makerspace.repository.ActivityRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;
import java.util.Arrays;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ActivityServiceTest {

    @Mock
    private ActivityRepository activityRepository;

    @Mock
    private ActivityMapper activityMapper;

    @InjectMocks
    private ActivityService activityService;

    private Activity activity;
    private ActivityCreateDTO activityCreateDTO;
    private ActivityResponseDTO activityResponseDTO;

    @BeforeEach
    void setUp() {
        activity = new Activity();
        activity.setId(1L);
        activity.setName("Test Activity");
        activity.setDescription("Test Description");

        activityCreateDTO = new ActivityCreateDTO();
        activityCreateDTO.setName("Test Activity");
        activityCreateDTO.setDescription("Test Description");

        activityResponseDTO = new ActivityResponseDTO();
        activityResponseDTO.setId(1L);
        activityResponseDTO.setName("Test Activity");
        activityResponseDTO.setDescription("Test Description");
    }

    @Test
    void getActivityById_Success() {
        // given
        when(activityRepository.findById(1L)).thenReturn(Optional.of(activity));
        when(activityMapper.toDto(activity)).thenReturn(activityResponseDTO);

        // when
        Optional<ActivityResponseDTO> result = activityService.getActivityById(1L);

        // then
        assertThat(result).isPresent();
        assertThat(result.get().getId()).isEqualTo(1L);
        assertThat(result.get().getName()).isEqualTo("Test Activity");

        verify(activityRepository).findById(1L);
        verify(activityMapper).toDto(activity);
    }

    @Test
    void getActivityById_NotFound() {
        // given
        when(activityRepository.findById(1L)).thenReturn(Optional.empty());

        // when
        Optional<ActivityResponseDTO> result = activityService.getActivityById(1L);

        // then
        assertThat(result).isEmpty();
        verify(activityRepository).findById(1L);
        verify(activityMapper, never()).toDto(any());
    }

    @Test
    void getAllActivities_Success() {
        // given
        List<Activity> activities = Arrays.asList(activity);
        List<ActivityResponseDTO> expectedDtos = Arrays.asList(activityResponseDTO);

        when(activityRepository.findAll()).thenReturn(activities);
        when(activityMapper.toDtoList(activities)).thenReturn(expectedDtos);

        // when
        List<ActivityResponseDTO> result = activityService.getAllActivities();

        // then
        assertThat(result).hasSize(1);
        assertThat(result.get(0).getName()).isEqualTo("Test Activity");
        verify(activityRepository).findAll();
        verify(activityMapper).toDtoList(activities);
    }

    @Test
    void getAllActivities_EmptyList() {
        // given
        List<Activity> emptyActivities = Arrays.asList();
        List<ActivityResponseDTO> emptyDtos = Arrays.asList();

        when(activityRepository.findAll()).thenReturn(emptyActivities);
        when(activityMapper.toDtoList(emptyActivities)).thenReturn(emptyDtos);

        // when
        List<ActivityResponseDTO> result = activityService.getAllActivities();

        // then
        assertThat(result).isEmpty();
        verify(activityRepository).findAll();
        verify(activityMapper).toDtoList(emptyActivities);
    }
}