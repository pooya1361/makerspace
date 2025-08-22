package com.github.pooya1361.makerspace.dto.create;

import com.github.pooya1361.makerspace.model.Lesson;
import com.github.pooya1361.makerspace.model.User;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.OffsetDateTime;
import java.util.Optional;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ScheduledLessonCreateDTO {
    private Long id;
    private Optional<OffsetDateTime> startTime;
    private Long durationInMinutes;
    @NotNull(message = "Lesson id cannot be null")
    private Long lessonId;
    @NotNull(message = "Instructor user id cannot be null")
    private Long instructorUserId;
}