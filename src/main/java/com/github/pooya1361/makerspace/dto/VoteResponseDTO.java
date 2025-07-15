package com.github.pooya1361.makerspace.dto;

import com.github.pooya1361.makerspace.model.Vote;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class VoteResponseDTO {
    private Long id;
    private ProposedTimeSlotSummaryDTO  proposedTimeSlot;
    private UserSummaryDTO  user;
}
