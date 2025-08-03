package com.github.pooya1361.makerspace.config;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.time.LocalDateTime;
import java.util.Map;

@ControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<?> handleDataIntegrityViolation(DataIntegrityViolationException ex) {
        String message = ex.getMessage();

        // Check for unique constraint violation (common patterns)
        if (message != null && (
                message.contains("unique constraint") ||
                        message.contains("Duplicate entry") ||
                        message.contains("duplicate key") ||
                        message.toLowerCase().contains("user_id") ||
                        message.toLowerCase().contains("time_slot_id"))) {

            return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of(
                    "error", "Duplicate Vote",
                    "message", "You have already voted for this time slot.",
                    "status", 409,
                    "timestamp", LocalDateTime.now()
            ));
        }

        // Log the full exception to understand what's happening
        System.err.println("DataIntegrityViolationException: " + ex.getMessage());
        if (ex.getCause() != null) {
            System.err.println("Cause: " + ex.getCause().getMessage());
        }

        // Generic data integrity violation
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of(
                "error", "Data Integrity Violation",
                "message", "Invalid data provided: " + (message != null ? message : "Unknown error"),
                "status", 400,
                "timestamp", LocalDateTime.now()
        ));
    }
    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<?> handleAccessDenied(AccessDeniedException ex) {
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of(
                "error", "Access Denied",
                "message", "You don't have permission to perform this action. Admin privileges required.",
                "status", 403,
                "timestamp", LocalDateTime.now()
        ));
    }

    @ExceptionHandler(AuthenticationException.class)
    public ResponseEntity<?> handleAuthenticationException(AuthenticationException ex) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of(
                "error", "Authentication Failed",
                "message", "Please log in to access this resource.",
                "status", 401,
                "timestamp", LocalDateTime.now()
        ));
    }

    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<?> handleBadCredentials(BadCredentialsException ex) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of(
                "error", "Invalid Credentials",
                "message", "The username or password you entered is incorrect.",
                "status", 401,
                "timestamp", LocalDateTime.now()
        ));
    }
}