package com.github.pooya1361.makerspace.mapper;

import com.github.pooya1361.makerspace.dto.create.UserCreateDTO;
import com.github.pooya1361.makerspace.dto.create.WorkshopCreateDTO;
import com.github.pooya1361.makerspace.dto.response.UserResponseDTO;
import com.github.pooya1361.makerspace.dto.summary.UserSummaryDTO;
import com.github.pooya1361.makerspace.model.User;
import com.github.pooya1361.makerspace.model.Workshop;
import org.mapstruct.*;

import java.util.List;

@Mapper(componentModel = "spring", uses = {ScheduledLessonMapper.class})
public interface UserMapper {
    UserResponseDTO toDto(User user);
    List<UserResponseDTO> toDtoList(List<User> users);
    @Named("toUserSummaryDto")
    UserSummaryDTO toSummaryDto(User user);

    User toEntity(UserCreateDTO userCreateDTO);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "id", ignore = true)
    void updateUserFromDto(UserCreateDTO updateDTO, @MappingTarget User user);
}