package com.github.pooya1361.makerspace.mapper;

import com.github.pooya1361.makerspace.dto.create.ProposedTimeSlotCreateDTO;
import com.github.pooya1361.makerspace.dto.create.VoteCreateDTO;
import com.github.pooya1361.makerspace.dto.response.ProposedTimeSlotResponseDTO;
import com.github.pooya1361.makerspace.dto.summary.ProposedTimeSlotSummaryDTO;
import com.github.pooya1361.makerspace.model.ProposedTimeSlot;
import com.github.pooya1361.makerspace.model.Vote;
import org.mapstruct.*;

import java.time.OffsetDateTime;
import java.util.Optional;
import java.util.Set;
import java.util.List;

@Mapper(componentModel = "spring", uses = {ScheduledLessonMapper.class, OptionalMapper.class, ProposedTimeSlotMapper.class})
public interface ProposedTimeSlotMapper {
    ProposedTimeSlotResponseDTO toDto(ProposedTimeSlot proposedTimeSlot);
    Set<ProposedTimeSlotResponseDTO> toDtoSet(Set<ProposedTimeSlot> proposedTimeSlots); // For Set conversion
    List<ProposedTimeSlotResponseDTO> toDtoList(List<ProposedTimeSlot> proposedTimeSlots); // For List conversion
    @Named("toProposedTimeSlotSummaryDto")
    ProposedTimeSlotSummaryDTO toSummaryDto(ProposedTimeSlot proposedTimeSlot);

    @Mapping(target = "scheduledLesson", ignore = true)
    ProposedTimeSlot toEntity(ProposedTimeSlotCreateDTO proposedTimeSlotCreateDTO);


    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "scheduledLesson", ignore = true) // Updated in service
    @Mapping(target = "votes", ignore = true) // Collection ignored
    void updateProposedTimeSlotFromDto(ProposedTimeSlotCreateDTO updateDTO, @MappingTarget ProposedTimeSlot proposedTimeSlot);

    @Named("unwrapOptionalOffsetDateTime")
    default OffsetDateTime unwrapOptionalOffsetDateTime(Optional<OffsetDateTime> optionalOffsetDateTime) {
        // Return null if the Optional is empty, assuming your DTO's startTime can be null
        return optionalOffsetDateTime.orElse(null);
    }
}