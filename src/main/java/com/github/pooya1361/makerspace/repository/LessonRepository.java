package com.github.pooya1361.makerspace.repository;

import com.github.pooya1361.makerspace.dto.LessonResponseDTO;
import com.github.pooya1361.makerspace.model.Lesson;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Repository;
import org.springframework.web.server.ResponseStatusException;

@Repository
public interface LessonRepository extends JpaRepository<Lesson, Long> { }