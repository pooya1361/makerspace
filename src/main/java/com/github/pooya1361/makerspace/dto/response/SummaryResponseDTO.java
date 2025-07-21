// com.github.pooya1361.makerspace.dto.response.SummaryResponseDTO
package com.github.pooya1361.makerspace.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SummaryResponseDTO {
    private long totalWorkshops;
    private long totalActivities;
    private long totalLessons;
    private long totalScheduledLessons;
    // Add more counts if needed, e.g., totalUsers, totalVotes
}