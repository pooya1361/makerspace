package com.github.pooya1361.makerspace.mapper;

import com.github.pooya1361.makerspace.dto.ScheduledLessonResponseDTO;
import com.github.pooya1361.makerspace.model.ScheduledLesson;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring", uses = {LessonMapper.class, UserMapper.class})
public interface ScheduledLessonMapper {
    ScheduledLessonResponseDTO toDto(ScheduledLesson scheduledLesson);
    List<ScheduledLessonResponseDTO> toDtoList(List<ScheduledLesson> scheduledLessons);
}