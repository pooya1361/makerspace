package com.github.pooya1361.makerspace.repository;

import com.github.pooya1361.makerspace.model.Lesson;
import com.github.pooya1361.makerspace.model.ProposedTimeSlot;
import com.github.pooya1361.makerspace.model.ScheduledLesson;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.OffsetDateTime;
import java.util.List;

@Repository
public interface ProposedTimeSlotRepository extends JpaRepository<ProposedTimeSlot, Long> {
    @EntityGraph(attributePaths = {"scheduledLesson", "votes"})
    List<ProposedTimeSlot> findAll();

    /**
     * Check if any time slots were created recently for this scheduled lesson
     */
    @Query("SELECT COUNT(pts) > 0 FROM ProposedTimeSlot pts " +
            "WHERE pts.scheduledLesson.id = :scheduledLessonId " +
            "AND pts.createdAt >= :cutoffTime")
    boolean existsByScheduledLessonIdAndCreatedAtAfter(
            @Param("scheduledLessonId") Long scheduledLessonId,
            @Param("cutoffTime") OffsetDateTime cutoffTime);

    /**
     * Find the most recent time slot for debugging
     */
    @Query("SELECT pts FROM ProposedTimeSlot pts " +
            "WHERE pts.scheduledLesson.id = :scheduledLessonId " +
            "ORDER BY pts.createdAt DESC")
    List<ProposedTimeSlot> findByScheduledLessonIdOrderByCreatedAtDesc(
            @Param("scheduledLessonId") Long scheduledLessonId,
            Pageable pageable);
}