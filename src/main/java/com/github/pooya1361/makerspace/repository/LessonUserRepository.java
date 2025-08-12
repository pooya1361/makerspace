package com.github.pooya1361.makerspace.repository;

import com.github.pooya1361.makerspace.model.LessonUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LessonUserRepository extends JpaRepository<LessonUser, Long> {
    List<LessonUser> findByUserId(Long userId);
}