package com.github.pooya1361.makerspace.mapper;

import com.github.pooya1361.makerspace.dto.UserResponseDTO;
import com.github.pooya1361.makerspace.dto.UserSummaryDTO;
import com.github.pooya1361.makerspace.model.User;
import org.mapstruct.Mapper;
import org.mapstruct.Named;

import java.util.List;

@Mapper(componentModel = "spring", uses = {ScheduledLessonMapper.class})
public interface UserMapper {
    UserResponseDTO toDto(User user);
    List<UserResponseDTO> toDtoList(List<User> users);
    @Named("toUserSummaryDto")
    UserSummaryDTO toSummaryDto(User user);
}