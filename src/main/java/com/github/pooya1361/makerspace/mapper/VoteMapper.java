package com.github.pooya1361.makerspace.mapper;

import com.github.pooya1361.makerspace.dto.create.VoteCreateDTO;
import com.github.pooya1361.makerspace.dto.response.VoteResponseDTO;
import com.github.pooya1361.makerspace.model.Vote;
import org.mapstruct.*;

import java.util.List;

@Mapper(componentModel = "spring", uses = {UserMapper.class, ProposedTimeSlotMapper.class})
public interface VoteMapper {
    @Mapping(target = "user", source = "user", qualifiedByName = "toUserSummaryDto")
    @Mapping(target = "proposedTimeSlot", source = "proposedTimeSlot", qualifiedByName = "toProposedTimeSlotSummaryDto")
    VoteResponseDTO toDto(Vote vote);
    List<VoteResponseDTO> toDtoList(List<Vote> votes);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "user", ignore = true)
    @Mapping(target = "proposedTimeSlot", ignore = true)
    Vote toEntity(VoteCreateDTO voteCreateDTO);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "user", ignore = true) // User/ProposedTimeSlot typically not updated via PATCH on Vote
    @Mapping(target = "proposedTimeSlot", ignore = true)
    void updateVoteFromDto(VoteCreateDTO updateDTO, @MappingTarget Vote vote);
}