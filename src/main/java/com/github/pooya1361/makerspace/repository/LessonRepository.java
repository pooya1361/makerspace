package com.github.pooya1361.makerspace.repository;

import com.github.pooya1361.makerspace.model.Lesson;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LessonRepository extends JpaRepository<Lesson, Long> { }