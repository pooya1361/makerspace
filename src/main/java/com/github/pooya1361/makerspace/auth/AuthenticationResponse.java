package com.github.pooya1361.makerspace.auth; // Adjust package

import com.github.pooya1361.makerspace.dto.response.UserResponseDTO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuthenticationResponse {
    private String message; // e.g., "Login successful", "Registration successful"
    private UserResponseDTO user;
}