package com.github.pooya1361.makerspace.dto.response;

import com.github.pooya1361.makerspace.model.Lesson;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LessonResponseDTO {

    private Long id;
    private String name;
    private String description;
    private ActivityResponseDTO activity;
}
