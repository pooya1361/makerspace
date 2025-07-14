package com.github.pooya1361.makerspace.controller;

import com.github.pooya1361.makerspace.dto.LessonResponseDTO;
import com.github.pooya1361.makerspace.dto.ScheduledLessonResponseDTO;
import com.github.pooya1361.makerspace.model.Lesson;
import com.github.pooya1361.makerspace.model.ScheduledLesson;
import com.github.pooya1361.makerspace.repository.LessonRepository;
import com.github.pooya1361.makerspace.repository.ScheduledLessonRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.github.pooya1361.makerspace.mapper.ScheduledLessonMapper;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/lessons/scheduledLessons")
@Tag(name = "Scheduled lesson management", description = "Endpoints for scheduled lesson administration")
public class ScheduledLessonController {
    @Autowired
    private final ScheduledLessonRepository scheduledLessonRepository;

    @Autowired
    private ScheduledLessonMapper scheduledLessonMapper;

    @Autowired
    public ScheduledLessonController(ScheduledLessonRepository scheduledLessonRepository) {
        this.scheduledLessonRepository = scheduledLessonRepository;
    }

    @GetMapping
    @Operation(summary = "Get all scheduled lessons", description = "Retrieves a list of all  scheduled lessons in the system.")
    public ResponseEntity<List<ScheduledLessonResponseDTO>> getScheduledLessons() {
        List<ScheduledLesson> scheduledLessons = scheduledLessonRepository.findAll();
        List<ScheduledLessonResponseDTO> responseDTOs = scheduledLessonMapper.toDtoList(scheduledLessons);
        return new ResponseEntity<>(responseDTOs, HttpStatus.OK);
    }
}
