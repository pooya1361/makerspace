package com.github.pooya1361.makerspace.config;

import com.github.pooya1361.makerspace.model.User; // Import your User model
import com.github.pooya1361.makerspace.model.enums.UserType; // Import your UserType enum
import com.github.pooya1361.makerspace.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataSeeder {

    @Bean
    @Profile({"dev", "demo", "docker"}) // Only run in specific profiles
    CommandLineRunner initDatabase(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        return args -> {
            System.out.println("🌱 Seeding demo users for portfolio demonstration...");

            // Create demo users with better passwords
            createDemoUserIfNotExists(userRepository, passwordEncoder,
                    "demo.student@makerspace.com", "Student", "Demo", "DemoPass2024!", UserType.NORMAL);

            createDemoUserIfNotExists(userRepository, passwordEncoder,
                    "demo.instructor@makerspace.com", "Instructor", "Demo", "DemoPass2024!", UserType.INSTRUCTOR);

            createDemoUserIfNotExists(userRepository, passwordEncoder,
                    "demo.admin@makerspace.com", "Admin", "Demo", "DemoPass2024!", UserType.ADMIN);

            System.out.println("✅ Demo users created. Login with:");
            System.out.println("   Student: demo.student@makerspace.com / DemoPass2024!");
            System.out.println("   Instructor: demo.instructor@makerspace.com / DemoPass2024!");
            System.out.println("   Admin: demo.admin@makerspace.com / DemoPass2024!");
        };
    }

    private void createDemoUserIfNotExists(UserRepository userRepository, PasswordEncoder passwordEncoder,
                                           String email, String firstName, String lastName, String password, UserType userType) {
        if (userRepository.findByEmail(email).isEmpty()) {
            User user = User.builder()
                    .firstName(firstName)
                    .lastName(lastName)
                    .email(email)
                    .password(passwordEncoder.encode(password))
                    .userType(userType)
                    .build();
            userRepository.save(user);
        }
    }
}