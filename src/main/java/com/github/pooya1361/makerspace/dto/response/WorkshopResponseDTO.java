package com.github.pooya1361.makerspace.dto.response;

import com.github.pooya1361.makerspace.dto.summary.ActivitySummaryDTO;
import com.github.pooya1361.makerspace.model.Activity;
import com.github.pooya1361.makerspace.model.Workshop;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class WorkshopResponseDTO {
    private Long id;
    private String name;
    private String description;
    private double size;
    private List<ActivitySummaryDTO> activities;
}
