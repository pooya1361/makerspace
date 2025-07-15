package com.github.pooya1361.makerspace.dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class VoteCreateDTO {
    @NotNull(message = "User ID cannot be null")
    private Long userId;

    @NotNull(message = "Proposed Time Slot ID cannot be null")
    private Long proposedTimeSlotId;
}