package com.github.pooya1361.makerspace.dto.response;

import com.github.pooya1361.makerspace.dto.summary.ProposedTimeSlotSummaryDTO;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ScheduledLessonResponseDTO {

    private Long id;
    private LocalDateTime startTime;
    private Long durationInMinutes;
    private LessonResponseDTO lesson;
    private UserResponseDTO instructor;
    private List<ProposedTimeSlotSummaryDTO> proposedTimeSlots;
}
