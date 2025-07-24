// src/main/java/com/github/pooya1361/makerspace/dto/ProposedTimeSlotSummaryDTO.java
package com.github.pooya1361.makerspace.dto.summary;

import com.github.pooya1361.makerspace.dto.response.VoteResponseDTO;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProposedTimeSlotSummaryDTO {
    private Long id;
    private OffsetDateTime proposedStartTime;
    private List<VoteSummaryDTO> votes;
}