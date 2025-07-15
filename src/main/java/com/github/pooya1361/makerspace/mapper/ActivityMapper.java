package com.github.pooya1361.makerspace.mapper;

import com.github.pooya1361.makerspace.dto.ActivityResponseDTO;
import com.github.pooya1361.makerspace.model.Activity;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring", uses = {WorkshopMapper.class}) // Makes MapStruct generate a Spring component
public interface ActivityMapper {
    ActivityResponseDTO toDto(Activity activity);
    List<ActivityResponseDTO> toDtoList(List<Activity> activities);
}