package com.github.pooya1361.makerspace.controller;

import com.github.pooya1361.makerspace.mapper.UserMapper;
import com.github.pooya1361.makerspace.model.User;
import com.github.pooya1361.makerspace.dto.UserResponseDTO;
import com.github.pooya1361.makerspace.repository.UserRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
@Tag(name = "User Management", description = "Endpoints for user administration") // <-- Tag to group endpoints
public class UserController {
    private final UserRepository userRepository;

    @Autowired
    public UserMapper userMapper;

    @Autowired // Spring automatically injects UserRepository
    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @GetMapping("/test")
    public String test() {
        return "API works!";
    }

    @GetMapping("/users")
    @Operation(summary = "Get all users", description = "Retrieves a list of all registered users in the system.")
    public ResponseEntity<List<UserResponseDTO>> getUsers() {
        List<UserResponseDTO> userResponseDTOs = userMapper.toDtoList(userRepository.findAll());
        return new ResponseEntity<>(userResponseDTOs, HttpStatus.OK);
    }
}
