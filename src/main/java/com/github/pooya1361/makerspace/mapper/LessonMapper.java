package com.github.pooya1361.makerspace.mapper;

import com.github.pooya1361.makerspace.dto.create.LessonCreateDTO;
import com.github.pooya1361.makerspace.dto.response.LessonResponseDTO;
import com.github.pooya1361.makerspace.model.Lesson;
import org.mapstruct.*;

import java.util.List;

@Mapper(componentModel = "spring", uses = {ActivityMapper.class}) // Tell MapStruct to use ActivityMapper
public interface LessonMapper {
    LessonResponseDTO toDto(Lesson lesson);
    List<LessonResponseDTO> toDtoList(List<Lesson> lessons);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "activity", ignore = true) // Activity will be set in service
    Lesson toEntity(LessonCreateDTO createDTO);
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "activity", ignore = true) // Activity will be updated in service
    void updateLessonFromDto(LessonCreateDTO updateDTO, @MappingTarget Lesson lesson);

}