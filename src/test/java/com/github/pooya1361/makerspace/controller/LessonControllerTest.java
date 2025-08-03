// src/test/java/com/github/pooya1361/makerspace/controller/LessonControllerTest.java
package com.github.pooya1361.makerspace.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.github.pooya1361.makerspace.dto.create.LessonCreateDTO;
import com.github.pooya1361.makerspace.dto.response.LessonResponseDTO;
import com.github.pooya1361.makerspace.mapper.LessonMapper;
import com.github.pooya1361.makerspace.security.JwtService;
import com.github.pooya1361.makerspace.service.LessonService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(LessonController.class)
class LessonControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private LessonService lessonService;

    @MockBean
    private LessonMapper lessonMapper;

    @MockBean
    private JwtService jwtService;

    @Autowired
    private ObjectMapper objectMapper;

    private LessonCreateDTO lessonCreateDTO;
    private LessonResponseDTO lessonResponseDTO;
    private List<LessonResponseDTO> lessonList;

    @BeforeEach
    void setUp() {
        lessonCreateDTO = new LessonCreateDTO();
        lessonCreateDTO.setName("Test Lesson");
        lessonCreateDTO.setDescription("Test Description");

        lessonResponseDTO = new LessonResponseDTO();
        lessonResponseDTO.setId(1L);
        lessonResponseDTO.setName("Test Lesson");
        lessonResponseDTO.setDescription("Test Description");

        LessonResponseDTO lesson2 = new LessonResponseDTO();
        lesson2.setId(2L);
        lesson2.setName("Second Lesson");

        lessonList = Arrays.asList(lessonResponseDTO, lesson2);
    }

    @Test
    @WithMockUser
    void getAllLessons_Success() throws Exception {
        when(lessonService.getAllLessons()).thenReturn(lessonList);

        mockMvc.perform(get("/api/lessons"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.length()").value(2))
                .andExpect(jsonPath("$[0].name").value("Test Lesson"));

        verify(lessonService).getAllLessons();
    }

    @Test
    @WithMockUser(authorities = "ADMIN")
    void createLesson_Success() throws Exception {
        when(lessonService.createLesson(any(LessonCreateDTO.class))).thenReturn(lessonResponseDTO);

        mockMvc.perform(post("/api/lessons")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(lessonCreateDTO)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.name").value("Test Lesson"));

        verify(lessonService).createLesson(any(LessonCreateDTO.class));
    }

    // Note: If these tests fail with reflection errors, add <parameters>true</parameters>
    // to your maven-compiler-plugin configuration in pom.xml

    @Test
    @WithMockUser
    void getLessonById_Success() throws Exception {
        when(lessonService.getLessonById(1L)).thenReturn(Optional.of(lessonResponseDTO));

        mockMvc.perform(get("/api/lessons/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.name").value("Test Lesson"));

        verify(lessonService).getLessonById(1L);
    }

    @Test
    @WithMockUser
    void getLessonById_NotFound() throws Exception {
        when(lessonService.getLessonById(999L)).thenReturn(Optional.empty());

        mockMvc.perform(get("/api/lessons/999"))
                .andExpect(status().isNotFound());

        verify(lessonService).getLessonById(999L);
    }

    @Test
    @WithMockUser(authorities = "ADMIN")
    void updateLesson_Success() throws Exception {
        when(lessonService.updateLesson(eq(1L), any(LessonCreateDTO.class))).thenReturn(lessonResponseDTO);

        mockMvc.perform(patch("/api/lessons/1")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(lessonCreateDTO)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1));

        verify(lessonService).updateLesson(eq(1L), any(LessonCreateDTO.class));
    }

    @Test
    @WithMockUser(authorities = "ADMIN")
    void deleteLesson_Success() throws Exception {
        doNothing().when(lessonService).deleteLesson(1L);

        mockMvc.perform(delete("/api/lessons/1")
                        .with(csrf()))
                .andExpect(status().isNoContent());

        verify(lessonService).deleteLesson(1L);
    }
}