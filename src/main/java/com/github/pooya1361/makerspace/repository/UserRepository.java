package com.github.pooya1361.makerspace.repository;

import com.github.pooya1361.makerspace.dto.response.UserResponseDTO;
import com.github.pooya1361.makerspace.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository // Optional but good practice for clarity
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
}