// com.github.pooya1361.makerspace.controller.SummaryController
package com.github.pooya1361.makerspace.controller;

import com.github.pooya1361.makerspace.dto.response.ScheduledLessonResponseDTO;
import com.github.pooya1361.makerspace.dto.response.SummaryResponseDTO;
import com.github.pooya1361.makerspace.service.SummaryService;
import io.swagger.v3.oas.annotations.Operation;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/summary") // Define your API base path
public class SummaryController {

    private final SummaryService summaryService;

    public SummaryController(SummaryService summaryService) {
        this.summaryService = summaryService;
    }

    @GetMapping // Endpoint: GET /api/summary
    public ResponseEntity<SummaryResponseDTO> getSummary() {
        SummaryResponseDTO summary = summaryService.getOverallSummary();
        return ResponseEntity.ok(summary);
    }

    @GetMapping("/available-lessons")
    @Operation(summary = "Get available lessons for the logged in user", description = "Returns all the lessons that are scheduled and the current user marked them as interested.")
    public ResponseEntity<List<ScheduledLessonResponseDTO>> getAvailableLessons(Authentication authentication) {
        return ResponseEntity.ok(summaryService.getAvailableLessons(authentication));
    }
}