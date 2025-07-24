package com.github.pooya1361.makerspace.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "proposed_time_slots")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProposedTimeSlot {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "proposed_start_time", nullable = false)
    private OffsetDateTime proposedStartTime;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "scheduled_lesson_id", nullable = false)
    private ScheduledLesson scheduledLesson;

    // We can count the votes for this time slot via a bidirectional relationship
    // MappedBy is on the side that owns the foreign key
    @OneToMany(mappedBy = "proposedTimeSlot", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    @EqualsAndHashCode.Exclude
    private Set<Vote> votes = new HashSet<>();
}
