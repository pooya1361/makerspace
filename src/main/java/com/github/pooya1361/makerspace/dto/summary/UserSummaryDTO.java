// src/main/java/com/github/pooya1361/makerspace/dto/UserSummaryDTO.java
package com.github.pooya1361.makerspace.dto.summary;

import com.github.pooya1361.makerspace.model.enums.UserType;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserSummaryDTO {
    private Long id;
    private String username;
    private UserType userType;
}