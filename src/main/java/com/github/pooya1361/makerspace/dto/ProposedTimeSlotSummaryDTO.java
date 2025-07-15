// src/main/java/com/github/pooya1361/makerspace/dto/ProposedTimeSlotSummaryDTO.java
package com.github.pooya1361.makerspace.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProposedTimeSlotSummaryDTO {
    private Long id;
    private LocalDateTime proposedStartTime;
}