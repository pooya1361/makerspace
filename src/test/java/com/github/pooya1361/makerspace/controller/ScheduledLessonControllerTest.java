// src/test/java/com/github/pooya1361/makerspace/controller/ScheduledLessonControllerTest.java
package com.github.pooya1361.makerspace.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.github.pooya1361.makerspace.dto.create.ScheduledLessonCreateDTO;
import com.github.pooya1361.makerspace.dto.response.ScheduledLessonResponseDTO;
import com.github.pooya1361.makerspace.mapper.ScheduledLessonMapper;
import com.github.pooya1361.makerspace.security.JwtService;
import com.github.pooya1361.makerspace.service.ScheduledLessonService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.time.OffsetDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(ScheduledLessonController.class)
class ScheduledLessonControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private ScheduledLessonService scheduledLessonService;

    @MockBean
    private ScheduledLessonMapper scheduledLessonMapper;

    @MockBean
    private JwtService jwtService;

    @Autowired
    private ObjectMapper objectMapper;

    private ScheduledLessonCreateDTO scheduledLessonCreateDTO;
    private ScheduledLessonResponseDTO scheduledLessonResponseDTO;
    private List<ScheduledLessonResponseDTO> scheduledLessonList;

    @BeforeEach
    void setUp() {
        scheduledLessonCreateDTO = new ScheduledLessonCreateDTO();
        scheduledLessonCreateDTO.setStartTime(Optional.of(OffsetDateTime.now().plusDays(1)));
        scheduledLessonCreateDTO.setDurationInMinutes(120L);

        scheduledLessonResponseDTO = new ScheduledLessonResponseDTO();
        scheduledLessonResponseDTO.setId(1L);
        scheduledLessonResponseDTO.setStartTime(Optional.of(OffsetDateTime.now().plusDays(1)));
        scheduledLessonResponseDTO.setDurationInMinutes(120L);

        ScheduledLessonResponseDTO scheduledLesson2 = new ScheduledLessonResponseDTO();
        scheduledLesson2.setId(2L);
        scheduledLesson2.setStartTime(Optional.empty()); // Optional startTime can be empty
        scheduledLesson2.setDurationInMinutes(90L);

        scheduledLessonList = Arrays.asList(scheduledLessonResponseDTO, scheduledLesson2);
    }

    @Test
    @WithMockUser
    void getAllScheduledLessons_Success() throws Exception {
        when(scheduledLessonService.getAllScheduledLessons()).thenReturn(scheduledLessonList);

        mockMvc.perform(get("/api/scheduled-lessons"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.length()").value(2))
                .andExpect(jsonPath("$[0].id").value(1));

        verify(scheduledLessonService).getAllScheduledLessons();
    }

    @Test
    @WithMockUser
    void getScheduledLessonById_Success() throws Exception {
        when(scheduledLessonService.getScheduledLessonById(1L)).thenReturn(Optional.of(scheduledLessonResponseDTO));

        mockMvc.perform(get("/api/scheduled-lessons/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1));

        verify(scheduledLessonService).getScheduledLessonById(1L);
    }

    @Test
    @WithMockUser
    void getScheduledLessonById_NotFound() throws Exception {
        when(scheduledLessonService.getScheduledLessonById(999L)).thenReturn(Optional.empty());

        mockMvc.perform(get("/api/scheduled-lessons/999"))
                .andExpect(status().isNotFound());

        verify(scheduledLessonService).getScheduledLessonById(999L);
    }

    @Test
    @WithMockUser(authorities = "ADMIN")
    void createScheduledLesson_Success() throws Exception {
        when(scheduledLessonService.createScheduledLesson(any(ScheduledLessonCreateDTO.class))).thenReturn(scheduledLessonResponseDTO);

        mockMvc.perform(post("/api/scheduled-lessons")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(scheduledLessonCreateDTO)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(1));

        verify(scheduledLessonService).createScheduledLesson(any(ScheduledLessonCreateDTO.class));
    }

    @Test
    @WithMockUser(authorities = "ADMIN")
    void createScheduledLesson_WithoutStartTime_Success() throws Exception {
        // Test with empty startTime since it's optional
        ScheduledLessonCreateDTO dtoWithoutStartTime = new ScheduledLessonCreateDTO();
        dtoWithoutStartTime.setStartTime(Optional.empty());
        dtoWithoutStartTime.setDurationInMinutes(90L);

        ScheduledLessonResponseDTO responseWithoutStartTime = new ScheduledLessonResponseDTO();
        responseWithoutStartTime.setId(2L);
        responseWithoutStartTime.setStartTime(Optional.empty());
        responseWithoutStartTime.setDurationInMinutes(90L);

        when(scheduledLessonService.createScheduledLesson(any(ScheduledLessonCreateDTO.class))).thenReturn(responseWithoutStartTime);

        mockMvc.perform(post("/api/scheduled-lessons")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dtoWithoutStartTime)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(2));

        verify(scheduledLessonService).createScheduledLesson(any(ScheduledLessonCreateDTO.class));
    }

    @Test
    @WithMockUser(authorities = "ADMIN")
    void updateScheduledLesson_Success() throws Exception {
        when(scheduledLessonService.updateScheduledLesson(eq(1L), any(ScheduledLessonCreateDTO.class))).thenReturn(scheduledLessonResponseDTO);

        mockMvc.perform(patch("/api/scheduled-lessons/1")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(scheduledLessonCreateDTO)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1));

        verify(scheduledLessonService).updateScheduledLesson(eq(1L), any(ScheduledLessonCreateDTO.class));
    }

    @Test
    @WithMockUser(authorities = "ADMIN")
    void deleteScheduledLesson_Success() throws Exception {
        doNothing().when(scheduledLessonService).deleteScheduledLesson(1L);

        mockMvc.perform(delete("/api/scheduled-lessons/1")
                        .with(csrf()))
                .andExpect(status().isNoContent());

        verify(scheduledLessonService).deleteScheduledLesson(1L);
    }
}