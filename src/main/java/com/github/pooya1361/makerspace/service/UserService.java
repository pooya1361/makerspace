// src/main/java/com/github/pooya1361/makerspace/service/UserService.java
package com.github.pooya1361.makerspace.service;

import com.github.pooya1361.makerspace.dto.create.UserCreateDTO;
import com.github.pooya1361.makerspace.dto.response.UserResponseDTO;
import com.github.pooya1361.makerspace.mapper.UserMapper;
import com.github.pooya1361.makerspace.model.User;
import com.github.pooya1361.makerspace.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, UserMapper userMapper, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.userMapper = userMapper;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    public UserResponseDTO createUser(UserCreateDTO userCreateDTO) {
        User user = userMapper.toEntity(userCreateDTO);
        User savedUser = userRepository.save(user);
        return userMapper.toDto(savedUser);
    }

    public List<UserResponseDTO> getAllUsers() {
        return userMapper.toDtoList(userRepository.findAll());
    }

    public Optional<UserResponseDTO> getUserById(Long id) {
        return userRepository.findById(id)
                .map(userMapper::toDto);
    }

    @Transactional
    public UserResponseDTO updateUser(Long id, UserCreateDTO userUpdateDTO) {
        User existingUser = userRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("User not found with ID: " + id));

        userMapper.updateUserFromDto(userUpdateDTO, existingUser);

        // Handle password encoding separately if password is being updated
        if (userUpdateDTO.getPassword() != null && !userUpdateDTO.getPassword().trim().isEmpty()) {
            existingUser.setPassword(passwordEncoder.encode(userUpdateDTO.getPassword()));
        }

        User updatedUser = userRepository.save(existingUser);
        return userMapper.toDto(updatedUser);
    }

    @Transactional
    public void deleteUser(Long id) {
        if (!userRepository.existsById(id)) {
            throw new EntityNotFoundException("User not found with ID: " + id);
        }
        // Consider cascading deletes or manual deletion of related data (taughtLessons, votes)
        userRepository.deleteById(id);
    }
}