// src/test/java/com/github/pooya1361/makerspace/controller/VoteControllerTest.java
package com.github.pooya1361.makerspace.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.github.pooya1361.makerspace.dto.create.VoteCreateDTO;
import com.github.pooya1361.makerspace.dto.response.VoteResponseDTO;
import com.github.pooya1361.makerspace.dto.summary.ProposedTimeSlotSummaryDTO;
import com.github.pooya1361.makerspace.dto.summary.UserSummaryDTO;
import com.github.pooya1361.makerspace.mapper.VoteMapper;
import com.github.pooya1361.makerspace.security.JwtService;
import com.github.pooya1361.makerspace.service.VoteService;
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

@WebMvcTest(VoteController.class)
class VoteControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private VoteService voteService;

    @MockBean
    private VoteMapper voteMapper;

    @MockBean
    private JwtService jwtService;

    @Autowired
    private ObjectMapper objectMapper;

    private VoteCreateDTO voteCreateDTO;
    private VoteResponseDTO voteResponseDTO;
    private List<VoteResponseDTO> voteList;

    @BeforeEach
    void setUp() {
        voteCreateDTO = new VoteCreateDTO();
        voteCreateDTO.setUserId(1L);
        voteCreateDTO.setProposedTimeSlotId(1L);

        // Create summary DTOs for nested objects
        UserSummaryDTO user1 = new UserSummaryDTO();
        user1.setId(1L);
        user1.setUsername("user1");

        UserSummaryDTO user2 = new UserSummaryDTO();
        user2.setId(2L);
        user2.setUsername("user2");

        ProposedTimeSlotSummaryDTO timeSlot = new ProposedTimeSlotSummaryDTO();
        timeSlot.setId(1L);

        voteResponseDTO = new VoteResponseDTO();
        voteResponseDTO.setId(1L);
        voteResponseDTO.setUser(user1);
        voteResponseDTO.setProposedTimeSlot(timeSlot);

        VoteResponseDTO vote2 = new VoteResponseDTO();
        vote2.setId(2L);
        vote2.setUser(user2);
        vote2.setProposedTimeSlot(timeSlot); // Same time slot, different user

        voteList = Arrays.asList(voteResponseDTO, vote2);
    }

    @Test
    @WithMockUser
    void getAllVotes_Success() throws Exception {
        when(voteService.getAllVotes()).thenReturn(voteList);

        mockMvc.perform(get("/api/votes"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.length()").value(2))
                .andExpect(jsonPath("$[0].id").value(1))
                .andExpect(jsonPath("$[0].user.id").value(1))
                .andExpect(jsonPath("$[1].user.id").value(2));

        verify(voteService).getAllVotes();
    }

    @Test
    @WithMockUser
    void getVoteById_Success() throws Exception {
        when(voteService.getVoteById(1L)).thenReturn(Optional.of(voteResponseDTO));

        mockMvc.perform(get("/api/votes/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.user.id").value(1))
                .andExpect(jsonPath("$.proposedTimeSlot.id").value(1));

        verify(voteService).getVoteById(1L);
    }

    @Test
    @WithMockUser
    void getVoteById_NotFound() throws Exception {
        when(voteService.getVoteById(999L)).thenReturn(Optional.empty());

        mockMvc.perform(get("/api/votes/999"))
                .andExpect(status().isNotFound());

        verify(voteService).getVoteById(999L);
    }

    @Test
    @WithMockUser(authorities = "ADMIN")
    void createVote_Success() throws Exception {
        when(voteService.createVote(any(VoteCreateDTO.class))).thenReturn(voteResponseDTO);

        mockMvc.perform(post("/api/votes")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(voteCreateDTO)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.user.id").value(1));

        verify(voteService).createVote(any(VoteCreateDTO.class));
    }

    @Test
    @WithMockUser(authorities = "ADMIN")
    void updateVote_Success() throws Exception {
        when(voteService.updateVote(eq(1L), any(VoteCreateDTO.class))).thenReturn(voteResponseDTO);

        mockMvc.perform(patch("/api/votes/1")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(voteCreateDTO)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.user.id").value(1));

        verify(voteService).updateVote(eq(1L), any(VoteCreateDTO.class));
    }

    @Test
    @WithMockUser(authorities = "ADMIN")
    void deleteVote_Success() throws Exception {
        doNothing().when(voteService).deleteVote(1L);

        mockMvc.perform(delete("/api/votes/1")
                        .with(csrf()))
                .andExpect(status().isNoContent());

        verify(voteService).deleteVote(1L);
    }
}