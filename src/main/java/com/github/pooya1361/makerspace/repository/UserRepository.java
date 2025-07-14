package com.github.pooya1361.makerspace.repository;

import com.github.pooya1361.makerspace.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository // Optional but good practice for clarity
public interface UserRepository extends JpaRepository<User, Long> {
    // JpaRepository provides methods like save(), findById(), findAll(), deleteById(), etc.

    // You can add custom query methods here, e.g.:
    // Optional<User> findByUsername(String username);
    // List<User> findByEmailContaining(String text);
}