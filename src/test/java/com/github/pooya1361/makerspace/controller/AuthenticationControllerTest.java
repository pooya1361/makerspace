package com.github.pooya1361.makerspace.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.github.pooya1361.makerspace.auth.AuthenticationController;
import com.github.pooya1361.makerspace.auth.AuthenticationRequest;
import com.github.pooya1361.makerspace.auth.AuthenticationResponse;
import com.github.pooya1361.makerspace.auth.RegisterRequest;
import com.github.pooya1361.makerspace.dto.response.UserResponseDTO;
import com.github.pooya1361.makerspace.mapper.UserMapper;
import com.github.pooya1361.makerspace.model.User;
import com.github.pooya1361.makerspace.model.enums.UserType;
import com.github.pooya1361.makerspace.repository.UserRepository;
import com.github.pooya1361.makerspace.security.JwtService;
import com.github.pooya1361.makerspace.security.SecurityConfig;
import com.github.pooya1361.makerspace.security.JwtAuthenticationFilter;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.FilterType;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.security.test.context.support.WithMockUser; // Keep for other tests

import jakarta.servlet.http.Cookie;
import java.util.Collections;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.hamcrest.Matchers.is;
import static org.hamcrest.Matchers.greaterThan;

@WebMvcTest(
        controllers = AuthenticationController.class,
        excludeFilters = @ComponentScan.Filter(
                type = FilterType.ASSIGNABLE_TYPE,
                classes = {
                        SecurityConfig.class,
                        JwtAuthenticationFilter.class
                }
        )
)
@AutoConfigureMockMvc
class AuthenticationControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private AuthenticationManager authenticationManager;

    @MockBean
    private UserRepository userRepository;

    @MockBean
    private JwtService jwtService;

    @MockBean
    private PasswordEncoder passwordEncoder;

    @MockBean
    private UserMapper userMapper;

    @Autowired
    private ObjectMapper objectMapper;

    private RegisterRequest registerRequest;
    private AuthenticationRequest loginRequest;
    private User testUser;
    private UserResponseDTO testUserResponseDTO;
    private String testJwtToken = "mock.jwt.token";

    @TestConfiguration
    static class TestSecurityConfig {
        @Bean
        public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
            http
                    .csrf(AbstractHttpConfigurer::disable)
                    .httpBasic(AbstractHttpConfigurer::disable)
                    .formLogin(AbstractHttpConfigurer::disable)
                    .exceptionHandling(exceptionHandling -> exceptionHandling
                            .authenticationEntryPoint((request, response, authException) -> response.setStatus(401))
                            .accessDeniedHandler((request, response, accessDeniedException) -> response.setStatus(403))
                    )
                    .authorizeHttpRequests(authorize -> authorize
                            .anyRequest().permitAll()
                    );
            return http.build();
        }
    }

    @BeforeEach
    void setUp() {
        SecurityContextHolder.clearContext();

        registerRequest = RegisterRequest.builder()
                .firstName("New")
                .lastName("User")
                .email("newuser@example.com")
                .password("securepassword")
                .build();

        loginRequest = AuthenticationRequest.builder()
                .email("test@example.com")
                .password("password123")
                .build();

        testUser = User.builder()
                .id(1L)
                .firstName("Test")
                .lastName("User")
                .email("test@example.com")
                .password("encodedPassword123")
                .userType(UserType.NORMAL)
                .build();

        testUserResponseDTO = new UserResponseDTO(
                1L,
                "Test",
                "User",
                "test@example.com",
                UserType.NORMAL
        );

        when(passwordEncoder.encode(anyString())).thenReturn("encodedPassword123");
        when(userMapper.toDto(any(User.class))).thenAnswer(invocation -> {
            User userArg = invocation.getArgument(0);
            return new UserResponseDTO(
                    userArg.getId(),
                    userArg.getFirstName(),
                    userArg.getLastName(),
                    userArg.getEmail(),
                    userArg.getUserType()
            );
        });
        when(jwtService.generateToken(any(User.class))).thenReturn(testJwtToken);
    }

    @Test
    @DisplayName("POST /api/auth/register - Should successfully register a new user")
    void register_shouldRegisterNewUser_Success() throws Exception {
        when(userRepository.findByEmail(anyString())).thenReturn(Optional.empty());

        mockMvc.perform(post("/api/auth/register")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(registerRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message", is("Registration successful")));

        verify(userRepository).findByEmail(registerRequest.getEmail());
        verify(passwordEncoder).encode(registerRequest.getPassword());
        verify(userRepository).save(any(User.class));
    }

    @Test
    @DisplayName("POST /api/auth/register - Should return bad request if email already registered")
    void register_shouldReturnBadRequestForExistingEmail() throws Exception {
        when(userRepository.findByEmail(anyString())).thenReturn(Optional.of(testUser));

        mockMvc.perform(post("/api/auth/register")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(registerRequest)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message", is("Email already registered")));

        verify(userRepository).findByEmail(registerRequest.getEmail());
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    @DisplayName("POST /api/auth/login - Should successfully authenticate and return cookie and user data")
    void authenticate_shouldReturnCookieAndUserData_Success() throws Exception {
        Authentication mockAuthentication = mock(Authentication.class);
        UserDetails mockUserDetails = new org.springframework.security.core.userdetails.User(
                loginRequest.getEmail(), "encodedPassword123", Collections.singletonList(new SimpleGrantedAuthority(UserType.NORMAL.name())));
        when(mockAuthentication.getPrincipal()).thenReturn(mockUserDetails);
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class))).thenReturn(mockAuthentication);

        when(userRepository.findByEmail(loginRequest.getEmail())).thenReturn(Optional.of(testUser));

        mockMvc.perform(post("/api/auth/login")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message", is("Login successful")))
                .andExpect(jsonPath("$.user.id", is(testUser.getId().intValue())))
                .andExpect(jsonPath("$.user.email", is(testUser.getEmail())))
                .andExpect(jsonPath("$.user.firstName", is(testUser.getFirstName())))
                .andExpect(jsonPath("$.user.lastName", is(testUser.getLastName())))
                .andExpect(jsonPath("$.user.userType", is(testUser.getUserType().name())))
                .andExpect(cookie().exists("accessToken"))
                .andExpect(cookie().httpOnly("accessToken", true))
                .andExpect(cookie().path("accessToken", "/"))
                .andExpect(cookie().maxAge("accessToken", greaterThan(0)))
                .andExpect(cookie().secure("accessToken", false));

        verify(authenticationManager).authenticate(any(UsernamePasswordAuthenticationToken.class));
        verify(userRepository).findByEmail(loginRequest.getEmail());
        verify(jwtService).generateToken(testUser);
        verify(userMapper).toDto(testUser);
    }

    @Test
    @DisplayName("POST /api/auth/login - Should return unauthorized for invalid credentials")
    void authenticate_shouldReturnUnauthorizedForInvalidCredentials() throws Exception {
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenThrow(new BadCredentialsException("Invalid credentials"));

        mockMvc.perform(post("/api/auth/login")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isUnauthorized());

        verify(authenticationManager).authenticate(any(UsernamePasswordAuthenticationToken.class));
        verify(userRepository, never()).findByEmail(anyString());
    }

    @Test
    @DisplayName("POST /api/auth/logout - Should clear the accessToken cookie and SecurityContext")
    void logout_shouldClearAccessTokenCookie() throws Exception {
        Cookie existingCookie = new Cookie("accessToken", testJwtToken);
        existingCookie.setHttpOnly(true);
        existingCookie.setPath("/");
        existingCookie.setMaxAge(7 * 24 * 60 * 60);
        existingCookie.setSecure(false);

        mockMvc.perform(post("/api/auth/logout")
                        .with(csrf())
                        .cookie(existingCookie))
                .andExpect(status().isOk())
                .andExpect(content().string("Logged out successfully"))
                .andExpect(cookie().maxAge("accessToken", 0))
                .andExpect(cookie().secure("accessToken", false));
    }

    @Test
    @WithMockUser(username = "test@example.com", authorities = "NORMAL")
    @DisplayName("GET /api/auth/me - Should return current user for authenticated request")
    void getCurrentUser_shouldReturnCurrentUserForAuthenticatedRequest() throws Exception {
        when(userRepository.findByEmail(testUser.getEmail())).thenReturn(Optional.of(testUser));

        mockMvc.perform(get("/api/auth/me")
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.user.id", is(testUser.getId().intValue())))
                .andExpect(jsonPath("$.user.email", is(testUser.getEmail())))
                .andExpect(jsonPath("$.user.firstName", is(testUser.getFirstName())))
                .andExpect(jsonPath("$.user.lastName", is(testUser.getLastName())))
                .andExpect(jsonPath("$.user.userType", is(testUser.getUserType().name())));

        verify(userRepository).findByEmail(testUser.getEmail());
    }

/*
    @Test
    // REMOVED @WithMockUser from this test
    @DisplayName("GET /api/auth/me - Should return internal server error if user not found after authentication (edge case)")
    void getCurrentUser_shouldReturnInternalServerErrorIfUserNotFound() throws Exception {
        when(userRepository.findByEmail("nonexistent@example.com")).thenReturn(Optional.empty());

        // FIX: Manually set up the SecurityContext for this test
        UserDetails mockUserDetails = new org.springframework.security.core.userdetails.User(
                "nonexistent@example.com", "password", Collections.singletonList(new SimpleGrantedAuthority(UserType.NORMAL.name())));
        Authentication authentication = new UsernamePasswordAuthenticationToken(
                mockUserDetails, null, mockUserDetails.getAuthorities());
        SecurityContextHolder.getContext().setAuthentication(authentication);

        try {
            mockMvc.perform(get("/api/auth/me")
                            .accept(MediaType.APPLICATION_JSON))
                    .andExpect(status().isInternalServerError());
        } finally {
            // Clear the context after the test to prevent side effects
            SecurityContextHolder.clearContext();
        }

        verify(userRepository).findByEmail("nonexistent@example.com");
    }
*/
}