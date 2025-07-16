// src/main/java/com/github/pooya1361/makerspace/controller/ScheduledLessonController.java
package com.github.pooya1361.makerspace.controller;

import com.github.pooya1361.makerspace.dto.create.ScheduledLessonCreateDTO;
import com.github.pooya1361.makerspace.dto.response.ScheduledLessonResponseDTO;
import com.github.pooya1361.makerspace.model.ScheduledLesson;
import com.github.pooya1361.makerspace.service.ScheduledLessonService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/scheduled-lessons")
@Tag(name = "Scheduled Lesson Management", description = "Endpoints for managing specific lesson schedules")
public class ScheduledLessonController {

    private final ScheduledLessonService scheduledLessonService;

    public ScheduledLessonController(ScheduledLessonService scheduledLessonService) {
        this.scheduledLessonService = scheduledLessonService;
    }

    @PostMapping
    @Operation(summary = "Create a new scheduled lesson", description = "Adds a new scheduled instance of a lesson.")
    public ResponseEntity<ScheduledLessonResponseDTO> createScheduledLesson(@Valid @RequestBody ScheduledLessonCreateDTO createDTO) {
        ScheduledLessonResponseDTO createdScheduledLesson = scheduledLessonService.createScheduledLesson(createDTO);
        return new ResponseEntity<>(createdScheduledLesson, HttpStatus.CREATED);
    }

    @GetMapping
    @Operation(summary = "Get all scheduled lessons", description = "Retrieves a list of all scheduled lessons.")
    public ResponseEntity<List<ScheduledLessonResponseDTO>> getAllScheduledLessons() {
        List<ScheduledLessonResponseDTO> scheduledLessons = scheduledLessonService.getAllScheduledLessons();
        return ResponseEntity.ok(scheduledLessons);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get a scheduled lesson by id", description = "Retrieves a scheduled lesson from the system by its ID.")
    public ResponseEntity<ScheduledLessonResponseDTO> getScheduledLessonById(@PathVariable Long id) {
        return scheduledLessonService.getScheduledLessonById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PatchMapping("/{id}")
    @Operation(summary = "Update a scheduled lesson", description = "Updates an existing scheduled lesson's information.")
    public ResponseEntity<ScheduledLessonResponseDTO> updateScheduledLesson(@PathVariable Long id, @Valid @RequestBody ScheduledLessonCreateDTO updateDTO) {
        ScheduledLessonResponseDTO updatedScheduledLesson = scheduledLessonService.updateScheduledLesson(id, updateDTO);
        return ResponseEntity.ok(updatedScheduledLesson);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a scheduled lesson", description = "Removes a scheduled lesson from the system.")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteScheduledLesson(@PathVariable Long id) {
        scheduledLessonService.deleteScheduledLesson(id);
    }
}