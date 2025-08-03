// src/test/java/com/github/pooya1361/makerspace/controller/WorkshopControllerTest.java
package com.github.pooya1361.makerspace.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.github.pooya1361.makerspace.dto.create.WorkshopCreateDTO;
import com.github.pooya1361.makerspace.dto.response.WorkshopResponseDTO;
import com.github.pooya1361.makerspace.mapper.WorkshopMapper;
import com.github.pooya1361.makerspace.security.JwtService;
import com.github.pooya1361.makerspace.service.WorkshopService;
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

@WebMvcTest(WorkshopController.class)
class WorkshopControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private WorkshopService workshopService;

    @MockBean
    private WorkshopMapper workshopMapper;

    @MockBean
    private JwtService jwtService;

    @Autowired
    private ObjectMapper objectMapper;

    private WorkshopCreateDTO workshopCreateDTO;
    private WorkshopResponseDTO workshopResponseDTO;
    private List<WorkshopResponseDTO> workshopList;

    @BeforeEach
    void setUp() {
        workshopCreateDTO = new WorkshopCreateDTO();
        workshopCreateDTO.setName("Test Workshop");
        workshopCreateDTO.setDescription("Test Description");

        workshopResponseDTO = new WorkshopResponseDTO();
        workshopResponseDTO.setId(1L);
        workshopResponseDTO.setName("Test Workshop");
        workshopResponseDTO.setDescription("Test Description");

        WorkshopResponseDTO workshop2 = new WorkshopResponseDTO();
        workshop2.setId(2L);
        workshop2.setName("Second Workshop");

        workshopList = Arrays.asList(workshopResponseDTO, workshop2);
    }

    @Test
    @WithMockUser
    void getAllWorkshops_Success() throws Exception {
        when(workshopService.getAllWorkshops()).thenReturn(workshopList);

        mockMvc.perform(get("/api/workshops"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.length()").value(2))
                .andExpect(jsonPath("$[0].name").value("Test Workshop"));

        verify(workshopService).getAllWorkshops();
    }

    @Test
    @WithMockUser
    void getWorkshopById_Success() throws Exception {
        when(workshopService.getWorkshopById(1L)).thenReturn(Optional.of(workshopResponseDTO));

        mockMvc.perform(get("/api/workshops/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.name").value("Test Workshop"));

        verify(workshopService).getWorkshopById(1L);
    }

    @Test
    @WithMockUser
    void getWorkshopById_NotFound() throws Exception {
        when(workshopService.getWorkshopById(999L)).thenReturn(Optional.empty());

        mockMvc.perform(get("/api/workshops/999"))
                .andExpect(status().isNotFound());

        verify(workshopService).getWorkshopById(999L);
    }

    @Test
    @WithMockUser(authorities = "ADMIN")
    void createWorkshop_Success() throws Exception {
        when(workshopService.createWorkshop(any(WorkshopCreateDTO.class))).thenReturn(workshopResponseDTO);

        mockMvc.perform(post("/api/workshops")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(workshopCreateDTO)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.name").value("Test Workshop"));

        verify(workshopService).createWorkshop(any(WorkshopCreateDTO.class));
    }

    @Test
    @WithMockUser(authorities = "ADMIN")
    void updateWorkshop_Success() throws Exception {
        when(workshopService.updateWorkshop(eq(1L), any(WorkshopCreateDTO.class))).thenReturn(workshopResponseDTO);

        mockMvc.perform(patch("/api/workshops/1")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(workshopCreateDTO)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1));

        verify(workshopService).updateWorkshop(eq(1L), any(WorkshopCreateDTO.class));
    }

    @Test
    @WithMockUser(authorities = "ADMIN")
    void deleteWorkshop_Success() throws Exception {
        doNothing().when(workshopService).deleteWorkshop(1L);

        mockMvc.perform(delete("/api/workshops/1")
                        .with(csrf()))
                .andExpect(status().isNoContent());

        verify(workshopService).deleteWorkshop(1L);
    }
}