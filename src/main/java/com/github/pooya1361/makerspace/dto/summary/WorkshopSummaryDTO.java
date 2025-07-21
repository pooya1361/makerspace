package com.github.pooya1361.makerspace.dto.summary;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class WorkshopSummaryDTO {
    private Long id;
    private String name;
    private String description;
    private double size;
}
