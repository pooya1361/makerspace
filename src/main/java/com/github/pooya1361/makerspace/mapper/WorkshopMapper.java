package com.github.pooya1361.makerspace.mapper;

import com.github.pooya1361.makerspace.dto.create.VoteCreateDTO;
import com.github.pooya1361.makerspace.dto.create.WorkshopCreateDTO;
import com.github.pooya1361.makerspace.dto.response.WorkshopResponseDTO;
import com.github.pooya1361.makerspace.model.Vote;
import com.github.pooya1361.makerspace.model.Workshop;
import org.mapstruct.*;

import java.util.List;

@Mapper(componentModel = "spring")
public interface WorkshopMapper {
    WorkshopResponseDTO toDto(Workshop workshop);
    List<WorkshopResponseDTO> toDtoList(List<Workshop> workshops);

    Workshop toEntity(WorkshopCreateDTO workshopCreateDTO);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE) // Important for PATCH
    @Mapping(target = "id", ignore = true) // Always ignore ID when updating
    void updateWorkshopFromDto(WorkshopCreateDTO workshopCreateDTO, @MappingTarget Workshop workshop);
}