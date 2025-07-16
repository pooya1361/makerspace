package com.github.pooya1361.makerspace.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;
import java.util.Set;
import java.util.HashSet;

@Entity
@Table(name = "scheduled_lessons")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ScheduledLesson {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "start_time")
    private LocalDateTime startTime;

    @Column(name = "duration_in_minutes", nullable = false)
    private Long durationInMinutes;

    // A ScheduledLesson instance belongs to one Lesson (the course type)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "lesson_id", nullable = false)
    private Lesson lesson;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="instructor_id")
    private User instructor;

    // This will hold the proposed time slots for voting for THIS specific lesson instance
    @OneToMany(mappedBy = "scheduledLesson", cascade = CascadeType.ALL, orphanRemoval = true)
    @EqualsAndHashCode.Exclude
    private Set<ProposedTimeSlot> proposedTimeSlots = new HashSet<>();
}