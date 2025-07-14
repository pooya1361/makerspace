package com.github.pooya1361.makerspace.dto;

import com.github.pooya1361.makerspace.model.Activity;
import com.github.pooya1361.makerspace.model.Workshop;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class WorkshopResponseDTO {
    private Long id;
    private String name;
    private String description;
    private double size;
}
