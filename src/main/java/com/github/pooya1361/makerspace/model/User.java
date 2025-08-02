package com.github.pooya1361.makerspace.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.github.pooya1361.makerspace.model.enums.UserType;
import jakarta.persistence.*; // Use jakarta.persistence for Spring Boot 3+
import lombok.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.Collections;
import java.util.Set;
import java.util.HashSet;

@Entity // Marks this class as a JPA entity, mapped to a database table
@Table(name = "users") // Specifies the name of the database table (singular 'user' is often reserved)
@Data
@NoArgsConstructor // Lombok: Generates a no-argument constructor
@AllArgsConstructor // Lombok: Generates a constructor with all fields
@Builder
public class User implements UserDetails {

    @Id // Marks this field as the primary key
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String email;

    @JsonIgnore
    @Column(nullable = false)
    private String password;

    private String firstName;
    private String lastName;

    @Enumerated(EnumType.STRING)
    @Column(name = "user_type", nullable = false)
    private UserType userType = UserType.NORMAL;

    @Override
    public String getUsername() {
        return email; // Spring Security uses this for the unique identifier
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        // Map your single UserType to a Spring Security GrantedAuthority.
        // Spring Security typically expects roles to be prefixed with "ROLE_".
        return Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + this.userType.name()));
    }

    @Override
    public String getPassword() {
        return password;
    }

    // Account expiration, lock, credentials expiration, and enabled status can be managed
    // based on your application's requirements. For most basic setups, these return true.
    @Override
    public boolean isAccountNonExpired() {
        return true; // Account is never expired
    }

    @Override
    public boolean isAccountNonLocked() {
        return true; // Account is never locked
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true; // Credentials (password) are never expired
    }

    @Override
    public boolean isEnabled() {
        return true; // User is always enabled
    }
    @Override
    public String toString() {
        return this.getUsername() + " - " + this.getEmail() + " (" + this.getUserType() + ")";
    }
}

