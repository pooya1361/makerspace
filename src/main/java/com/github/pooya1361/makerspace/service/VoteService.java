package com.github.pooya1361.makerspace.service;

import com.github.pooya1361.makerspace.dto.VoteCreateDTO;
import com.github.pooya1361.makerspace.dto.VoteResponseDTO;
import com.github.pooya1361.makerspace.mapper.VoteMapper;
import com.github.pooya1361.makerspace.model.Vote;
import com.github.pooya1361.makerspace.model.User;
import com.github.pooya1361.makerspace.model.ProposedTimeSlot;
import com.github.pooya1361.makerspace.repository.VoteRepository;
import com.github.pooya1361.makerspace.repository.UserRepository;
import com.github.pooya1361.makerspace.repository.ProposedTimeSlotRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import jakarta.persistence.EntityNotFoundException;

@Service
public class VoteService {

    private final VoteRepository voteRepository;
    private final UserRepository userRepository;
    private final ProposedTimeSlotRepository proposedTimeSlotRepository;
    private final VoteMapper voteMapper;

    public VoteService(VoteRepository voteRepository,
                       UserRepository userRepository,
                       ProposedTimeSlotRepository proposedTimeSlotRepository,
                       VoteMapper voteMapper) {
        this.voteRepository = voteRepository;
        this.userRepository = userRepository;
        this.proposedTimeSlotRepository = proposedTimeSlotRepository;
        this.voteMapper = voteMapper;
    }

    @Transactional
    public VoteResponseDTO createVote(VoteCreateDTO voteCreateDTO) {
        // Fetch User and ProposedTimeSlot entities
        User user = userRepository.findById(voteCreateDTO.getUserId())
                .orElseThrow(() -> new EntityNotFoundException("User not found with ID: " + voteCreateDTO.getUserId()));

        ProposedTimeSlot proposedTimeSlot = proposedTimeSlotRepository.findById(voteCreateDTO.getProposedTimeSlotId())
                .orElseThrow(() -> new EntityNotFoundException("ProposedTimeSlot not found with ID: " + voteCreateDTO.getProposedTimeSlotId()));

        // Convert DTO to entity, setting relationships
        Vote vote = voteMapper.toEntity(voteCreateDTO);
        vote.setUser(user);
        vote.setProposedTimeSlot(proposedTimeSlot);

        // Save the vote
        Vote savedVote = voteRepository.save(vote);

        // Convert saved entity to response DTO
        return voteMapper.toDto(savedVote);
    }
}