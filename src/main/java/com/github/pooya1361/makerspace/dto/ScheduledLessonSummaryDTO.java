package com.github.pooya1361.makerspace.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ScheduledLessonSummaryDTO {
    private Long id;
    private LocalDateTime startTime;
    private Long durationInMinutes;
}