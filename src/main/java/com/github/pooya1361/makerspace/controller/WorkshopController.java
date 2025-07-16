package com.github.pooya1361.makerspace.controller;

import com.github.pooya1361.makerspace.dto.create.WorkshopCreateDTO;
import com.github.pooya1361.makerspace.dto.response.WorkshopResponseDTO;
import com.github.pooya1361.makerspace.model.Workshop;
import com.github.pooya1361.makerspace.repository.WorkshopRepository;
import com.github.pooya1361.makerspace.service.WorkshopService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/workshops")
@Tag(name = "Workshop management", description = "Endpoints for workshop administration. A workshop is where an activity takes place.")
public class WorkshopController {
    private final WorkshopRepository workshopRepository;
    private final WorkshopService workshopService;

    @Autowired // Spring automatically injects WorkshopRepository
    public WorkshopController(WorkshopRepository workshopRepository, WorkshopService workshopService) {
        this.workshopRepository = workshopRepository;
        this.workshopService = workshopService;
    }

    @GetMapping
    @Operation(summary = "Get all workshops", description = "Retrieves a list of all workshops in the system")
    public List<Workshop> getWorkshops() {
        return workshopRepository.findAll();
    }


    @PostMapping
    @Operation(summary = "Add a workshop", description = "Adds a workshop to the system.")
    public ResponseEntity<WorkshopResponseDTO> createWorkshop(@Valid @RequestBody WorkshopCreateDTO workshopCreateDTO) {
        WorkshopResponseDTO createdWorkshop = workshopService.createWorkshop(workshopCreateDTO);
        return new ResponseEntity<>(createdWorkshop, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get a workshop by id", description = "Retrieves a workshop from the system")
    public ResponseEntity<WorkshopResponseDTO> getWorkshopById(@PathVariable Long id) {
        return workshopService.getWorkshopById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    @PatchMapping("/{id}")
    @Operation(summary = "Update a workshop", description = "Updates a workshop's info")
    public ResponseEntity<WorkshopResponseDTO> updateWorkshop(@PathVariable Long id, @Valid @RequestBody WorkshopCreateDTO workshopCreateDTO) {
        WorkshopResponseDTO updatedWorkshop = workshopService.updateWorkshop(id, workshopCreateDTO);
        return ResponseEntity.ok(updatedWorkshop);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a workshop", description = "Removes a workshop from the system.")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteWorkshop(@PathVariable Long id) {
        workshopService.deleteWorkshop(id);
    }
}
