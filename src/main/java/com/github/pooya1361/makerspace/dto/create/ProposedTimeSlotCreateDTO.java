package com.github.pooya1361.makerspace.dto.create;

import com.github.pooya1361.makerspace.model.ScheduledLesson;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProposedTimeSlotCreateDTO {
    private Long id;
    @NotNull(message = "Start time cannot be null")
    private LocalDateTime proposedStartTime;
    @NotNull(message = "Scheduled lesson cannot be null")
    private Long scheduledLessonId;

}