package com.github.pooya1361.makerspace.mapper;

import com.github.pooya1361.makerspace.dto.create.VoteCreateDTO;
import com.github.pooya1361.makerspace.dto.create.WorkshopCreateDTO;
import com.github.pooya1361.makerspace.dto.response.WorkshopResponseDTO;
import com.github.pooya1361.makerspace.model.Vote;
import com.github.pooya1361.makerspace.model.Workshop;
import org.mapstruct.*;

import java.util.List;
import java.util.Optional;

@Mapper(componentModel = "spring", uses = ActivityMapper.class)
public interface WorkshopMapper {
    WorkshopResponseDTO toDto(Workshop workshop);
    List<WorkshopResponseDTO> toDtoList(List<Workshop> workshops);

    Workshop toEntity(WorkshopCreateDTO workshopCreateDTO);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE) // Important for PATCH
    @Mapping(target = "id", ignore = true) // Always ignore ID when updating
    @Mapping(target = "activities", ignore = true)
    void updateWorkshopFromDto(WorkshopCreateDTO workshopCreateDTO, @MappingTarget Workshop workshop);

    default Long map(Optional<Long> value) {
        if (value == null) { // Check if the Optional object itself is null
            return null;
        }
        return value.orElse(null);
    }
}