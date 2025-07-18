package com.github.pooya1361.makerspace.dto.summary;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class VoteSummaryDTO {
    private Long id;
    private UserSummaryDTO user;
}
