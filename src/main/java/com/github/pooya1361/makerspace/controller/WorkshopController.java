package com.github.pooya1361.makerspace.controller;

import com.github.pooya1361.makerspace.dto.UserResponseDTO;
import com.github.pooya1361.makerspace.model.Workshop;
import com.github.pooya1361.makerspace.repository.UserRepository;
import com.github.pooya1361.makerspace.repository.WorkshopRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/workshops")
@Tag(name = "Workshop management", description = "Endpoints for workshop administration. A workshop is where an activity takes place.")
public class WorkshopController {
    private final WorkshopRepository workshopRepository;

    @Autowired // Spring automatically injects WorkshopRepository
    public WorkshopController(WorkshopRepository workshopRepository) {
        this.workshopRepository = workshopRepository;
    }

    @GetMapping
    @Operation(summary = "Get all workshopss", description = "Retrieves a list of all workshops in the system")
    public List<Workshop> getWorkshops() {
        return workshopRepository.findAll();
    }

}
