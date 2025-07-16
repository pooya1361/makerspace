// src/main/java/com/github/pooya1361/makerspace/service/VoteService.java
package com.github.pooya1361.makerspace.service;

import com.github.pooya1361.makerspace.dto.create.VoteCreateDTO;
import com.github.pooya1361.makerspace.dto.response.VoteResponseDTO;
import com.github.pooya1361.makerspace.mapper.VoteMapper;
import com.github.pooya1361.makerspace.model.ProposedTimeSlot;
import com.github.pooya1361.makerspace.model.User;
import com.github.pooya1361.makerspace.model.Vote;
import com.github.pooya1361.makerspace.repository.ProposedTimeSlotRepository;
import com.github.pooya1361.makerspace.repository.UserRepository;
import com.github.pooya1361.makerspace.repository.VoteRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

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
        User user = userRepository.findById(voteCreateDTO.getUserId())
                .orElseThrow(() -> new EntityNotFoundException("User not found with ID: " + voteCreateDTO.getUserId()));

        ProposedTimeSlot proposedTimeSlot = proposedTimeSlotRepository.findById(voteCreateDTO.getProposedTimeSlotId())
                .orElseThrow(() -> new EntityNotFoundException("ProposedTimeSlot not found with ID: " + voteCreateDTO.getProposedTimeSlotId()));

        // Check for duplicate vote (if a user can only vote once per time slot)
        // You might need a custom query in VoteRepository for this:
        // Optional<Vote> existingVote = voteRepository.findByUserAndProposedTimeSlot(user, proposedTimeSlot);
        // if (existingVote.isPresent()) { throw new IllegalStateException("User already voted for this time slot"); }

        Vote vote = voteMapper.toEntity(voteCreateDTO);
        vote.setUser(user);
        vote.setProposedTimeSlot(proposedTimeSlot);

        Vote savedVote = voteRepository.save(vote);
        return voteMapper.toDto(savedVote);
    }

    public List<VoteResponseDTO> getAllVotes() {
        return voteMapper.toDtoList(voteRepository.findAll());
    }

    public Optional<VoteResponseDTO> getVoteById(Long id) {
        return voteRepository.findById(id)
                .map(voteMapper::toDto);
    }

    @Transactional
    public VoteResponseDTO updateVote(Long id, VoteCreateDTO updateDTO) {
        Vote existingVote = voteRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Vote not found with ID: " + id));

        // For votes, usually only the value might be updated, not the user or time slot.
        // If you allow changing user/time slot, you'd fetch them here.
        voteMapper.updateVoteFromDto(updateDTO, existingVote);

        Vote updatedVote = voteRepository.save(existingVote);
        return voteMapper.toDto(updatedVote);
    }

    @Transactional
    public void deleteVote(Long id) {
        if (!voteRepository.existsById(id)) {
            throw new EntityNotFoundException("Vote not found with ID: " + id);
        }
        voteRepository.deleteById(id);
    }
}