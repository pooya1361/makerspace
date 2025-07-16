package com.github.pooya1361.makerspace.dto.create;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LessonCreateDTO {
    private String name;
    private String description;
    private Long activityId;
}