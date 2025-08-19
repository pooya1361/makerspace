package com.github.pooya1361.makerspace.controller;

import com.github.pooya1361.makerspace.dto.create.WorkshopCreateDTO;
import com.github.pooya1361.makerspace.dto.response.WorkshopResponseDTO;
import com.github.pooya1361.makerspace.service.WorkshopService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.MutationMapping;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;

import java.util.List;
import java.util.Optional;

@Controller
public class WorkshopGraphQLController {

    private final WorkshopService workshopService;

    @Autowired
    public WorkshopGraphQLController(WorkshopService workshopService) {
        this.workshopService = workshopService;
    }

    // Query to get all workshops
    @QueryMapping
    public List<WorkshopResponseDTO> workshops() {
        return workshopService.getAllWorkshops();
    }

    // Query to get a workshop by id
    @QueryMapping
    public Optional<WorkshopResponseDTO> workshop(@Argument Long id) {
        return workshopService.getWorkshopById(id);
    }

    // Mutation to create a workshop
    @MutationMapping
    @PreAuthorize("hasAnyAuthority('ADMIN', 'SUPERADMIN')")
    public WorkshopResponseDTO createWorkshop(@Argument @Valid WorkshopCreateDTO input) {
        return workshopService.createWorkshop(input);
    }

    // Mutation to update a workshop
    @MutationMapping
    @PreAuthorize("hasAnyAuthority('ADMIN', 'SUPERADMIN')")
    public WorkshopResponseDTO updateWorkshop(@Argument Long id, @Argument @Valid WorkshopCreateDTO input) {
        return workshopService.updateWorkshop(id, input);
    }

    // Mutation to delete a workshop
    @MutationMapping
    @PreAuthorize("hasAnyAuthority('ADMIN', 'SUPERADMIN')")
    public Boolean deleteWorkshop(@Argument Long id) {
        try {
            workshopService.deleteWorkshop(id);
            return true;
        } catch (Exception e) {
            return false;
        }
    }
}