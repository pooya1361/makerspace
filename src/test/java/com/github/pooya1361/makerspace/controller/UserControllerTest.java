// src/test/java/com/github/pooya1361/makerspace/controller/UserControllerTest.java
package com.github.pooya1361.makerspace.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.github.pooya1361.makerspace.dto.create.UserCreateDTO;
import com.github.pooya1361.makerspace.dto.response.UserResponseDTO;
import com.github.pooya1361.makerspace.mapper.UserMapper;
import com.github.pooya1361.makerspace.model.enums.UserType;
import com.github.pooya1361.makerspace.security.JwtService;
import com.github.pooya1361.makerspace.service.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(UserController.class)
class UserControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private UserService userService;

    @MockBean
    private UserMapper userMapper;

    @MockBean
    private JwtService jwtService;

    @Autowired
    private ObjectMapper objectMapper;

    private UserCreateDTO userCreateDTO;
    private UserResponseDTO userResponseDTO;
    private List<UserResponseDTO> userList;

    @BeforeEach
    void setUp() {
        userCreateDTO = new UserCreateDTO();
        userCreateDTO.setEmail("test@example.com");
        userCreateDTO.setPassword("password123");
        userCreateDTO.setFirstName("John");
        userCreateDTO.setLastName("Doe");
        userCreateDTO.setUserType(UserType.NORMAL);

        userResponseDTO = new UserResponseDTO();
        userResponseDTO.setId(1L);
        userResponseDTO.setEmail("test@example.com");
        userResponseDTO.setFirstName("John");
        userResponseDTO.setLastName("Doe");
        userResponseDTO.setUserType(UserType.NORMAL);

        UserResponseDTO user2 = new UserResponseDTO();
        user2.setId(2L);
        user2.setEmail("admin@example.com");
        user2.setFirstName("Admin");
        user2.setLastName("User");
        user2.setUserType(UserType.ADMIN);

        userList = Arrays.asList(userResponseDTO, user2);
    }

    @Test
    @WithMockUser
    void getAllUsers_Success() throws Exception {
        when(userService.getAllUsers()).thenReturn(userList);

        mockMvc.perform(get("/api/users"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.length()").value(2))
                .andExpect(jsonPath("$[0].email").value("test@example.com"));

        verify(userService).getAllUsers();
    }

    @Test
    @WithMockUser
    void getUserById_Success() throws Exception {
        when(userService.getUserById(1L)).thenReturn(Optional.of(userResponseDTO));

        mockMvc.perform(get("/api/users/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.email").value("test@example.com"));

        verify(userService).getUserById(1L);
    }

    @Test
    @WithMockUser
    void getUserById_NotFound() throws Exception {
        when(userService.getUserById(999L)).thenReturn(Optional.empty());

        mockMvc.perform(get("/api/users/999"))
                .andExpect(status().isNotFound());

        verify(userService).getUserById(999L);
    }

    @Test
    @WithMockUser(authorities = "ADMIN")
    void createUser_Success() throws Exception {
        when(userService.createUser(any(UserCreateDTO.class))).thenReturn(userResponseDTO);

        mockMvc.perform(post("/api/users")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(userCreateDTO)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.email").value("test@example.com"));

        verify(userService).createUser(any(UserCreateDTO.class));
    }

    @Test
    @WithMockUser(authorities = "ADMIN")
    void updateUser_Success() throws Exception {
        when(userService.updateUser(eq(1L), any(UserCreateDTO.class))).thenReturn(userResponseDTO);

        mockMvc.perform(patch("/api/users/1")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(userCreateDTO)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1));

        verify(userService).updateUser(eq(1L), any(UserCreateDTO.class));
    }

    @Test
    @WithMockUser(authorities = "ADMIN")
    void deleteUser_Success() throws Exception {
        doNothing().when(userService).deleteUser(1L);

        mockMvc.perform(delete("/api/users/1")
                        .with(csrf()))
                .andExpect(status().isNoContent());

        verify(userService).deleteUser(1L);
    }
}