package com.github.pooya1361.makerspace.controller;

import com.github.pooya1361.makerspace.dto.create.LessonCreateDTO;
import com.github.pooya1361.makerspace.dto.create.LessonUserCreateDTO;
import com.github.pooya1361.makerspace.dto.response.LessonResponseDTO;
import com.github.pooya1361.makerspace.dto.response.LessonUserResponseDTO;
import com.github.pooya1361.makerspace.service.LessonService;
import com.github.pooya1361.makerspace.service.LessonUserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/lesson-users")
@Tag(name = "Lesson-user management", description = "Endpoints for lesson-user administration. Users that have expressed interest to lessons")
@AllArgsConstructor
public class LessonUserController {
    private final LessonUserService lessonUserService;

    @PostMapping
    @Operation(summary = "Create a new lesson", description = "Adds a new lesson to an activity.")
    public ResponseEntity<LessonUserResponseDTO> createLessonUser(@Valid @RequestBody LessonUserCreateDTO createDTO) {
        LessonUserResponseDTO createdLessonUser = lessonUserService.createLessonUser(createDTO);
        return new ResponseEntity<>(createdLessonUser, HttpStatus.CREATED);
    }

    @GetMapping
    @Operation(summary = "Get all lessons-users", description = "Retrieves a list of all lessons-users.")
    public ResponseEntity<List<LessonUserResponseDTO>> getAllLessonUsers() {
        List<LessonUserResponseDTO> lessonUsers = lessonUserService.getAllLessonUsers();
        return ResponseEntity.ok(lessonUsers);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get a lesson-user by id", description = "Retrieves a lesson-user from the system by its ID.")
    public ResponseEntity<LessonUserResponseDTO> getLessonUserById(@PathVariable Long id) {
        return lessonUserService.getLessonUserById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/user/{id}")
    @Operation(summary = "Get lessons of a user by user id", description = "Retrieves lessons of a user from the system user by its ID.")
    public ResponseEntity<List<LessonUserResponseDTO>> getLessonUserByUserId(@PathVariable Long id) {
        List<LessonUserResponseDTO> lessonUsers = lessonUserService.getLessonUserByUserId(id);
        return ResponseEntity.ok(lessonUsers);
    }

    @PatchMapping("/{id}")
    @Operation(summary = "Update a lesson-user", description = "Updates an existing lesson-user's information.")
    public ResponseEntity<LessonUserResponseDTO> updateLessonUser(@PathVariable Long id, @Valid @RequestBody LessonUserCreateDTO updateDTO) {
        LessonUserResponseDTO updatedLessonUser = lessonUserService.updateLessonUser(id, updateDTO);
        return ResponseEntity.ok(updatedLessonUser);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a lesson-user", description = "Removes a lesson-user from the system.")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteLessonUser(@PathVariable Long id) {
        lessonUserService.deleteLessonUser(id);
    }
}
