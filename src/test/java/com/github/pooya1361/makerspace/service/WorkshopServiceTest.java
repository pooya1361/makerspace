// src/test/java/com/github/pooya1361/makerspace/service/WorkshopServiceTest.java
package com.github.pooya1361.makerspace.service;

import com.github.pooya1361.makerspace.dto.create.WorkshopCreateDTO;
import com.github.pooya1361.makerspace.dto.response.WorkshopResponseDTO;
import com.github.pooya1361.makerspace.mapper.WorkshopMapper;
import com.github.pooya1361.makerspace.model.Activity;
import com.github.pooya1361.makerspace.model.Workshop;
import com.github.pooya1361.makerspace.repository.ActivityRepository;
import com.github.pooya1361.makerspace.repository.WorkshopRepository;
import jakarta.persistence.EntityNotFoundException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.*;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class WorkshopServiceTest {

    @Mock
    private WorkshopRepository workshopRepository;

    @Mock
    private WorkshopMapper workshopMapper;

    @Mock
    private ActivityRepository activityRepository;

    @InjectMocks
    private WorkshopService workshopService;

    private Workshop workshop;
    private Activity activity1;
    private Activity activity2;
    private Activity activity3;
    private WorkshopCreateDTO workshopCreateDTO;
    private WorkshopResponseDTO workshopResponseDTO;

    @BeforeEach
    void setUp() {
        // Setup Activities
        activity1 = new Activity();
        activity1.setId(1L);
        activity1.setName("Activity 1");
        activity1.setDescription("Description 1");

        activity2 = new Activity();
        activity2.setId(2L);
        activity2.setName("Activity 2");
        activity2.setDescription("Description 2");

        activity3 = new Activity();
        activity3.setId(3L);
        activity3.setName("Activity 3");
        activity3.setDescription("Description 3");

        // Setup Workshop
        workshop = new Workshop();
        workshop.setId(1L);
        workshop.setName("Test Workshop");
        workshop.setDescription("Test Workshop Description");
        workshop.setActivities(new ArrayList<>(Arrays.asList(activity1, activity2)));

        // Setup DTOs
        workshopCreateDTO = new WorkshopCreateDTO();
        workshopCreateDTO.setName("Test Workshop");
        workshopCreateDTO.setDescription("Test Workshop Description");
        workshopCreateDTO.setActivityIds(Arrays.asList(1L, 2L));

        workshopResponseDTO = new WorkshopResponseDTO();
        workshopResponseDTO.setId(1L);
        workshopResponseDTO.setName("Test Workshop");
        workshopResponseDTO.setDescription("Test Workshop Description");
    }

    // ==================== GET ALL WORKSHOPS TESTS ====================

    @Test
    void getAllWorkshops_Success() {
        // given
        List<Workshop> workshops = Arrays.asList(workshop);
        List<WorkshopResponseDTO> expectedDtos = Arrays.asList(workshopResponseDTO);

        when(workshopRepository.findAll()).thenReturn(workshops);
        when(workshopMapper.toDtoList(workshops)).thenReturn(expectedDtos);

        // when
        List<WorkshopResponseDTO> result = workshopService.getAllWorkshops();

        // then
        assertThat(result).hasSize(1);
        assertThat(result.get(0).getName()).isEqualTo("Test Workshop");

        verify(workshopRepository).findAll();
        verify(workshopMapper).toDtoList(workshops);
    }

    @Test
    void getAllWorkshops_EmptyList() {
        // given
        List<Workshop> emptyWorkshops = Arrays.asList();
        List<WorkshopResponseDTO> emptyDtos = Arrays.asList();

        when(workshopRepository.findAll()).thenReturn(emptyWorkshops);
        when(workshopMapper.toDtoList(emptyWorkshops)).thenReturn(emptyDtos);

        // when
        List<WorkshopResponseDTO> result = workshopService.getAllWorkshops();

        // then
        assertThat(result).isEmpty();
        verify(workshopRepository).findAll();
        verify(workshopMapper).toDtoList(emptyWorkshops);
    }

    // ==================== GET WORKSHOP BY ID TESTS ====================

    @Test
    void getWorkshopById_Success() {
        // given
        when(workshopRepository.findById(1L)).thenReturn(Optional.of(workshop));
        when(workshopMapper.toDto(workshop)).thenReturn(workshopResponseDTO);

        // when
        Optional<WorkshopResponseDTO> result = workshopService.getWorkshopById(1L);

        // then
        assertThat(result).isPresent();
        assertThat(result.get().getName()).isEqualTo("Test Workshop");

        verify(workshopRepository).findById(1L);
        verify(workshopMapper).toDto(workshop);
    }

    @Test
    void getWorkshopById_NotFound() {
        // given
        when(workshopRepository.findById(1L)).thenReturn(Optional.empty());

        // when
        Optional<WorkshopResponseDTO> result = workshopService.getWorkshopById(1L);

        // then
        assertThat(result).isEmpty();
        verify(workshopRepository).findById(1L);
        verify(workshopMapper, never()).toDto(any());
    }

    // ==================== CREATE WORKSHOP TESTS ====================

    @Test
    void createWorkshop_Success() {
        // given
        when(workshopMapper.toEntity(workshopCreateDTO)).thenReturn(workshop);
        when(workshopRepository.save(workshop)).thenReturn(workshop);
        when(workshopMapper.toDto(workshop)).thenReturn(workshopResponseDTO);

        // when
        WorkshopResponseDTO result = workshopService.createWorkshop(workshopCreateDTO);

        // then
        assertThat(result).isNotNull();
        assertThat(result.getName()).isEqualTo("Test Workshop");

        verify(workshopMapper).toEntity(workshopCreateDTO);
        verify(workshopRepository).save(workshop);
        verify(workshopMapper).toDto(workshop);
    }

    // ==================== UPDATE WORKSHOP TESTS ====================

    @Test
    void updateWorkshop_AddNewActivity_Success() {
        // given - workshop currently has activities 1,2 and we want to add activity 3
        WorkshopCreateDTO updateDTO = new WorkshopCreateDTO();
        updateDTO.setName("Updated Workshop");
        updateDTO.setActivityIds(Arrays.asList(1L, 2L, 3L)); // Add activity 3

        when(workshopRepository.findById(1L)).thenReturn(Optional.of(workshop));
        when(activityRepository.findById(1L)).thenReturn(Optional.of(activity1));
        when(activityRepository.findById(2L)).thenReturn(Optional.of(activity2));
        when(activityRepository.findById(3L)).thenReturn(Optional.of(activity3));
        when(workshopRepository.save(workshop)).thenReturn(workshop);
        when(workshopMapper.toDto(workshop)).thenReturn(workshopResponseDTO);

        // when
        WorkshopResponseDTO result = workshopService.updateWorkshop(1L, updateDTO);

        // then
        assertThat(result).isNotNull();

        verify(workshopRepository).findById(1L);
        verify(workshopMapper).updateWorkshopFromDto(updateDTO, workshop);
        verify(activityRepository).findById(1L);
        verify(activityRepository).findById(2L);
        verify(activityRepository).findById(3L);

        // Verify that activity3 gets associated with the workshop
        ArgumentCaptor<List<Activity>> activitiesCaptor = ArgumentCaptor.forClass(List.class);
        verify(activityRepository).saveAll(activitiesCaptor.capture());

        List<Activity> savedActivities = activitiesCaptor.getValue();
        assertThat(savedActivities).hasSize(1); // Only activity3 should be saved (the new one)
        assertThat(savedActivities.get(0)).isEqualTo(activity3);

        verify(workshopRepository).save(workshop);
        verify(workshopMapper).toDto(workshop);
    }

    @Test
    void updateWorkshop_RemoveActivity_Success() {
        // given - workshop currently has activities 1,2 and we want to remove activity 2
        WorkshopCreateDTO updateDTO = new WorkshopCreateDTO();
        updateDTO.setName("Updated Workshop");
        updateDTO.setActivityIds(Arrays.asList(1L)); // Remove activity 2

        when(workshopRepository.findById(1L)).thenReturn(Optional.of(workshop));
        when(activityRepository.findById(1L)).thenReturn(Optional.of(activity1));
        when(workshopRepository.save(workshop)).thenReturn(workshop);
        when(workshopMapper.toDto(workshop)).thenReturn(workshopResponseDTO);

        // when
        WorkshopResponseDTO result = workshopService.updateWorkshop(1L, updateDTO);

        // then
        assertThat(result).isNotNull();

        verify(workshopRepository).findById(1L);
        verify(workshopMapper).updateWorkshopFromDto(updateDTO, workshop);
        verify(activityRepository).findById(1L);

        // Verify that activity2 gets disassociated (saved with workshop = null)
        ArgumentCaptor<List<Activity>> activitiesCaptor = ArgumentCaptor.forClass(List.class);
        verify(activityRepository).saveAll(activitiesCaptor.capture());

        List<Activity> savedActivities = activitiesCaptor.getValue();
        assertThat(savedActivities).hasSize(1); // Only activity2 should be saved (the removed one)
        assertThat(savedActivities.get(0)).isEqualTo(activity2);

        verify(workshopRepository).save(workshop);
        verify(workshopMapper).toDto(workshop);
    }

    @Test
    void updateWorkshop_ReplaceAllActivities_Success() {
        // given - workshop currently has activities 1,2 and we want to replace with 3
        WorkshopCreateDTO updateDTO = new WorkshopCreateDTO();
        updateDTO.setName("Updated Workshop");
        updateDTO.setActivityIds(Arrays.asList(3L)); // Replace all with activity 3

        when(workshopRepository.findById(1L)).thenReturn(Optional.of(workshop));
        when(activityRepository.findById(3L)).thenReturn(Optional.of(activity3));
        when(workshopRepository.save(workshop)).thenReturn(workshop);
        when(workshopMapper.toDto(workshop)).thenReturn(workshopResponseDTO);

        // when
        WorkshopResponseDTO result = workshopService.updateWorkshop(1L, updateDTO);

        // then
        assertThat(result).isNotNull();

        verify(workshopRepository).findById(1L);
        verify(workshopMapper).updateWorkshopFromDto(updateDTO, workshop);
        verify(activityRepository).findById(3L);

        // Verify that all 3 activities get saved (2 disassociated + 1 associated)
        ArgumentCaptor<List<Activity>> activitiesCaptor = ArgumentCaptor.forClass(List.class);
        verify(activityRepository).saveAll(activitiesCaptor.capture());

        List<Activity> savedActivities = activitiesCaptor.getValue();
        assertThat(savedActivities).hasSize(3); // activity1, activity2 (disassociated) + activity3 (associated)

        verify(workshopRepository).save(workshop);
        verify(workshopMapper).toDto(workshop);
    }

    @Test
    void updateWorkshop_EmptyActivityList_Success() {
        // given - workshop currently has activities 1,2 and we want to remove all
        WorkshopCreateDTO updateDTO = new WorkshopCreateDTO();
        updateDTO.setName("Updated Workshop");
        updateDTO.setActivityIds(Collections.emptyList()); // Remove all activities

        when(workshopRepository.findById(1L)).thenReturn(Optional.of(workshop));
        when(workshopRepository.save(workshop)).thenReturn(workshop);
        when(workshopMapper.toDto(workshop)).thenReturn(workshopResponseDTO);

        // when
        WorkshopResponseDTO result = workshopService.updateWorkshop(1L, updateDTO);

        // then
        assertThat(result).isNotNull();

        verify(workshopRepository).findById(1L);
        verify(workshopMapper).updateWorkshopFromDto(updateDTO, workshop);

        // Verify that both activities get disassociated
        ArgumentCaptor<List<Activity>> activitiesCaptor = ArgumentCaptor.forClass(List.class);
        verify(activityRepository).saveAll(activitiesCaptor.capture());

        List<Activity> savedActivities = activitiesCaptor.getValue();
        assertThat(savedActivities).hasSize(2); // Both activity1 and activity2 should be disassociated
        assertThat(savedActivities).containsExactlyInAnyOrder(activity1, activity2);

        verify(workshopRepository).save(workshop);
        verify(workshopMapper).toDto(workshop);
    }

    @Test
    void updateWorkshop_NullActivityList_Success() {
        // given - workshop currently has activities 1,2 and activityIds is null
        WorkshopCreateDTO updateDTO = new WorkshopCreateDTO();
        updateDTO.setName("Updated Workshop");
        updateDTO.setActivityIds(null); // Null activity list (should be treated as empty)

        when(workshopRepository.findById(1L)).thenReturn(Optional.of(workshop));
        when(workshopRepository.save(workshop)).thenReturn(workshop);
        when(workshopMapper.toDto(workshop)).thenReturn(workshopResponseDTO);

        // when
        WorkshopResponseDTO result = workshopService.updateWorkshop(1L, updateDTO);

        // then
        assertThat(result).isNotNull();

        verify(workshopRepository).findById(1L);
        verify(workshopMapper).updateWorkshopFromDto(updateDTO, workshop);

        // Verify that both activities get disassociated (null treated as empty list)
        ArgumentCaptor<List<Activity>> activitiesCaptor = ArgumentCaptor.forClass(List.class);
        verify(activityRepository).saveAll(activitiesCaptor.capture());

        List<Activity> savedActivities = activitiesCaptor.getValue();
        assertThat(savedActivities).hasSize(2); // Both activities should be disassociated

        verify(workshopRepository).save(workshop);
        verify(workshopMapper).toDto(workshop);
    }

    @Test
    void updateWorkshop_NoChangesToActivities_Success() {
        // given - workshop currently has activities 1,2 and we keep the same
        WorkshopCreateDTO updateDTO = new WorkshopCreateDTO();
        updateDTO.setName("Updated Workshop");
        updateDTO.setActivityIds(Arrays.asList(1L, 2L)); // Same activities as before

        when(workshopRepository.findById(1L)).thenReturn(Optional.of(workshop));
        when(activityRepository.findById(1L)).thenReturn(Optional.of(activity1));
        when(activityRepository.findById(2L)).thenReturn(Optional.of(activity2));
        when(workshopRepository.save(workshop)).thenReturn(workshop);
        when(workshopMapper.toDto(workshop)).thenReturn(workshopResponseDTO);

        // when
        WorkshopResponseDTO result = workshopService.updateWorkshop(1L, updateDTO);

        // then
        assertThat(result).isNotNull();

        verify(workshopRepository).findById(1L);
        verify(workshopMapper).updateWorkshopFromDto(updateDTO, workshop);
        verify(activityRepository).findById(1L);
        verify(activityRepository).findById(2L);

        // No activities should be saved since there are no changes
        verify(activityRepository, never()).saveAll(any());

        verify(workshopRepository).save(workshop);
        verify(workshopMapper).toDto(workshop);
    }

    @Test
    void updateWorkshop_WorkshopNotFound_ThrowsException() {
        // given
        WorkshopCreateDTO updateDTO = new WorkshopCreateDTO();
        when(workshopRepository.findById(1L)).thenReturn(Optional.empty());

        // when & then
        assertThatThrownBy(() -> workshopService.updateWorkshop(1L, updateDTO))
                .isInstanceOf(EntityNotFoundException.class)
                .hasMessage("Workshop not found with ID: 1");

        verify(workshopRepository, never()).save(any());
        verify(activityRepository, never()).saveAll(any());
    }

    @Test
    void updateWorkshop_ActivityNotFound_ThrowsException() {
        // given
        WorkshopCreateDTO updateDTO = new WorkshopCreateDTO();
        updateDTO.setActivityIds(Arrays.asList(999L)); // Non-existent activity

        when(workshopRepository.findById(1L)).thenReturn(Optional.of(workshop));
        when(activityRepository.findById(999L)).thenReturn(Optional.empty());

        // when & then
        assertThatThrownBy(() -> workshopService.updateWorkshop(1L, updateDTO))
                .isInstanceOf(EntityNotFoundException.class)
                .hasMessage("Activity not found with ID: 999");

        verify(workshopRepository, never()).save(any());
        verify(activityRepository, never()).saveAll(any());
    }

    // ==================== DELETE WORKSHOP TESTS ====================

    @Test
    void deleteWorkshop_Success() {
        // given
        when(workshopRepository.existsById(1L)).thenReturn(true);

        // when
        workshopService.deleteWorkshop(1L);

        // then
        verify(workshopRepository).existsById(1L);
        verify(workshopRepository).deleteById(1L);
    }

    @Test
    void deleteWorkshop_NotFound_ThrowsException() {
        // given
        when(workshopRepository.existsById(1L)).thenReturn(false);

        // when & then
        assertThatThrownBy(() -> workshopService.deleteWorkshop(1L))
                .isInstanceOf(EntityNotFoundException.class)
                .hasMessage("Workshop not found with ID: 1");

        verify(workshopRepository).existsById(1L);
        verify(workshopRepository, never()).deleteById(any());
    }
}