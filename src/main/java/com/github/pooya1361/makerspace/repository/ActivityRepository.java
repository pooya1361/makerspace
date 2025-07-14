package com.github.pooya1361.makerspace.repository;

import com.github.pooya1361.makerspace.dto.ActivityResponseDTO;
import com.github.pooya1361.makerspace.model.Activity;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Repository;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Repository
public interface ActivityRepository extends JpaRepository<Activity, Long> {
    @EntityGraph(attributePaths = {"workshop"})
    List<Activity> findAll();
}