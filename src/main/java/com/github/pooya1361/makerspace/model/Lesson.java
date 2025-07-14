package com.github.pooya1361.makerspace.model;

import com.github.pooya1361.makerspace.dto.LessonCreateDTO;
import com.github.pooya1361.makerspace.repository.ActivityRepository;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import java.time.Duration;
import java.time.LocalDateTime;

@Entity
@Table(name = "lessons")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Lesson {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = true)
    private String description;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="activity_id")
    private Activity activity;

    public Lesson(LessonCreateDTO createDTO, Activity activity) {
        this.setName(createDTO.getName());
        this.setDescription(createDTO.getDescription());
        this.setActivity(activity);
    }

}
