package com.github.pooya1361.makerspace.dto;

import com.github.pooya1361.makerspace.model.Activity;
import com.github.pooya1361.makerspace.model.Lesson;
import com.github.pooya1361.makerspace.model.User;
import com.github.pooya1361.makerspace.model.enums.UserType;
import com.github.pooya1361.makerspace.repository.ActivityRepository;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LessonResponseDTO {

    private Long id;
    private String name;
    private String description;
    private ActivityResponseDTO activity;

    public LessonResponseDTO(Lesson lesson, ActivityResponseDTO activity) {
        this.id = lesson.getId();
        this.name = lesson.getName();
        this.description = lesson.getDescription();
        this.activity = activity;
    }
}
