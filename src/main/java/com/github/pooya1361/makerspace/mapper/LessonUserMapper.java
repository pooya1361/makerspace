package com.github.pooya1361.makerspace.mapper;

import com.github.pooya1361.makerspace.dto.create.LessonUserCreateDTO;
import com.github.pooya1361.makerspace.dto.response.LessonUserResponseDTO;
import com.github.pooya1361.makerspace.model.LessonUser;
import org.mapstruct.*;

import java.util.List;

@Mapper(componentModel = "spring", uses = {LessonMapper.class, UserMapper.class})
public interface LessonUserMapper {
    LessonUserResponseDTO toDto(LessonUser lessonUser);
    List<LessonUserResponseDTO> toDtoList(List<LessonUser> lessonUsers);

    @Mapping(target = "id", ignore = true)
    LessonUser toEntity(LessonUserCreateDTO createDTO);
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "id", ignore = true)
    void updateLessonUserFromDto(LessonUserCreateDTO updateDTO, @MappingTarget LessonUser lessonUser);
}