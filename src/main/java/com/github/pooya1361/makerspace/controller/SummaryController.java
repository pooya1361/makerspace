// com.github.pooya1361.makerspace.controller.SummaryController
package com.github.pooya1361.makerspace.controller;

import com.github.pooya1361.makerspace.dto.response.SummaryResponseDTO;
import com.github.pooya1361.makerspace.service.SummaryService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
}