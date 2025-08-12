package com.github.pooya1361.makerspace.repository;

import com.github.pooya1361.makerspace.model.Lesson;
import com.github.pooya1361.makerspace.model.ScheduledLesson;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.List;

@Repository
public interface ScheduledLessonRepository extends JpaRepository<ScheduledLesson, Long> {
    @EntityGraph(attributePaths = {"lesson", "instructor", "proposedTimeSlots"})
    List<ScheduledLesson> findAll();

    List<ScheduledLesson> findByLessonIdInAndStartTimeIsNull(Collection<Long> lessonIds);
}