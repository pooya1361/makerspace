// src/main/java/com/github/pooya1361/makerspace/controller/VoteController.java
package com.github.pooya1361.makerspace.controller;

import com.github.pooya1361.makerspace.dto.create.VoteCreateDTO;
import com.github.pooya1361.makerspace.dto.response.VoteResponseDTO;
import com.github.pooya1361.makerspace.service.VoteService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/votes")
@Tag(name = "Vote Management", description = "Endpoints for managing votes on proposed time slots")
public class VoteController {

    private final VoteService voteService;

    public VoteController(VoteService voteService) {
        this.voteService = voteService;
    }

    @PostMapping
    @Operation(summary = "Create a new vote", description = "Casts a new vote for a proposed time slot.")
    public ResponseEntity<VoteResponseDTO> createVote(@Valid @RequestBody VoteCreateDTO voteCreateDTO) {
        VoteResponseDTO createdVote = voteService.createVote(voteCreateDTO);
        return new ResponseEntity<>(createdVote, HttpStatus.CREATED);
    }

    @GetMapping
    @Operation(summary = "Get all votes", description = "Retrieves a list of all votes.")
    public ResponseEntity<List<VoteResponseDTO>> getAllVotes() {
        List<VoteResponseDTO> votes = voteService.getAllVotes();
        return ResponseEntity.ok(votes);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get a vote by id", description = "Retrieves a vote from the system by its ID.")
    public ResponseEntity<VoteResponseDTO> getVoteById(@PathVariable Long id) {
        return voteService.getVoteById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PatchMapping("/{id}")
    @Operation(summary = "Update a vote", description = "Updates an existing vote's information.")
    public ResponseEntity<VoteResponseDTO> updateVote(@PathVariable Long id, @Valid @RequestBody VoteCreateDTO updateDTO) {
        VoteResponseDTO updatedVote = voteService.updateVote(id, updateDTO);
        return ResponseEntity.ok(updatedVote);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a vote", description = "Removes a vote from the system.")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteVote(@PathVariable Long id) {
        voteService.deleteVote(id);
    }
}