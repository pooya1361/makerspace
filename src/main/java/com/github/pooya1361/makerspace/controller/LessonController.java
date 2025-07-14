package com.github.pooya1361.makerspace.controller;

import com.github.pooya1361.makerspace.dto.ActivityResponseDTO;
import com.github.pooya1361.makerspace.dto.LessonCreateDTO;
import com.github.pooya1361.makerspace.dto.LessonResponseDTO;
import com.github.pooya1361.makerspace.mapper.LessonMapper;
import com.github.pooya1361.makerspace.model.Activity;
import com.github.pooya1361.makerspace.model.Lesson;
import com.github.pooya1361.makerspace.repository.ActivityRepository;
import com.github.pooya1361.makerspace.repository.LessonRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/lessons")
@Tag(name = "Lesson management", description = "Endpoints for lesson administration")
public class LessonController {
    private final LessonRepository lessonRepository;

    @Autowired
    public LessonController(LessonRepository lessonRepository) {
        this.lessonRepository = lessonRepository;
    }
    @Autowired
    private ActivityRepository activityRepository;

    @Autowired
    private LessonMapper lessonMapper;

    @GetMapping
    @Operation(summary = "Get all lessons", description = "Retrieves a list of all registered lessons in the system.")
    public ResponseEntity<List<LessonResponseDTO>> getLessons() {
        List<LessonResponseDTO> lessonResponseDTOs = lessonMapper.toDtoList(lessonRepository.findAll());
        return new ResponseEntity<>(lessonResponseDTOs, HttpStatus.CREATED);
    }

    @PostMapping
    @Operation(summary = "Add a lesson", description = "Adds a lesson to the system.")
    public ResponseEntity<LessonResponseDTO> addLesson(@RequestBody LessonCreateDTO createDTO) {
        // Get the activity
        Activity activity = activityRepository.findById(createDTO.getActivityId())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Activity not found with id " + createDTO.getActivityId()));

        Lesson newLesson = new Lesson(createDTO, activity);

        Lesson savedLesson = lessonRepository.save(newLesson);

        LessonResponseDTO responseDTO = new LessonResponseDTO(savedLesson, new ActivityResponseDTO());

        return new ResponseEntity<>(responseDTO, HttpStatus.CREATED);
    }
}
