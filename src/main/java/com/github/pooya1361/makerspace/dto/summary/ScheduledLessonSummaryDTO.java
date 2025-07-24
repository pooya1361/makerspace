package com.github.pooya1361.makerspace.dto.summary;

import com.github.pooya1361.makerspace.dto.response.LessonResponseDTO;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.OffsetDateTime;
import java.util.Optional;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ScheduledLessonSummaryDTO {
    private Long id;
    private Optional<OffsetDateTime> startTime;
    private Long durationInMinutes;
    private LessonResponseDTO lesson;
    private UserSummaryDTO instructor;
}