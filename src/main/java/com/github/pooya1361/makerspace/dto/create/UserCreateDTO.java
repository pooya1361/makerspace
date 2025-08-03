package com.github.pooya1361.makerspace.dto.create;

import com.github.pooya1361.makerspace.model.enums.UserType;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserCreateDTO {
    private Long id;
    @NotNull(message = "Firstname cannot be null")
    private String firstName;
    @NotNull(message = "Lastname cannot be null")
    private String lastName;
    @NotNull(message = "Password cannot be null")
    private String password;
    @NotNull(message = "Email cannot be null")
    private String email;
    private UserType userType;

}
