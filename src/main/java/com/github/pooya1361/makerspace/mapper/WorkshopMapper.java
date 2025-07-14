package com.github.pooya1361.makerspace.mapper;

import com.github.pooya1361.makerspace.dto.WorkshopResponseDTO;
import com.github.pooya1361.makerspace.model.Workshop;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring")
public interface WorkshopMapper {
    WorkshopResponseDTO toDto(Workshop workshop);
    List<WorkshopResponseDTO> toDtoList(List<Workshop> workshops);
}