package com.github.pooya1361.makerspace.dto.response;

import com.github.pooya1361.makerspace.model.User;
import com.github.pooya1361.makerspace.model.enums.UserType;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data // Lombok: Generates getters, setters, toString, equals, and hashCode
@NoArgsConstructor // Lombok: Generates a no-argument constructor
@AllArgsConstructor // Lombok: Generates a constructor with all fields
public class UserResponseDTO {

    private Long id;
    private String firstName;
    private String lastName;
    private String email;
    private UserType userType;
}
