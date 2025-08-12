package com.github.pooya1361.makerspace.dto.response;

import com.github.pooya1361.makerspace.dto.summary.UserSummaryDTO;
import com.github.pooya1361.makerspace.model.Lesson;
import com.github.pooya1361.makerspace.model.User;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LessonUserResponseDTO {
    private Long id;
    private LessonResponseDTO lesson;
    private UserSummaryDTO user;
    private boolean acquired;

}
