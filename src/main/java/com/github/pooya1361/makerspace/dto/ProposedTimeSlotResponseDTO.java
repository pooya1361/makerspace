package com.github.pooya1361.makerspace.dto;

import com.github.pooya1361.makerspace.model.ProposedTimeSlot;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProposedTimeSlotResponseDTO {
    private Long id;
    private LocalDateTime proposedStartTime;
    private ScheduledLessonResponseDTO scheduledLesson;
    private Set<VoteResponseDTO> votes = new HashSet<>();

}
