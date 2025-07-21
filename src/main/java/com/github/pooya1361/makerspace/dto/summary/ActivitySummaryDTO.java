package com.github.pooya1361.makerspace.dto.summary;

import com.github.pooya1361.makerspace.dto.response.WorkshopResponseDTO;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ActivitySummaryDTO {
    private Long id;
    private String name;
    private String description;
}
