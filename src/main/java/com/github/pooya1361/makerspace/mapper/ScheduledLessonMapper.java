package com.github.pooya1361.makerspace.mapper;

import com.github.pooya1361.makerspace.dto.create.ProposedTimeSlotCreateDTO;
import com.github.pooya1361.makerspace.dto.create.ScheduledLessonCreateDTO;
import com.github.pooya1361.makerspace.dto.response.ScheduledLessonResponseDTO;
import com.github.pooya1361.makerspace.model.Lesson;
import com.github.pooya1361.makerspace.model.ProposedTimeSlot;
import com.github.pooya1361.makerspace.model.ScheduledLesson;
import com.github.pooya1361.makerspace.model.User;
import org.mapstruct.*;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.Optional;

@Mapper(componentModel = "spring", uses = {LessonMapper.class, UserMapper.class, OptionalMapper.class, ProposedTimeSlotMapper.class})
public interface ScheduledLessonMapper {
    ScheduledLessonResponseDTO toDto(ScheduledLesson scheduledLesson);
    List<ScheduledLessonResponseDTO> toDtoList(List<ScheduledLesson> scheduledLessons);

    @Mapping(target = "id", ignore = true)
    ScheduledLesson toEntity(ScheduledLessonCreateDTO scheduledLessonCreateDTO);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "lesson", ignore = true) // Updated in service
    @Mapping(target = "instructor", ignore = true) // Updated in service
    @Mapping(target = "proposedTimeSlots", ignore = true) // Collection ignored
    void updateScheduledLessonFromDto(ScheduledLessonCreateDTO updateDTO, @MappingTarget ScheduledLesson scheduledLesson);

    @Named("unwrapOptionalOffsetDateTime") // Give it a name to reference it
    default OffsetDateTime unwrapOptionalOffsetDateTime(Optional<OffsetDateTime> optionalOffsetDateTime) {
        return optionalOffsetDateTime.orElse(null);
    }
}