package com.github.pooya1361.makerspace.dto;

import com.github.pooya1361.makerspace.model.Lesson;
import com.github.pooya1361.makerspace.model.ProposedTimeSlot;
import com.github.pooya1361.makerspace.model.ScheduledLesson;
import com.github.pooya1361.makerspace.model.User;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ScheduledLessonResponseDTO {

    private Long id;
    private LocalDateTime startTime;
    private Long durationInMinutes;
    private LessonResponseDTO lesson;
    private UserResponseDTO instructor;
//    private Set<ProposedTimeSlotResponseDTO> proposedTimeSlots;
}
