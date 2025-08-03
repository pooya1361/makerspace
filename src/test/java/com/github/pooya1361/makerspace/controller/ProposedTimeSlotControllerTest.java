// src/test/java/com/github/pooya1361/makerspace/controller/ProposedTimeSlotControllerTest.java
package com.github.pooya1361.makerspace.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.github.pooya1361.makerspace.dto.create.ProposedTimeSlotCreateDTO;
import com.github.pooya1361.makerspace.dto.response.ProposedTimeSlotResponseDTO;
import com.github.pooya1361.makerspace.mapper.ProposedTimeSlotMapper;
import com.github.pooya1361.makerspace.security.JwtService;
import com.github.pooya1361.makerspace.service.ProposedTimeSlotService;
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

@WebMvcTest(ProposedTimeSlotController.class)
class ProposedTimeSlotControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private ProposedTimeSlotService proposedTimeSlotService;

    @MockBean
    private ProposedTimeSlotMapper proposedTimeSlotMapper;

    @MockBean
    private JwtService jwtService;

    @Autowired
    private ObjectMapper objectMapper;

    private ProposedTimeSlotCreateDTO proposedTimeSlotCreateDTO;
    private ProposedTimeSlotResponseDTO proposedTimeSlotResponseDTO;
    private List<ProposedTimeSlotResponseDTO> proposedTimeSlotList;

    @BeforeEach
    void setUp() {
        proposedTimeSlotCreateDTO = new ProposedTimeSlotCreateDTO();
        proposedTimeSlotCreateDTO.setProposedStartTime(OffsetDateTime.now().plusDays(1));

        proposedTimeSlotResponseDTO = new ProposedTimeSlotResponseDTO();
        proposedTimeSlotResponseDTO.setId(1L);
        proposedTimeSlotResponseDTO.setProposedStartTime(OffsetDateTime.now().plusDays(1));

        ProposedTimeSlotResponseDTO proposedTimeSlot2 = new ProposedTimeSlotResponseDTO();
        proposedTimeSlot2.setId(2L);
        proposedTimeSlot2.setProposedStartTime(OffsetDateTime.now().plusDays(2));

        proposedTimeSlotList = Arrays.asList(proposedTimeSlotResponseDTO, proposedTimeSlot2);
    }

    @Test
    @WithMockUser
    void getAllProposedTimeSlots_Success() throws Exception {
        when(proposedTimeSlotService.getAllProposedTimeSlots()).thenReturn(proposedTimeSlotList);

        mockMvc.perform(get("/api/proposed-time-slots"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.length()").value(2))
                .andExpect(jsonPath("$[0].id").value(1));

        verify(proposedTimeSlotService).getAllProposedTimeSlots();
    }

    @Test
    @WithMockUser
    void getProposedTimeSlotById_Success() throws Exception {
        when(proposedTimeSlotService.getProposedTimeSlotById(1L)).thenReturn(Optional.of(proposedTimeSlotResponseDTO));

        mockMvc.perform(get("/api/proposed-time-slots/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1));

        verify(proposedTimeSlotService).getProposedTimeSlotById(1L);
    }

    @Test
    @WithMockUser
    void getProposedTimeSlotById_NotFound() throws Exception {
        when(proposedTimeSlotService.getProposedTimeSlotById(999L)).thenReturn(Optional.empty());

        mockMvc.perform(get("/api/proposed-time-slots/999"))
                .andExpect(status().isNotFound());

        verify(proposedTimeSlotService).getProposedTimeSlotById(999L);
    }

    @Test
    @WithMockUser(authorities = "ADMIN")
    void createProposedTimeSlot_Success() throws Exception {
        when(proposedTimeSlotService.createProposedTimeSlot(any(ProposedTimeSlotCreateDTO.class))).thenReturn(proposedTimeSlotResponseDTO);

        mockMvc.perform(post("/api/proposed-time-slots")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(proposedTimeSlotCreateDTO)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(1));

        verify(proposedTimeSlotService).createProposedTimeSlot(any(ProposedTimeSlotCreateDTO.class));
    }

    @Test
    @WithMockUser(authorities = "ADMIN")
    void updateProposedTimeSlot_Success() throws Exception {
        when(proposedTimeSlotService.updateProposedTimeSlot(eq(1L), any(ProposedTimeSlotCreateDTO.class))).thenReturn(proposedTimeSlotResponseDTO);

        mockMvc.perform(patch("/api/proposed-time-slots/1")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(proposedTimeSlotCreateDTO)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1));

        verify(proposedTimeSlotService).updateProposedTimeSlot(eq(1L), any(ProposedTimeSlotCreateDTO.class));
    }

    @Test
    @WithMockUser(authorities = "ADMIN")
    void deleteProposedTimeSlot_Success() throws Exception {
        doNothing().when(proposedTimeSlotService).deleteProposedTimeSlot(1L);

        mockMvc.perform(delete("/api/proposed-time-slots/1")
                        .with(csrf()))
                .andExpect(status().isNoContent());

        verify(proposedTimeSlotService).deleteProposedTimeSlot(1L);
    }
}