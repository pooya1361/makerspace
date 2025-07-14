package com.github.pooya1361.makerspace.repository;

import com.github.pooya1361.makerspace.model.Lesson;
import com.github.pooya1361.makerspace.model.ProposedTimeSlot;
import com.github.pooya1361.makerspace.model.ScheduledLesson;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProposedTimeSlotRepository extends JpaRepository<ProposedTimeSlot, Long> {
    @EntityGraph(attributePaths = {"scheduledLesson", "votes"})
    List<ProposedTimeSlot> findAll();
}