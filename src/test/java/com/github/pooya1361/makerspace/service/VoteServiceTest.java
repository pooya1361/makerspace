// src/test/java/com/github/pooya1361/makerspace/service/VoteServiceTest.java
package com.github.pooya1361.makerspace.service;

import com.github.pooya1361.makerspace.dto.create.VoteCreateDTO;
import com.github.pooya1361.makerspace.dto.response.VoteResponseDTO;
import com.github.pooya1361.makerspace.mapper.VoteMapper;
import com.github.pooya1361.makerspace.model.ProposedTimeSlot;
import com.github.pooya1361.makerspace.model.User;
import com.github.pooya1361.makerspace.model.Vote;
import com.github.pooya1361.makerspace.model.enums.UserType;
import com.github.pooya1361.makerspace.repository.ProposedTimeSlotRepository;
import com.github.pooya1361.makerspace.repository.UserRepository;
import com.github.pooya1361.makerspace.repository.VoteRepository;
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
class VoteServiceTest {

    @Mock
    private VoteRepository voteRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private ProposedTimeSlotRepository proposedTimeSlotRepository;

    @Mock
    private VoteMapper voteMapper;

    @InjectMocks
    private VoteService voteService;

    private Vote vote;
    private User user;
    private ProposedTimeSlot proposedTimeSlot;
    private VoteCreateDTO voteCreateDTO;
    private VoteResponseDTO voteResponseDTO;

    @BeforeEach
    void setUp() {
        // Setup User
        user = new User();
        user.setId(1L);
        user.setFirstName("John");
        user.setLastName("Voter");
        user.setEmail("john.voter@example.com");
        user.setUserType(UserType.NORMAL);

        // Setup ProposedTimeSlot
        proposedTimeSlot = new ProposedTimeSlot();
        proposedTimeSlot.setId(1L);
        proposedTimeSlot.setProposedStartTime(OffsetDateTime.of(2025, 8, 15, 14, 30, 0, 0, ZoneOffset.UTC));

        // Setup Vote
        vote = new Vote();
        vote.setId(1L);
        vote.setUser(user);
        vote.setProposedTimeSlot(proposedTimeSlot);

        // Setup DTOs
        voteCreateDTO = new VoteCreateDTO();
        voteCreateDTO.setUserId(1L);
        voteCreateDTO.setProposedTimeSlotId(1L);

        voteResponseDTO = new VoteResponseDTO();
        voteResponseDTO.setId(1L);
        // Note: VoteResponseDTO likely has nested user and timeSlot info, 
        // but we're focusing on the basic structure for testing
    }

    // ==================== CREATE VOTE TESTS ====================

    @Test
    void createVote_Success() {
        // given
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(proposedTimeSlotRepository.findById(1L)).thenReturn(Optional.of(proposedTimeSlot));
        when(voteMapper.toEntity(voteCreateDTO)).thenReturn(vote);
        when(voteRepository.save(vote)).thenReturn(vote);
        when(voteMapper.toDto(vote)).thenReturn(voteResponseDTO);

        // when
        VoteResponseDTO result = voteService.createVote(voteCreateDTO);

        // then
        assertThat(result).isNotNull();
        assertThat(result.getId()).isEqualTo(1L);

        verify(userRepository).findById(1L);
        verify(proposedTimeSlotRepository).findById(1L);
        verify(voteMapper).toEntity(voteCreateDTO);
        verify(voteRepository).save(vote);
        verify(voteMapper).toDto(vote);
    }

    @Test
    void createVote_UserNotFound_ThrowsException() {
        // given
        when(userRepository.findById(1L)).thenReturn(Optional.empty());

        // when & then
        assertThatThrownBy(() -> voteService.createVote(voteCreateDTO))
                .isInstanceOf(EntityNotFoundException.class)
                .hasMessage("User not found with ID: 1");

        verify(userRepository).findById(1L);
        verify(proposedTimeSlotRepository, never()).findById(any());
        verify(voteRepository, never()).save(any());
    }

    @Test
    void createVote_ProposedTimeSlotNotFound_ThrowsException() {
        // given
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(proposedTimeSlotRepository.findById(1L)).thenReturn(Optional.empty());

        // when & then
        assertThatThrownBy(() -> voteService.createVote(voteCreateDTO))
                .isInstanceOf(EntityNotFoundException.class)
                .hasMessage("ProposedTimeSlot not found with ID: 1");

        verify(userRepository).findById(1L);
        verify(proposedTimeSlotRepository).findById(1L);
        verify(voteRepository, never()).save(any());
    }

