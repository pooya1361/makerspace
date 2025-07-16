package com.github.pooya1361.makerspace.mapper;

import com.github.pooya1361.makerspace.dto.create.ActivityCreateDTO;
import com.github.pooya1361.makerspace.dto.create.WorkshopCreateDTO;
import com.github.pooya1361.makerspace.dto.response.ActivityResponseDTO;
import com.github.pooya1361.makerspace.model.Activity;
import com.github.pooya1361.makerspace.model.Workshop;
import org.mapstruct.*;

import java.util.List;

@Mapper(componentModel = "spring", uses = {WorkshopMapper.class}) // Makes MapStruct generate a Spring component
public interface ActivityMapper {
    ActivityResponseDTO toDto(Activity activity);
    List<ActivityResponseDTO> toDtoList(List<Activity> activities);

    @Mapping(target = "workshop", ignore = true)
    Activity toEntity(ActivityCreateDTO activityCreateDTO);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "workshop", ignore = true) // Workshop will be updated in service
    void updateActivityFromDto(ActivityCreateDTO activityCreateDTO, @MappingTarget Activity activity);
}