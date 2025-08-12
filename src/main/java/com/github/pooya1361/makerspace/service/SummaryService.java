// com.github.pooya1361.makerspace.service.SummaryService
package com.github.pooya1361.makerspace.service;

import com.github.pooya1361.makerspace.dto.response.ScheduledLessonResponseDTO;
import com.github.pooya1361.makerspace.dto.response.SummaryResponseDTO;
import com.github.pooya1361.makerspace.mapper.ScheduledLessonMapper;
import com.github.pooya1361.makerspace.model.ProposedTimeSlot;
import com.github.pooya1361.makerspace.model.ScheduledLesson;
import com.github.pooya1361.makerspace.model.User;
import com.github.pooya1361.makerspace.repository.*;

import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.OffsetDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class SummaryService {

    private final WorkshopRepository workshopRepository;
    private final ActivityRepository activityRepository;
    private final LessonRepository lessonRepository;
    private final LessonUserRepository lessonUserRepository;
    private final ScheduledLessonRepository scheduledLessonRepository;
    private final ScheduledLessonMapper scheduledLessonMapper;
    private final UserRepository userRepository;

    public SummaryResponseDTO getOverallSummary() {
        long totalWorkshops = workshopRepository.count();
        long totalActivities = activityRepository.count();
        long totalLessons = lessonRepository.count();
        long totalScheduledLessons = scheduledLessonRepository.count();
        long totalUsers = userRepository.count();

        return new SummaryResponseDTO(totalWorkshops, totalActivities, totalLessons, totalScheduledLessons, totalUsers);
    }

    public List<ScheduledLessonResponseDTO> getAvailableLessons(Authentication authentication) {
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        User user = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.INTERNAL_SERVER_ERROR,
                        "User not found after authentication"
                ));

        Set<Long> lessonIds = lessonUserRepository.findByUserId(user.getId()).stream()
                .filter(lessonUser -> !lessonUser.isAcquired())
                .map(lessonUser -> lessonUser.getLesson().getId())
                .collect(Collectors.toSet());

        List<ScheduledLesson> scheduledLessons = scheduledLessonRepository
                .findByLessonIdInAndStartTimeIsNull(lessonIds).stream()
                .filter(item -> !item.getProposedTimeSlots().isEmpty())
                .sorted(Comparator.comparing(sl ->
                        sl.getProposedTimeSlots().stream()
                                .map(ProposedTimeSlot::getProposedStartTime)
                                .min(Comparator.naturalOrder())
                                .orElse(OffsetDateTime.MAX) // if no proposed time
                ))
                .toList();

        return scheduledLessonMapper.toDtoList(scheduledLessons);
    }
}