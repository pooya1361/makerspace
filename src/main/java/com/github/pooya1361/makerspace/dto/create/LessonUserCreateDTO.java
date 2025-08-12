package com.github.pooya1361.makerspace.dto.create;

import com.github.pooya1361.makerspace.dto.response.LessonResponseDTO;
import com.github.pooya1361.makerspace.dto.summary.UserSummaryDTO;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LessonUserCreateDTO {
    private Long id;
    @NotNull(message = "Lesson cannot be null")
    private Long lessonId;
    @NotNull(message = "User cannot be null")
    private Long userId;
    private boolean acquired;

}
