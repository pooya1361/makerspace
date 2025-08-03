package com.github.pooya1361.makerspace.security;

import java.io.IOException;
import java.util.Arrays;
import java.util.Map;
import java.util.Optional;

import org.springframework.http.ResponseEntity;
import org.springframework.lang.NonNull;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor; 

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain
    ) throws ServletException, IOException {
        final String authHeader = request.getHeader("Authorization");
        final String jwt;
        final String userEmail;

        System.out.println("JWT Filter: Processing request for " + request.getRequestURI());

        Cookie[] cookies = request.getCookies();
        if (cookies == null) {
            System.out.println("No cookies found in request.");
        } else {
            for (Cookie cookie : cookies) {
                System.out.println("Cookie: " + cookie.getName() + " = " + cookie.getValue());
            }
        }

        // 1. Attempt to get JWT from Authorization header (for client-side JS or other clients)
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            jwt = authHeader.substring(7);
            System.out.println("JWT Filter: Found JWT in Authorization header.");
        } else {
            // 2. If not in Authorization header, try to get it from a cookie
            jwt = getJwtFromCookie(request);
            if (jwt != null) {
                System.out.println("JWT Filter: Found JWT in 'accessToken' cookie.");
            } else {
                System.out.println("JWT Filter: No JWT found in Authorization header or 'accessToken' cookie.");
            }
        }

        // If no JWT found, proceed down the filter chain without authentication
        if (jwt == null) {
            filterChain.doFilter(request, response);
            return;
        }

        // Extract user email from JWT
        try {
            userEmail = jwtService.extractUserEmail(jwt);
        } catch (Exception e) {
            System.err.println("JWT Filter: Error extracting username from JWT: " + e.getMessage());
            // If token is invalid/malformed, clear context and proceed
            SecurityContextHolder.clearContext();
            filterChain.doFilter(request, response);
            return;
        }


        // If user email is found and no authentication is currently set in SecurityContext
        if (userEmail != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            UserDetails userDetails = null;
            try {
                userDetails = this.userDetailsService.loadUserByUsername(userEmail);
            } catch (Exception e) {
                System.err.println("JWT Filter: Error loading UserDetails for " + userEmail + ": " + e.getMessage());
                SecurityContextHolder.clearContext();
                filterChain.doFilter(request, response);
                return;
            }


            // Validate token and authenticate
            if (jwtService.isTokenValid(jwt, userDetails)) {
                UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                        userDetails,
                        null, // Credentials are null for JWT authentication after validation
                        userDetails.getAuthorities()
                );
                authToken.setDetails(
                        new WebAuthenticationDetailsSource().buildDetails(request)
                );
                // Set authentication in SecurityContext
                SecurityContextHolder.getContext().setAuthentication(authToken);
                System.out.println("JWT Filter: Successfully authenticated user: " + userEmail);
            } else {
                System.out.println("JWT Filter: Token is invalid for user: " + userEmail);
                SecurityContextHolder.clearContext(); // Clear context if token is invalid
            }
        } else if (userEmail != null) {
            System.out.println("JWT Filter: User email found, but authentication already exists in SecurityContext.");
        }

        filterChain.doFilter(request, response);
    }

    // Helper method to extract JWT from "accessToken" cookie
    private String getJwtFromCookie(HttpServletRequest request) {
        if (request.getCookies() == null) {
            System.out.println("JWT Filter: No cookies found in request.");
            return null;
        }
        System.out.println("JWT Filter: Found " + request.getCookies().length + " cookies.");
        Optional<Cookie> accessTokenCookie = Arrays.stream(request.getCookies())
                .filter(cookie -> "accessToken".equals(cookie.getName()))
                .findFirst();

        if (accessTokenCookie.isPresent()) {
            System.out.println("JWT Filter: 'accessToken' cookie found. Value length: " + accessTokenCookie.get().getValue().length());
            return accessTokenCookie.get().getValue();
        } else {
            System.out.println("JWT Filter: 'accessToken' cookie not found among available cookies.");
            // Log all cookie names for debugging
            Arrays.stream(request.getCookies()).forEach(c -> System.out.println("  - Cookie name: " + c.getName()));
        }
        return null;
    }
}