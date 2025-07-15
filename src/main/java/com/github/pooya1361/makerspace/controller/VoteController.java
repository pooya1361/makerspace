package com.github.pooya1361.makerspace.controller;

import com.github.pooya1361.makerspace.dto.VoteCreateDTO;
import com.github.pooya1361.makerspace.dto.VoteResponseDTO;
import com.github.pooya1361.makerspace.mapper.VoteMapper;
import com.github.pooya1361.makerspace.repository.VoteRepository;
import com.github.pooya1361.makerspace.service.VoteService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/votes")
@Tag(name = "Vote management", description = "Endpoints for lesson administration")
public class VoteController {
    private final VoteRepository voteRepository;
    private final VoteService voteService;

    @Autowired
    public VoteController(VoteRepository voteRepository, VoteService voteService) {
        this.voteRepository = voteRepository;
        this.voteService = voteService;
    }

    @Autowired
    private VoteMapper voteMapper;

    @GetMapping
    @Operation(summary = "Get all votes", description = "Retrieves a list of all registered votes in the system.")
    public ResponseEntity<List<VoteResponseDTO>> getVotes() {
        List<VoteResponseDTO> voteResponseDTOs = voteMapper.toDtoList(voteRepository.findAll());
        return new ResponseEntity<>(voteResponseDTOs, HttpStatus.CREATED);
    }

    @PostMapping
    @Operation(summary = "Add a vote", description = "Adds a vote to the system.")
    public ResponseEntity<VoteResponseDTO> createVote(@Valid @RequestBody VoteCreateDTO voteCreateDTO) {
        VoteResponseDTO createdVote = voteService.createVote(voteCreateDTO);
        return new ResponseEntity<>(createdVote, HttpStatus.CREATED);
    }
}
