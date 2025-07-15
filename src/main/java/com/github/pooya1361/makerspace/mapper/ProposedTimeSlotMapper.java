package com.github.pooya1361.makerspace.mapper;

import com.github.pooya1361.makerspace.dto.ProposedTimeSlotResponseDTO;
import com.github.pooya1361.makerspace.dto.ProposedTimeSlotSummaryDTO;
import com.github.pooya1361.makerspace.model.ProposedTimeSlot;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

import java.util.Set;
import java.util.List;

@Mapper(componentModel = "spring", uses = {ScheduledLessonMapper.class})
public interface ProposedTimeSlotMapper {
//    @Mapping(target = "votes", ignore = true)
    ProposedTimeSlotResponseDTO toDto(ProposedTimeSlot proposedTimeSlot);
    Set<ProposedTimeSlotResponseDTO> toDtoSet(Set<ProposedTimeSlot> proposedTimeSlots); // For Set conversion
    List<ProposedTimeSlotResponseDTO> toDtoList(List<ProposedTimeSlot> proposedTimeSlots); // For List conversion
    @Named("toProposedTimeSlotSummaryDto")
    ProposedTimeSlotSummaryDTO toSummaryDto(ProposedTimeSlot proposedTimeSlot);
}