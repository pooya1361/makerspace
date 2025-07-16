package com.github.pooya1361.makerspace.dto.response;

import com.github.pooya1361.makerspace.dto.summary.ProposedTimeSlotSummaryDTO;
import com.github.pooya1361.makerspace.dto.summary.UserSummaryDTO;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class VoteResponseDTO {
    private Long id;
    private ProposedTimeSlotSummaryDTO proposedTimeSlot;
    private UserSummaryDTO user;
}
