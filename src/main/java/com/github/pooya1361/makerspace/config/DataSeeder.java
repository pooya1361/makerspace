package com.github.pooya1361.makerspace.config;

import com.github.pooya1361.makerspace.model.User; // Import your User model
import com.github.pooya1361.makerspace.model.enums.UserType; // Import your UserType enum
import com.github.pooya1361.makerspace.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataSeeder {

    @Bean
    CommandLineRunner initDatabase(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        return args -> {
            // Create a student user
            if (userRepository.findByEmail("student@example.com").isEmpty()) {
                User student = User.builder()
                        .firstName("student")
                        .lastName("student")
                        .email("student@example.com") // Add email
                        .password(passwordEncoder.encode("password"))
                        .userType(UserType.NORMAL) // Assign UserType.NORMAL for a standard student
                        .build();
                userRepository.save(student);
                System.out.println("Created student user: student/password (Type: NORMAL)");
            }

            // Create an instructor user
            if (userRepository.findByEmail("instructor@example.com").isEmpty()) {
                User instructor = User.builder()
                        .firstName("instructor")
                        .lastName("instructor")
                        .email("instructor@example.com") // Add email
                        .password(passwordEncoder.encode("password"))
                        .userType(UserType.INSTRUCTOR) // Assign UserType.INSTRUCTOR
                        .build();
                userRepository.save(instructor);
                System.out.println("Created instructor user: instructor/password (Type: INSTRUCTOR)");
            }

            // Create an admin user
            if (userRepository.findByEmail("admin@example.com").isEmpty()) {
                User admin = User.builder()
                        .firstName("admin")
                        .lastName("admin")
                        .email("admin@example.com") // Add email
                        .password(passwordEncoder.encode("password"))
                        .userType(UserType.ADMIN) // Assign UserType.ADMIN
                        .build();
                userRepository.save(admin);
                System.out.println("Created admin user: admin/password (Type: ADMIN)");
            }

            // Example for MODERATOR or SUPERADMIN if you choose to use them
            if (userRepository.findByEmail("moderator@example.com").isEmpty()) {
                User moderator = User.builder()
                        .firstName("moderator")
                        .lastName("moderator")
                        .email("moderator@example.com")
                        .password(passwordEncoder.encode("password"))
                        .userType(UserType.INSTRUCTOR)
                        .build();
                userRepository.save(moderator);
                System.out.println("Created moderator user: moderator/password (Type: MODERATOR)");
            }

            if (userRepository.findByEmail("superadmin@example.com").isEmpty()) {
                User superadmin = User.builder()
                        .firstName("superadmin")
                        .lastName("superadmin")
                        .email("superadmin@example.com")
                        .password(passwordEncoder.encode("password"))
                        .userType(UserType.SUPERADMIN)
                        .build();
                userRepository.save(superadmin);
                System.out.println("Created superadmin user: superadmin/password (Type: SUPERADMIN)");
            }
        };
    }
}