package com.github.pooya1361.makerspace.dto.create;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class WorkshopCreateDTO {
    @NotNull(message = "Name cannot be null")
    private String name;
    private String description;
    private double size;

}
