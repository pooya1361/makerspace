package com.github.pooya1361.makerspace.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ScheduledLessonResponseDTO {

    private Long id;
    private LocalDateTime startTime;
    private Long durationInMinutes;
    private LessonResponseDTO lesson;
    private UserResponseDTO instructor;
}
