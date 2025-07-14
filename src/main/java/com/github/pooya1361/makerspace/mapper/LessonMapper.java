package com.github.pooya1361.makerspace.mapper;

import com.github.pooya1361.makerspace.dto.LessonResponseDTO;
import com.github.pooya1361.makerspace.model.Lesson;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

import java.util.List;

@Mapper(componentModel = "spring", uses = {ActivityMapper.class}) // Tell MapStruct to use ActivityMapper
public interface LessonMapper {
    LessonResponseDTO toDto(Lesson lesson);
    List<LessonResponseDTO> toDtoList(List<Lesson> lessons);
}