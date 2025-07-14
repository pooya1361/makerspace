package com.github.pooya1361.makerspace.dto;

import com.github.pooya1361.makerspace.model.Activity;
import com.github.pooya1361.makerspace.model.Workshop;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ActivityResponseDTO {
    private Long id;
    private String name;
    private String description;
    private Workshop workshop;

    public ActivityResponseDTO(Activity activity) {
        this.id = activity.getId();
        this.name = activity.getName();
        this.description = activity.getDescription();

        this.workshop = null;
        Workshop workshop = activity.getWorkshop();
        if (workshop != null) {
            this.workshop = new Workshop(workshop);
        }
    }

}
