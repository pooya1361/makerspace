package com.github.pooya1361.makerspace.dto.create;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ActivityCreateDTO {
    @NotNull(message = "Name cannot be null")
    private String name;
    private String description;

    @NotNull(message = "Workshop ID cannot be null")
    private Long workshopId;
}