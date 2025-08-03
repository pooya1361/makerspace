package com.github.pooya1361.makerspace.auth; // Adjust package

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.github.pooya1361.makerspace.mapper.UserMapper;
import com.github.pooya1361.makerspace.model.User;
import com.github.pooya1361.makerspace.model.enums.UserType;
import com.github.pooya1361.makerspace.repository.UserRepository;
import com.github.pooya1361.makerspace.security.JwtService; // Your JwtService

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor; // Make sure Lombok is imported
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthenticationController {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;
    private final UserMapper userMapper;

    // Register method (example, ensure it's present in your code)
    @PostMapping("/register")
    public ResponseEntity<AuthenticationResponse> register(
            @RequestBody RegisterRequest request
    ) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body(AuthenticationResponse.builder().message("Email already registered").build());
        }
        var user = User.builder()
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .userType(UserType.NORMAL) // Assign a default role
                .build();
        userRepository.save(user);
        return ResponseEntity.ok(AuthenticationResponse.builder().message("Registration successful").build());
    }


    @PostMapping("/login")
    public ResponseEntity<AuthenticationResponse> authenticate(
            @RequestBody AuthenticationRequest request,
            HttpServletResponse response // Inject HttpServletResponse here
    ) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        UserDetails userDetails = (UserDetails) authentication.getPrincipal();

        User user = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found after authentication")); // Should not happen if authentication succeeded
        String jwtToken = jwtService.generateToken(user);

        Cookie cookie = new Cookie("accessToken", jwtToken); // "accessToken" is the name of your cookie
        cookie.setHttpOnly(true); // Prevents client-side JavaScript access
        cookie.setPath("/"); // Makes the cookie available across the entire application
        cookie.setMaxAge(7 * 24 * 60 * 60); // e.g., 7 days in seconds. IMPORTANT: Match JWT expiration!
        cookie.setSecure(false);
        response.addCookie(cookie);

        AuthenticationResponse loginResponse = new AuthenticationResponse();
        loginResponse.setUser(userMapper.toDto(user));
        loginResponse.setMessage("Login successful");
        return ResponseEntity.ok(loginResponse);
    }

    // Logout endpoint to clear the cookie
    @PostMapping("/logout")
    public ResponseEntity<String> logout(HttpServletResponse response) {
        Cookie cookie = new Cookie("accessToken", null); // Create a cookie with null value
        cookie.setHttpOnly(true);
        cookie.setPath("/");
        cookie.setMaxAge(0);
        cookie.setSecure(false);
        response.addCookie(cookie);

        SecurityContextHolder.clearContext();

        return ResponseEntity.ok("Logged out successfully");
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        UserDetails userDetails = (UserDetails) authentication.getPrincipal();

        User user = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.INTERNAL_SERVER_ERROR,
                        "User not found after authentication"
                ));

        AuthenticationResponse loginResponse = new AuthenticationResponse();
        loginResponse.setUser(userMapper.toDto(user));

        return ResponseEntity.ok(loginResponse);
    }
}