    @Test
    void createVote_WithDifferentUserTypes_Success() {
        // given - test with different user types
        User instructorUser = new User();
        instructorUser.setId(2L);
        instructorUser.setFirstName("Jane");
        instructorUser.setLastName("Instructor");
        instructorUser.setEmail("jane.instructor@example.com");
        instructorUser.setUserType(UserType.INSTRUCTOR);

        Vote instructorVote = new Vote();
        instructorVote.setId(2L);
        instructorVote.setUser(instructorUser);
        instructorVote.setProposedTimeSlot(proposedTimeSlot);

        VoteCreateDTO instructorVoteDTO = new VoteCreateDTO();
        instructorVoteDTO.setUserId(2L);
        instructorVoteDTO.setProposedTimeSlotId(1L);

        VoteResponseDTO instructorVoteResponse = new VoteResponseDTO();
        instructorVoteResponse.setId(2L);

        when(userRepository.findById(2L)).thenReturn(Optional.of(instructorUser));
        when(proposedTimeSlotRepository.findById(1L)).thenReturn(Optional.of(proposedTimeSlot));
        when(voteMapper.toEntity(instructorVoteDTO)).thenReturn(instructorVote);
        when(voteRepository.save(instructorVote)).thenReturn(instructorVote);
        when(voteMapper.toDto(instructorVote)).thenReturn(instructorVoteResponse);

        // when
        VoteResponseDTO result = voteService.createVote(instructorVoteDTO);

        // then
        assertThat(result).isNotNull();
        assertThat(result.getId()).isEqualTo(2L);

        verify(userRepository).findById(2L);
        verify(proposedTimeSlotRepository).findById(1L);
        verify(voteMapper).toEntity(instructorVoteDTO);
        verify(voteRepository).save(instructorVote);
        verify(voteMapper).toDto(instructorVote);
    }

    // ==================== GET ALL VOTES TESTS ====================

    @Test
    void getAllVotes_Success() {
        // given
        List<Vote> votes = Arrays.asList(vote);
        List<VoteResponseDTO> expectedDtos = Arrays.asList(voteResponseDTO);

        when(voteRepository.findAll()).thenReturn(votes);
        when(voteMapper.toDtoList(votes)).thenReturn(expectedDtos);

        // when
        List<VoteResponseDTO> result = voteService.getAllVotes();

        // then
        assertThat(result).hasSize(1);
        assertThat(result.get(0).getId()).isEqualTo(1L);

        verify(voteRepository).findAll();
        verify(voteMapper).toDtoList(votes);
    }

    @Test
    void getAllVotes_EmptyList() {
        // given
        List<Vote> emptyVotes = Arrays.asList();
        List<VoteResponseDTO> emptyDtos = Arrays.asList();

        when(voteRepository.findAll()).thenReturn(emptyVotes);
        when(voteMapper.toDtoList(emptyVotes)).thenReturn(emptyDtos);

        // when
        List<VoteResponseDTO> result = voteService.getAllVotes();

        // then
        assertThat(result).isEmpty();
        verify(voteRepository).findAll();
        verify(voteMapper).toDtoList(emptyVotes);
    }

    @Test
    void getAllVotes_MultipleVotes_Success() {
        // given - test with multiple votes from different users
        User user2 = new User();
        user2.setId(2L);
        user2.setFirstName("Alice");
        user2.setLastName("Voter");
        user2.setEmail("alice.voter@example.com");
        user2.setUserType(UserType.NORMAL);

        Vote vote2 = new Vote();
        vote2.setId(2L);
        vote2.setUser(user2);
        vote2.setProposedTimeSlot(proposedTimeSlot);

        VoteResponseDTO voteResponseDTO2 = new VoteResponseDTO();
        voteResponseDTO2.setId(2L);

        List<Vote> votes = Arrays.asList(vote, vote2);
        List<VoteResponseDTO> expectedDtos = Arrays.asList(voteResponseDTO, voteResponseDTO2);

        when(voteRepository.findAll()).thenReturn(votes);
        when(voteMapper.toDtoList(votes)).thenReturn(expectedDtos);

        // when
        List<VoteResponseDTO> result = voteService.getAllVotes();

        // then
        assertThat(result).hasSize(2);
        assertThat(result.get(0).getId()).isEqualTo(1L);
        assertThat(result.get(1).getId()).isEqualTo(2L);

        verify(voteRepository).findAll();
        verify(voteMapper).toDtoList(votes);
    }

    // ==================== GET VOTE BY ID TESTS ====================

    @Test
    void getVoteById_Success() {
        // given
        when(voteRepository.findById(1L)).thenReturn(Optional.of(vote));
        when(voteMapper.toDto(vote)).thenReturn(voteResponseDTO);

        // when
        Optional<VoteResponseDTO> result = voteService.getVoteById(1L);

        // then
        assertThat(result).isPresent();
        assertThat(result.get().getId()).isEqualTo(1L);

        verify(voteRepository).findById(1L);
        verify(voteMapper).toDto(vote);
    }

