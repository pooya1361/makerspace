package com.github.pooya1361.makerspace.repository;

import com.github.pooya1361.makerspace.model.LessonUser;
import com.github.pooya1361.makerspace.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LessonUserRepository extends JpaRepository<LessonUser, Long> {
    List<LessonUser> findByUserId(Long userId);

    // *** ADD THIS NEW METHOD ***
    /**
     * Get all users interested in a specific lesson
     */
    @Query("SELECT lu.user FROM LessonUser lu WHERE lu.lesson.id = :lessonId")
    List<User> findUsersByLessonId(@Param("lessonId") Long lessonId);
}