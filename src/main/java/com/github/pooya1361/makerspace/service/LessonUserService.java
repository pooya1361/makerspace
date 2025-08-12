// src/main/java/com/github/pooya1361/makerspace/service/LessonUserService.java
package com.github.pooya1361.makerspace.service;

import com.github.pooya1361.makerspace.dto.create.LessonUserCreateDTO;
import com.github.pooya1361.makerspace.dto.response.LessonUserResponseDTO;
import com.github.pooya1361.makerspace.mapper.LessonUserMapper;
import com.github.pooya1361.makerspace.model.Activity;
import com.github.pooya1361.makerspace.model.Lesson;
import com.github.pooya1361.makerspace.model.LessonUser;
import com.github.pooya1361.makerspace.model.User;
import com.github.pooya1361.makerspace.repository.ActivityRepository;
import com.github.pooya1361.makerspace.repository.LessonRepository;
import com.github.pooya1361.makerspace.repository.LessonUserRepository;
import com.github.pooya1361.makerspace.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@AllArgsConstructor
public class LessonUserService {

    private final LessonRepository lessonRepository;
    private final LessonUserRepository lessonUserRepository;
    private final UserRepository userRepository;
    private final LessonUserMapper lessonUserMapper;

    @Transactional
    public LessonUserResponseDTO createLessonUser(LessonUserCreateDTO createDTO) {
        LessonUser lessonUser = lessonUserMapper.toEntity(createDTO);

        if (createDTO.getLessonId() != null) {
            Lesson lesson = lessonRepository.findById(createDTO.getLessonId())
                    .orElseThrow(() -> new EntityNotFoundException("Lesson not found with ID: " + createDTO.getLessonId()));
            lessonUser.setLesson(lesson);
        }

        if (createDTO.getUserId() != null) {
            User user = userRepository.findById(createDTO.getUserId())
                    .orElseThrow(() -> new EntityNotFoundException("User not found with ID: " + createDTO.getUserId()));
            lessonUser.setUser(user);
        }

        LessonUser savedLessonUser = lessonUserRepository.save(lessonUser);
        return lessonUserMapper.toDto(savedLessonUser);
    }

    public List<LessonUserResponseDTO> getAllLessonUsers() {
        return lessonUserMapper.toDtoList(lessonUserRepository.findAll());
    }

    public Optional<LessonUserResponseDTO> getLessonUserById(Long id) {
        return lessonUserRepository.findById(id)
                .map(lessonUserMapper::toDto);
    }

    public List<LessonUserResponseDTO> getLessonUserByUserId(Long userId) {
        List<LessonUser> lessonUsers = lessonUserRepository.findByUserId(userId);
        return lessonUserMapper.toDtoList(lessonUsers);
    }

    @Transactional
    public LessonUserResponseDTO updateLessonUser(Long id, LessonUserCreateDTO updateDTO) {
        LessonUser existingLessonUser = lessonUserRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("LessonUser not found with ID: " + id));

        lessonUserMapper.updateLessonUserFromDto(updateDTO, existingLessonUser);

        existingLessonUser.setLesson(null);
        if (updateDTO.getLessonId() != null) {
            Lesson lesson = lessonRepository.findById(updateDTO.getLessonId())
                    .orElseThrow(() -> new EntityNotFoundException("Lesson not found with ID: " + updateDTO.getLessonId()));
            existingLessonUser.setLesson(lesson);
        }

        if (updateDTO.getUserId() != null) {
            User user = userRepository.findById(updateDTO.getUserId())
                    .orElseThrow(() -> new EntityNotFoundException("User not found with ID: " + updateDTO.getUserId()));
            existingLessonUser.setUser(user);
        }

        LessonUser updatedLessonUser = lessonUserRepository.save(existingLessonUser);
        return lessonUserMapper.toDto(updatedLessonUser);
    }

    @Transactional
    public void deleteLessonUser(Long id) {
        if (!lessonUserRepository.existsById(id)) {
            throw new EntityNotFoundException("LessonUser not found with ID: " + id);
        }
        // Consider cascading deletes or manual deletion of related ScheduledLessonUsers here
        lessonUserRepository.deleteById(id);
    }
}