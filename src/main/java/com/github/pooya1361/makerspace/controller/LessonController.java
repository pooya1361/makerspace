package com.github.pooya1361.makerspace.controller;

import com.github.pooya1361.makerspace.dto.response.ActivityResponseDTO;
import com.github.pooya1361.makerspace.dto.create.LessonCreateDTO;
import com.github.pooya1361.makerspace.dto.response.LessonResponseDTO;
import com.github.pooya1361.makerspace.mapper.LessonMapper;
import com.github.pooya1361.makerspace.model.Activity;
import com.github.pooya1361.makerspace.model.Lesson;
import com.github.pooya1361.makerspace.repository.ActivityRepository;
import com.github.pooya1361.makerspace.repository.LessonRepository;
import com.github.pooya1361.makerspace.service.LessonService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/lessons")
@Tag(name = "Lesson management", description = "Endpoints for lesson administration")
public class LessonController {
    private final LessonService lessonService;

    public LessonController(LessonService lessonService) {
        this.lessonService = lessonService;
    }

    @PostMapping
    @Operation(summary = "Create a new lesson", description = "Adds a new lesson to an activity.")
    public ResponseEntity<LessonResponseDTO> createLesson(@Valid @RequestBody LessonCreateDTO createDTO) {
        LessonResponseDTO createdLesson = lessonService.createLesson(createDTO);
        return new ResponseEntity<>(createdLesson, HttpStatus.CREATED);
    }

    @GetMapping
    @Operation(summary = "Get all lessons", description = "Retrieves a list of all lessons.")
    public ResponseEntity<List<LessonResponseDTO>> getAllLessons() {
        List<LessonResponseDTO> lessons = lessonService.getAllLessons();
        return ResponseEntity.ok(lessons);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get a lesson by id", description = "Retrieves a lesson from the system by its ID.")
    public ResponseEntity<LessonResponseDTO> getLessonById(@PathVariable Long id) {
        return lessonService.getLessonById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PatchMapping("/{id}")
    @Operation(summary = "Update a lesson", description = "Updates an existing lesson's information.")
    public ResponseEntity<LessonResponseDTO> updateLesson(@PathVariable Long id, @Valid @RequestBody LessonCreateDTO updateDTO) {
        LessonResponseDTO updatedLesson = lessonService.updateLesson(id, updateDTO);
        return ResponseEntity.ok(updatedLesson);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a lesson", description = "Removes a lesson from the system.")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteLesson(@PathVariable Long id) {
        lessonService.deleteLesson(id);
    }
}
