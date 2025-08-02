package com.github.pooya1361.makerspace.auth; // Adjust package

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class RegisterRequest {
    private String firstName;
    private String lastName;
    private String email; // This is now the identifier
    private String password;
    private String userType; // If you're passing role/userType in registration
}