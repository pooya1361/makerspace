// com.github.pooya1361.makerspace.service.SummaryService
package com.github.pooya1361.makerspace.service;

import com.github.pooya1361.makerspace.dto.response.SummaryResponseDTO;
import com.github.pooya1361.makerspace.repository.*;

import org.springframework.stereotype.Service;

@Service
public class SummaryService {

    private final WorkshopRepository workshopRepository;
    private final ActivityRepository activityRepository;
    private final LessonRepository lessonRepository;
    private final ScheduledLessonRepository scheduledLessonRepository;
    private final UserRepository userRepository;

    public SummaryService(WorkshopRepository workshopRepository,
                          ActivityRepository activityRepository,
                          LessonRepository lessonRepository,
                          ScheduledLessonRepository scheduledLessonRepository,
                          UserRepository userRepository) {
        this.workshopRepository = workshopRepository;
        this.activityRepository = activityRepository;
        this.lessonRepository = lessonRepository;
        this.scheduledLessonRepository = scheduledLessonRepository;
        this.userRepository = userRepository;
    }

    public SummaryResponseDTO getOverallSummary() {
        long totalWorkshops = workshopRepository.count();
        long totalActivities = activityRepository.count();
        long totalLessons = lessonRepository.count();
        long totalScheduledLessons = scheduledLessonRepository.count();
        long totalUsers = userRepository.count();

        return new SummaryResponseDTO(totalWorkshops, totalActivities, totalLessons, totalScheduledLessons, totalUsers);
    }
}