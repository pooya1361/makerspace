package com.github.pooya1361.makerspace.controller;

import com.github.pooya1361.makerspace.dto.ActivityResponseDTO;
import com.github.pooya1361.makerspace.dto.LessonCreateDTO;
import com.github.pooya1361.makerspace.dto.LessonResponseDTO;
import com.github.pooya1361.makerspace.dto.ProposedTimeSlotResponseDTO;
import com.github.pooya1361.makerspace.mapper.LessonMapper;
import com.github.pooya1361.makerspace.mapper.ProposedTimeSlotMapper;
import com.github.pooya1361.makerspace.model.Activity;
import com.github.pooya1361.makerspace.model.Lesson;
import com.github.pooya1361.makerspace.repository.ActivityRepository;
import com.github.pooya1361.makerspace.repository.LessonRepository;
import com.github.pooya1361.makerspace.repository.ProposedTimeSlotRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/proposedTimeSlot")
@Tag(name = "Proposed Time Slot management", description = "Endpoints for Proposed time slots administration")
public class ProposedTimeSlotController {
    private final ProposedTimeSlotRepository proposedTimeSlotRepository;

    @Autowired
    public ProposedTimeSlotController(ProposedTimeSlotRepository proposedTimeSlotRepository) {
        this.proposedTimeSlotRepository = proposedTimeSlotRepository;
    }
    @Autowired
    private ProposedTimeSlotMapper proposedTimeSlotMapper;

    @GetMapping
    @Operation(summary = "Get all proposed time slots", description = "Retrieves a list of all proposed time slots in the system.")
    public ResponseEntity<List<ProposedTimeSlotResponseDTO>> getProposedTimeSlot() {
        List<ProposedTimeSlotResponseDTO> proposedTimeSlotResponseDTOs = proposedTimeSlotMapper.toDtoList(proposedTimeSlotRepository.findAll());
        return new ResponseEntity<>(proposedTimeSlotResponseDTOs, HttpStatus.CREATED);
    }

//    @PostMapping
//    @Operation(summary = "Add a lesson", description = "Adds a lesson to the system.")
//    public ResponseEntity<LessonResponseDTO> addLesson(@RequestBody LessonCreateDTO createDTO) {
//        // Get the activity
//        Activity activity = activityRepository.findById(createDTO.getActivityId())
//                .orElseThrow(() -> new ResponseStatusException(
//                        HttpStatus.NOT_FOUND, "Activity not found with id " + createDTO.getActivityId()));
//
//        Lesson newLesson = new Lesson(createDTO, activity);
//
//        Lesson savedLesson = lessonRepository.save(newLesson);
//
//        LessonResponseDTO responseDTO = new LessonResponseDTO(savedLesson, new ActivityResponseDTO());
//
//        return new ResponseEntity<>(responseDTO, HttpStatus.CREATED);
//    }
}
