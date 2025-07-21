package com.github.pooya1361.makerspace.repository;

import com.github.pooya1361.makerspace.model.ScheduledLesson;
import com.github.pooya1361.makerspace.model.User;
import com.github.pooya1361.makerspace.model.Workshop;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface WorkshopRepository extends JpaRepository<Workshop, Long> {
    @EntityGraph(attributePaths = {"activities"})
    List<Workshop> findAll();
}