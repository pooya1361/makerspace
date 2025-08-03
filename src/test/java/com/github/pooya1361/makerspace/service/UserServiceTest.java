// src/test/java/com/github/pooya1361/makerspace/service/UserServiceTest.java
package com.github.pooya1361.makerspace.service;

import com.github.pooya1361.makerspace.dto.create.UserCreateDTO;
import com.github.pooya1361.makerspace.dto.response.UserResponseDTO;
import com.github.pooya1361.makerspace.mapper.UserMapper;
import com.github.pooya1361.makerspace.model.User;
import com.github.pooya1361.makerspace.model.enums.UserType;
import com.github.pooya1361.makerspace.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private UserMapper userMapper;

    @InjectMocks
    private UserService userService;

    private User user;
    private User instructorUser;
    private User adminUser;
    private UserCreateDTO userCreateDTO;
    private UserResponseDTO userResponseDTO;

    @BeforeEach
    void setUp() {
        // Setup Normal User
        user = new User();
        user.setId(1L);
        user.setFirstName("John");
        user.setLastName("Doe");
        user.setEmail("john.doe@example.com");
        user.setPassword("encodedPassword123");
        user.setUserType(UserType.NORMAL);

        // Setup Instructor User
        instructorUser = new User();
        instructorUser.setId(2L);
        instructorUser.setFirstName("Jane");
        instructorUser.setLastName("Smith");
        instructorUser.setEmail("jane.smith@example.com");
        instructorUser.setPassword("encodedPassword456");
        instructorUser.setUserType(UserType.INSTRUCTOR);

        // Setup Admin User
        adminUser = new User();
        adminUser.setId(3L);
        adminUser.setFirstName("Admin");
        adminUser.setLastName("User");
        adminUser.setEmail("admin@example.com");
        adminUser.setPassword("encodedPasswordAdmin");
        adminUser.setUserType(UserType.ADMIN);

        // Setup DTOs
        userCreateDTO = new UserCreateDTO();
        userCreateDTO.setFirstName("John");
        userCreateDTO.setLastName("Doe");
        userCreateDTO.setEmail("john.doe@example.com");
        userCreateDTO.setPassword("plainPassword123");
        userCreateDTO.setUserType(UserType.NORMAL);

        userResponseDTO = new UserResponseDTO();
        userResponseDTO.setId(1L);
        userResponseDTO.setFirstName("John");
        userResponseDTO.setLastName("Doe");
        userResponseDTO.setEmail("john.doe@example.com");
        userResponseDTO.setUserType(UserType.NORMAL);
        // Note: password should not be in response DTO
    }

    // ==================== CREATE USER TESTS ====================

    @Test
    void createUser_NormalUser_Success() {
        // given
        when(userMapper.toEntity(userCreateDTO)).thenReturn(user);
        when(userRepository.save(user)).thenReturn(user);
        when(userMapper.toDto(user)).thenReturn(userResponseDTO);

        // when
        UserResponseDTO result = userService.createUser(userCreateDTO);

        // then
        assertThat(result).isNotNull();
        assertThat(result.getFirstName()).isEqualTo("John");
        assertThat(result.getLastName()).isEqualTo("Doe");
        assertThat(result.getEmail()).isEqualTo("john.doe@example.com");
        assertThat(result.getUserType()).isEqualTo(UserType.NORMAL);

        verify(userMapper).toEntity(userCreateDTO);
        verify(userRepository).save(user);
        verify(userMapper).toDto(user);
    }

    @Test
    void createUser_InstructorUser_Success() {
        // given
        UserCreateDTO instructorCreateDTO = new UserCreateDTO();
        instructorCreateDTO.setFirstName("Jane");
        instructorCreateDTO.setLastName("Smith");
        instructorCreateDTO.setEmail("jane.smith@example.com");
        instructorCreateDTO.setPassword("plainPassword456");
        instructorCreateDTO.setUserType(UserType.INSTRUCTOR);

        UserResponseDTO instructorResponseDTO = new UserResponseDTO();
        instructorResponseDTO.setId(2L);
        instructorResponseDTO.setFirstName("Jane");
        instructorResponseDTO.setLastName("Smith");
        instructorResponseDTO.setEmail("jane.smith@example.com");
        instructorResponseDTO.setUserType(UserType.INSTRUCTOR);

        when(userMapper.toEntity(instructorCreateDTO)).thenReturn(instructorUser);
        when(userRepository.save(instructorUser)).thenReturn(instructorUser);
        when(userMapper.toDto(instructorUser)).thenReturn(instructorResponseDTO);

        // when
        UserResponseDTO result = userService.createUser(instructorCreateDTO);

        // then
        assertThat(result).isNotNull();
        assertThat(result.getFirstName()).isEqualTo("Jane");
        assertThat(result.getLastName()).isEqualTo("Smith");
        assertThat(result.getEmail()).isEqualTo("jane.smith@example.com");
        assertThat(result.getUserType()).isEqualTo(UserType.INSTRUCTOR);

        verify(userMapper).toEntity(instructorCreateDTO);
        verify(userRepository).save(instructorUser);
        verify(userMapper).toDto(instructorUser);
    }

    @Test
    void createUser_AdminUser_Success() {
        // given
        UserCreateDTO adminCreateDTO = new UserCreateDTO();
        adminCreateDTO.setFirstName("Admin");
        adminCreateDTO.setLastName("User");
        adminCreateDTO.setEmail("admin@example.com");
        adminCreateDTO.setPassword("plainPasswordAdmin");
        adminCreateDTO.setUserType(UserType.ADMIN);

        UserResponseDTO adminResponseDTO = new UserResponseDTO();
        adminResponseDTO.setId(3L);
        adminResponseDTO.setFirstName("Admin");
        adminResponseDTO.setLastName("User");
        adminResponseDTO.setEmail("admin@example.com");
        adminResponseDTO.setUserType(UserType.ADMIN);

        when(userMapper.toEntity(adminCreateDTO)).thenReturn(adminUser);
        when(userRepository.save(adminUser)).thenReturn(adminUser);
        when(userMapper.toDto(adminUser)).thenReturn(adminResponseDTO);

        // when
        UserResponseDTO result = userService.createUser(adminCreateDTO);

        // then
        assertThat(result).isNotNull();
        assertThat(result.getFirstName()).isEqualTo("Admin");
        assertThat(result.getLastName()).isEqualTo("User");
        assertThat(result.getEmail()).isEqualTo("admin@example.com");
        assertThat(result.getUserType()).isEqualTo(UserType.ADMIN);

        verify(userMapper).toEntity(adminCreateDTO);
        verify(userRepository).save(adminUser);
        verify(userMapper).toDto(adminUser);
    }

    // ==================== GET ALL USERS TESTS ====================

    @Test
    void getAllUsers_Success() {
        // given
        List<User> users = Arrays.asList(user, instructorUser, adminUser);

        UserResponseDTO instructorResponseDTO = new UserResponseDTO();
        instructorResponseDTO.setId(2L);
        instructorResponseDTO.setFirstName("Jane");
        instructorResponseDTO.setLastName("Smith");
        instructorResponseDTO.setEmail("jane.smith@example.com");
        instructorResponseDTO.setUserType(UserType.INSTRUCTOR);

        UserResponseDTO adminResponseDTO = new UserResponseDTO();
        adminResponseDTO.setId(3L);
        adminResponseDTO.setFirstName("Admin");
        adminResponseDTO.setLastName("User");
        adminResponseDTO.setEmail("admin@example.com");
        adminResponseDTO.setUserType(UserType.ADMIN);

        List<UserResponseDTO> expectedDtos = Arrays.asList(userResponseDTO, instructorResponseDTO, adminResponseDTO);

        when(userRepository.findAll()).thenReturn(users);
        when(userMapper.toDtoList(users)).thenReturn(expectedDtos);

        // when
        List<UserResponseDTO> result = userService.getAllUsers();

        // then
        assertThat(result).hasSize(3);
        assertThat(result.get(0).getUserType()).isEqualTo(UserType.NORMAL);
        assertThat(result.get(1).getUserType()).isEqualTo(UserType.INSTRUCTOR);
        assertThat(result.get(2).getUserType()).isEqualTo(UserType.ADMIN);

        verify(userRepository).findAll();
        verify(userMapper).toDtoList(users);
    }

    @Test
    void getAllUsers_EmptyList() {
        // given
        List<User> emptyUsers = Arrays.asList();
        List<UserResponseDTO> emptyDtos = Arrays.asList();

        when(userRepository.findAll()).thenReturn(emptyUsers);
        when(userMapper.toDtoList(emptyUsers)).thenReturn(emptyDtos);

        // when
        List<UserResponseDTO> result = userService.getAllUsers();

        // then
        assertThat(result).isEmpty();
        verify(userRepository).findAll();
        verify(userMapper).toDtoList(emptyUsers);
    }

    @Test
    void getAllUsers_OnlyNormalUsers_Success() {
        // given - test with only normal users
        User user2 = new User();
        user2.setId(4L);
        user2.setFirstName("Alice");
        user2.setLastName("Johnson");
        user2.setEmail("alice.johnson@example.com");
        user2.setPassword("encodedPassword789");
        user2.setUserType(UserType.NORMAL);

        UserResponseDTO userResponseDTO2 = new UserResponseDTO();
        userResponseDTO2.setId(4L);
        userResponseDTO2.setFirstName("Alice");
        userResponseDTO2.setLastName("Johnson");
        userResponseDTO2.setEmail("alice.johnson@example.com");
        userResponseDTO2.setUserType(UserType.NORMAL);

        List<User> normalUsers = Arrays.asList(user, user2);
        List<UserResponseDTO> normalUserDtos = Arrays.asList(userResponseDTO, userResponseDTO2);

        when(userRepository.findAll()).thenReturn(normalUsers);
        when(userMapper.toDtoList(normalUsers)).thenReturn(normalUserDtos);

        // when
        List<UserResponseDTO> result = userService.getAllUsers();

        // then
        assertThat(result).hasSize(2);
        assertThat(result).allSatisfy(userDto ->
                assertThat(userDto.getUserType()).isEqualTo(UserType.NORMAL)
        );

        verify(userRepository).findAll();
        verify(userMapper).toDtoList(normalUsers);
    }

    // ==================== GET USER BY ID TESTS ====================

    @Test
    void getUserById_Success() {
        // given
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(userMapper.toDto(user)).thenReturn(userResponseDTO);

        // when
        Optional<UserResponseDTO> result = userService.getUserById(1L);

        // then
        assertThat(result).isPresent();
        assertThat(result.get().getFirstName()).isEqualTo("John");
        assertThat(result.get().getLastName()).isEqualTo("Doe");
        assertThat(result.get().getEmail()).isEqualTo("john.doe@example.com");
        assertThat(result.get().getUserType()).isEqualTo(UserType.NORMAL);

        verify(userRepository).findById(1L);
        verify(userMapper).toDto(user);
    }

    @Test
    void getUserById_NotFound() {
        // given
        when(userRepository.findById(1L)).thenReturn(Optional.empty());

        // when
        Optional<UserResponseDTO> result = userService.getUserById(1L);

        // then
        assertThat(result).isEmpty();
        verify(userRepository).findById(1L);
        verify(userMapper, never()).toDto(any());
    }

    @Test
    void getUserById_DifferentUserTypes_Success() {
        // given - test retrieving different user types
        when(userRepository.findById(2L)).thenReturn(Optional.of(instructorUser));

        UserResponseDTO instructorResponseDTO = new UserResponseDTO();
        instructorResponseDTO.setId(2L);
        instructorResponseDTO.setFirstName("Jane");
        instructorResponseDTO.setLastName("Smith");
        instructorResponseDTO.setEmail("jane.smith@example.com");
        instructorResponseDTO.setUserType(UserType.INSTRUCTOR);

        when(userMapper.toDto(instructorUser)).thenReturn(instructorResponseDTO);

        // when
        Optional<UserResponseDTO> result = userService.getUserById(2L);

        // then
        assertThat(result).isPresent();
        assertThat(result.get().getUserType()).isEqualTo(UserType.INSTRUCTOR);
        assertThat(result.get().getFirstName()).isEqualTo("Jane");

        verify(userRepository).findById(2L);
        verify(userMapper).toDto(instructorUser);
    }

    // ==================== UPDATE USER TESTS ====================

    @Test
    void updateUser_Success() {
        // given
        UserCreateDTO updateDTO = new UserCreateDTO();
        updateDTO.setFirstName("John Updated");
        updateDTO.setLastName("Doe Updated");
        updateDTO.setEmail("john.updated@example.com");
        updateDTO.setPassword("newPlainPassword");
        updateDTO.setUserType(UserType.INSTRUCTOR); // Promote to instructor

        UserResponseDTO updatedResponseDTO = new UserResponseDTO();
        updatedResponseDTO.setId(1L);
        updatedResponseDTO.setFirstName("John Updated");
        updatedResponseDTO.setLastName("Doe Updated");
        updatedResponseDTO.setEmail("john.updated@example.com");
        updatedResponseDTO.setUserType(UserType.INSTRUCTOR);

        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(userRepository.save(user)).thenReturn(user);
        when(userMapper.toDto(user)).thenReturn(updatedResponseDTO);

        // when
        UserResponseDTO result = userService.updateUser(1L, updateDTO);

        // then
        assertThat(result).isNotNull();
        assertThat(result.getFirstName()).isEqualTo("John Updated");
        assertThat(result.getLastName()).isEqualTo("Doe Updated");
        assertThat(result.getEmail()).isEqualTo("john.updated@example.com");
        assertThat(result.getUserType()).isEqualTo(UserType.INSTRUCTOR);

        verify(userRepository).findById(1L);
        verify(userMapper).updateUserFromDto(updateDTO, user);
        verify(userRepository).save(user);
        verify(userMapper).toDto(user);
    }

    @Test
    void updateUser_UserNotFound_ThrowsException() {
        // given
        UserCreateDTO updateDTO = new UserCreateDTO();
        when(userRepository.findById(1L)).thenReturn(Optional.empty());

        // when & then
        assertThatThrownBy(() -> userService.updateUser(1L, updateDTO))
                .isInstanceOf(EntityNotFoundException.class)
                .hasMessage("User not found with ID: 1");

        verify(userRepository).findById(1L);
        verify(userRepository, never()).save(any());
    }

    @Test
    void updateUser_PromoteToAdmin_Success() {
        // given - test promoting a user to admin
        UserCreateDTO promoteToAdminDTO = new UserCreateDTO();
        promoteToAdminDTO.setFirstName("John");
        promoteToAdminDTO.setLastName("Doe");
        promoteToAdminDTO.setEmail("john.doe@example.com");
        promoteToAdminDTO.setPassword("samePassword");
        promoteToAdminDTO.setUserType(UserType.ADMIN); // Promote to admin

        UserResponseDTO adminResponseDTO = new UserResponseDTO();
        adminResponseDTO.setId(1L);
        adminResponseDTO.setFirstName("John");
        adminResponseDTO.setLastName("Doe");
        adminResponseDTO.setEmail("john.doe@example.com");
        adminResponseDTO.setUserType(UserType.ADMIN);

        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(userRepository.save(user)).thenReturn(user);
        when(userMapper.toDto(user)).thenReturn(adminResponseDTO);

        // when
        UserResponseDTO result = userService.updateUser(1L, promoteToAdminDTO);

        // then
        assertThat(result).isNotNull();
        assertThat(result.getUserType()).isEqualTo(UserType.ADMIN);

        verify(userRepository).findById(1L);
        verify(userMapper).updateUserFromDto(promoteToAdminDTO, user);
        verify(userRepository).save(user);
        verify(userMapper).toDto(user);
    }

    // ==================== DELETE USER TESTS ====================

    @Test
    void deleteUser_Success() {
        // given
        when(userRepository.existsById(1L)).thenReturn(true);

        // when
        userService.deleteUser(1L);

        // then
        verify(userRepository).existsById(1L);
        verify(userRepository).deleteById(1L);
    }

    @Test
    void deleteUser_NotFound_ThrowsException() {
        // given
        when(userRepository.existsById(1L)).thenReturn(false);

        // when & then
        assertThatThrownBy(() -> userService.deleteUser(1L))
                .isInstanceOf(EntityNotFoundException.class)
                .hasMessage("User not found with ID: 1");

        verify(userRepository).existsById(1L);
        verify(userRepository, never()).deleteById(any());
    }

    // ==================== EDGE CASE TESTS ====================

    @Test
    void createUser_WithSpecialCharactersInName_Success() {
        // given - test with names containing special characters
        UserCreateDTO specialNameDTO = new UserCreateDTO();
        specialNameDTO.setFirstName("María José");
        specialNameDTO.setLastName("O'Connor-Smith");
        specialNameDTO.setEmail("maria.oconnor@example.com");
        specialNameDTO.setPassword("password123");
        specialNameDTO.setUserType(UserType.NORMAL);

        User specialNameUser = new User();
        specialNameUser.setId(5L);
        specialNameUser.setFirstName("María José");
        specialNameUser.setLastName("O'Connor-Smith");
        specialNameUser.setEmail("maria.oconnor@example.com");
        specialNameUser.setUserType(UserType.NORMAL);

        UserResponseDTO specialNameResponse = new UserResponseDTO();
        specialNameResponse.setId(5L);
        specialNameResponse.setFirstName("María José");
        specialNameResponse.setLastName("O'Connor-Smith");
        specialNameResponse.setEmail("maria.oconnor@example.com");
        specialNameResponse.setUserType(UserType.NORMAL);

        when(userMapper.toEntity(specialNameDTO)).thenReturn(specialNameUser);
        when(userRepository.save(specialNameUser)).thenReturn(specialNameUser);
        when(userMapper.toDto(specialNameUser)).thenReturn(specialNameResponse);

        // when
        UserResponseDTO result = userService.createUser(specialNameDTO);

        // then
        assertThat(result).isNotNull();
        assertThat(result.getFirstName()).isEqualTo("María José");
        assertThat(result.getLastName()).isEqualTo("O'Connor-Smith");
        assertThat(result.getEmail()).isEqualTo("maria.oconnor@example.com");

        verify(userMapper).toEntity(specialNameDTO);
        verify(userRepository).save(specialNameUser);
        verify(userMapper).toDto(specialNameUser);
    }

    @Test
    void updateUser_OnlyEmailChange_Success() {
        // given - test updating only email
        UserCreateDTO emailUpdateDTO = new UserCreateDTO();
        emailUpdateDTO.setFirstName("John"); // Same
        emailUpdateDTO.setLastName("Doe"); // Same
        emailUpdateDTO.setEmail("john.newemail@example.com"); // Changed
        emailUpdateDTO.setPassword("samePassword"); // Same
        emailUpdateDTO.setUserType(UserType.NORMAL); // Same

        UserResponseDTO emailUpdatedResponse = new UserResponseDTO();
        emailUpdatedResponse.setId(1L);
        emailUpdatedResponse.setFirstName("John");
        emailUpdatedResponse.setLastName("Doe");
        emailUpdatedResponse.setEmail("john.newemail@example.com");
        emailUpdatedResponse.setUserType(UserType.NORMAL);

        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(userRepository.save(user)).thenReturn(user);
        when(userMapper.toDto(user)).thenReturn(emailUpdatedResponse);

        // when
        UserResponseDTO result = userService.updateUser(1L, emailUpdateDTO);

        // then
        assertThat(result).isNotNull();
        assertThat(result.getEmail()).isEqualTo("john.newemail@example.com");
        assertThat(result.getFirstName()).isEqualTo("John"); // Unchanged
        assertThat(result.getUserType()).isEqualTo(UserType.NORMAL); // Unchanged

        verify(userRepository).findById(1L);
        verify(userMapper).updateUserFromDto(emailUpdateDTO, user);
        verify(userRepository).save(user);
        verify(userMapper).toDto(user);
    }
}