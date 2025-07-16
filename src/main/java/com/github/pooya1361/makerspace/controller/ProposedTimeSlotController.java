// src/main/java/com/github/pooya1361/makerspace/controller/ProposedTimeSlotController.java
package com.github.pooya1361.makerspace.controller;

import com.github.pooya1361.makerspace.dto.create.ProposedTimeSlotCreateDTO;
import com.github.pooya1361.makerspace.dto.response.ProposedTimeSlotResponseDTO;
import com.github.pooya1361.makerspace.service.ProposedTimeSlotService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/proposed-time-slots")
@Tag(name = "Proposed Time Slot Management", description = "Endpoints for managing proposed time slots for lessons")
public class ProposedTimeSlotController {

    private final ProposedTimeSlotService proposedTimeSlotService;

    public ProposedTimeSlotController(ProposedTimeSlotService proposedTimeSlotService) {
        this.proposedTimeSlotService = proposedTimeSlotService;
    }

    @PostMapping
    @Operation(summary = "Create a new proposed time slot", description = "Adds a new time slot suggestion for a scheduled lesson.")
    public ResponseEntity<ProposedTimeSlotResponseDTO> createProposedTimeSlot(@Valid @RequestBody ProposedTimeSlotCreateDTO createDTO) {
        ProposedTimeSlotResponseDTO createdProposedTimeSlot = proposedTimeSlotService.createProposedTimeSlot(createDTO);
        return new ResponseEntity<>(createdProposedTimeSlot, HttpStatus.CREATED);
    }

    @GetMapping
    @Operation(summary = "Get all proposed time slots", description = "Retrieves a list of all proposed time slots.")
    public ResponseEntity<List<ProposedTimeSlotResponseDTO>> getAllProposedTimeSlots() {
        List<ProposedTimeSlotResponseDTO> proposedTimeSlots = proposedTimeSlotService.getAllProposedTimeSlots();
        return ResponseEntity.ok(proposedTimeSlots);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get a proposed time slot by id", description = "Retrieves a proposed time slot from the system by its ID.")
    public ResponseEntity<ProposedTimeSlotResponseDTO> getProposedTimeSlotById(@PathVariable Long id) {
        return proposedTimeSlotService.getProposedTimeSlotById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PatchMapping("/{id}")
    @Operation(summary = "Update a proposed time slot", description = "Updates an existing proposed time slot's information.")
    public ResponseEntity<ProposedTimeSlotResponseDTO> updateProposedTimeSlot(@PathVariable Long id, @Valid @RequestBody ProposedTimeSlotCreateDTO updateDTO) {
        ProposedTimeSlotResponseDTO updatedProposedTimeSlot = proposedTimeSlotService.updateProposedTimeSlot(id, updateDTO);
        return ResponseEntity.ok(updatedProposedTimeSlot);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a proposed time slot", description = "Removes a proposed time slot from the system.")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteProposedTimeSlot(@PathVariable Long id) {
        proposedTimeSlotService.deleteProposedTimeSlot(id);
    }
}