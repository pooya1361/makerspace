package com.github.pooya1361.makerspace.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.github.pooya1361.makerspace.model.enums.UserType;
import jakarta.persistence.*; // Use jakarta.persistence for Spring Boot 3+
import lombok.Data; // From Lombok, for getters, setters, etc.
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.util.Set;
import java.util.HashSet;

@Entity // Marks this class as a JPA entity, mapped to a database table
@Table(name = "users") // Specifies the name of the database table (singular 'user' is often reserved)
@Data
@NoArgsConstructor // Lombok: Generates a no-argument constructor
@AllArgsConstructor // Lombok: Generates a constructor with all fields
public class User {

    @Id // Marks this field as the primary key
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String username;

    @Column(nullable = false)
    private String email;

    @Column(nullable = false)
    private String password;

    @Enumerated(EnumType.STRING)
    @Column(name = "user_type", nullable = false)
    private UserType userType = UserType.NORMAL;

    @Override
    public String toString() {
        return this.getUsername() + " - " + this.getEmail() + " (" + this.getUserType() + ")";
    }
}

