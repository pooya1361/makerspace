package com.github.pooya1361.makerspace.mapper;

import com.github.pooya1361.makerspace.dto.LessonResponseDTO;
import com.github.pooya1361.makerspace.dto.VoteCreateDTO;
import com.github.pooya1361.makerspace.dto.VoteResponseDTO;
import com.github.pooya1361.makerspace.model.Lesson;
import com.github.pooya1361.makerspace.model.Vote;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

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
}