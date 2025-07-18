package com.github.pooya1361.makerspace.dto.response;

import com.github.pooya1361.makerspace.dto.summary.ScheduledLessonSummaryDTO;
import com.github.pooya1361.makerspace.dto.summary.VoteSummaryDTO;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProposedTimeSlotResponseDTO {
    private Long id;
    private LocalDateTime proposedStartTime;
    private ScheduledLessonSummaryDTO scheduledLesson;
    private List<VoteSummaryDTO> votes;
}
