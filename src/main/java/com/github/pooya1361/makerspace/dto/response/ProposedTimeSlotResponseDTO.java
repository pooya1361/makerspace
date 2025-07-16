package com.github.pooya1361.makerspace.dto.response;

import com.github.pooya1361.makerspace.dto.summary.ScheduledLessonSummaryDTO;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProposedTimeSlotResponseDTO {
    private Long id;
    private LocalDateTime proposedStartTime;
    private ScheduledLessonSummaryDTO scheduledLesson;
    // private Set<VoteResponseDTO> votes = new HashSet<>();
}