    @Test
    void getVoteById_NotFound() {
        // given
        when(voteRepository.findById(1L)).thenReturn(Optional.empty());

        // when
        Optional<VoteResponseDTO> result = voteService.getVoteById(1L);

        // then
        assertThat(result).isEmpty();
        verify(voteRepository).findById(1L);
        verify(voteMapper, never()).toDto(any());
    }

    // ==================== UPDATE VOTE TESTS ====================

    @Test
    void updateVote_Success() {
        // given
        VoteCreateDTO updateDTO = new VoteCreateDTO();
        updateDTO.setUserId(1L);
        updateDTO.setProposedTimeSlotId(1L);
        // Note: VoteCreateDTO might have additional fields like a "weight" or "preference" 
        // that can be updated without changing the user/timeSlot relationships

        when(voteRepository.findById(1L)).thenReturn(Optional.of(vote));
        when(voteRepository.save(vote)).thenReturn(vote);
        when(voteMapper.toDto(vote)).thenReturn(voteResponseDTO);

        // when
        VoteResponseDTO result = voteService.updateVote(1L, updateDTO);

        // then
        assertThat(result).isNotNull();
        assertThat(result.getId()).isEqualTo(1L);

        verify(voteRepository).findById(1L);
        verify(voteMapper).updateVoteFromDto(updateDTO, vote);
        verify(voteRepository).save(vote);
        verify(voteMapper).toDto(vote);
    }

    @Test
    void updateVote_VoteNotFound_ThrowsException() {
        // given
        VoteCreateDTO updateDTO = new VoteCreateDTO();
        when(voteRepository.findById(1L)).thenReturn(Optional.empty());

        // when & then
        assertThatThrownBy(() -> voteService.updateVote(1L, updateDTO))
                .isInstanceOf(EntityNotFoundException.class)
                .hasMessage("Vote not found with ID: 1");

        verify(voteRepository).findById(1L);
        verify(voteRepository, never()).save(any());
    }

    // ==================== DELETE VOTE TESTS ====================

    @Test
    void deleteVote_Success() {
        // given
        when(voteRepository.existsById(1L)).thenReturn(true);

        // when
        voteService.deleteVote(1L);

        // then
        verify(voteRepository).existsById(1L);
        verify(voteRepository).deleteById(1L);
    }

    @Test
    void deleteVote_NotFound_ThrowsException() {
        // given
        when(voteRepository.existsById(1L)).thenReturn(false);

        // when & then
        assertThatThrownBy(() -> voteService.deleteVote(1L))
                .isInstanceOf(EntityNotFoundException.class)
                .hasMessage("Vote not found with ID: 1");

        verify(voteRepository).existsById(1L);
        verify(voteRepository, never()).deleteById(any());
    }

    // ==================== EDGE CASE TESTS ====================

    @Test
    void createVote_WithNonExistentIds_ThrowsCorrectExceptions() {
        // Test with non-existent user ID
        VoteCreateDTO voteWithBadUserId = new VoteCreateDTO();
        voteWithBadUserId.setUserId(999L);
        voteWithBadUserId.setProposedTimeSlotId(1L);

        when(userRepository.findById(999L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> voteService.createVote(voteWithBadUserId))
                .isInstanceOf(EntityNotFoundException.class)
                .hasMessage("User not found with ID: 999");

        // Test with non-existent time slot ID
        VoteCreateDTO voteWithBadTimeSlotId = new VoteCreateDTO();
        voteWithBadTimeSlotId.setUserId(1L);
        voteWithBadTimeSlotId.setProposedTimeSlotId(999L);

        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(proposedTimeSlotRepository.findById(999L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> voteService.createVote(voteWithBadTimeSlotId))
                .isInstanceOf(EntityNotFoundException.class)
                .hasMessage("ProposedTimeSlot not found with ID: 999");
    }

    @Test
    void updateVote_OnlyCallsMapperUpdate_DoesNotChangeRelationships() {
        // given - this test verifies that update doesn't try to change user/timeSlot relationships
        VoteCreateDTO updateDTO = new VoteCreateDTO();
        updateDTO.setUserId(999L); // Different user ID
        updateDTO.setProposedTimeSlotId(999L); // Different time slot ID

        when(voteRepository.findById(1L)).thenReturn(Optional.of(vote));
        when(voteRepository.save(vote)).thenReturn(vote);
        when(voteMapper.toDto(vote)).thenReturn(voteResponseDTO);

        // when
        VoteResponseDTO result = voteService.updateVote(1L, updateDTO);

        // then
        assertThat(result).isNotNull();

        verify(voteRepository).findById(1L);
        verify(voteMapper).updateVoteFromDto(updateDTO, vote);
        verify(voteRepository).save(vote);
        verify(voteMapper).toDto(vote);

        // The service should NOT try to fetch new user or time slot entities during update
        verify(userRepository, never()).findById(any());
        verify(proposedTimeSlotRepository, never()).findById(any());
    }
}