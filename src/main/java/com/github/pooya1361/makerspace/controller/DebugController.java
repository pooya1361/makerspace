package com.github.pooya1361.makerspace.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

// Create a new controller or add to an existing one
@RestController
@RequestMapping("/api/debug")
public class DebugController {

    @GetMapping("/authorities")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> debugAuthorities(Authentication authentication) {
        return ResponseEntity.ok(Map.of(
                "username", authentication.getName(),
                "authorities", authentication.getAuthorities(),
                "principal", authentication.getPrincipal()
        ));
    }
}