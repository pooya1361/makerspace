// com.github.pooya1361.makerspace.service.SummaryService
package com.github.pooya1361.makerspace.service;

import com.github.pooya1361.makerspace.dto.response.SummaryResponseDTO;
import com.github.pooya1361.makerspace.repository.ScheduledLessonRepository;
import com.github.pooya1361.makerspace.repository.WorkshopRepository;
import com.github.pooya1361.makerspace.repository.ActivityRepository;
import com.github.pooya1361.makerspace.repository.LessonRepository; // Assuming you have this

import org.springframework.stereotype.Service;

@Service
public class SummaryService {

    private final WorkshopRepository workshopRepository;
    private final ActivityRepository activityRepository;
    private final LessonRepository lessonRepository;
    private final ScheduledLessonRepository scheduledLessonRepository;

    public SummaryService(WorkshopRepository workshopRepository,
                          ActivityRepository activityRepository,
                          LessonRepository lessonRepository,
                          ScheduledLessonRepository scheduledLessonRepository) {
        this.workshopRepository = workshopRepository;
        this.activityRepository = activityRepository;
        this.lessonRepository = lessonRepository;
        this.scheduledLessonRepository = scheduledLessonRepository;
    }

    public SummaryResponseDTO getOverallSummary() {
        long totalWorkshops = workshopRepository.count();
        long totalActivities = activityRepository.count();
        long totalLessons = lessonRepository.count();
        long totalScheduledLessons = scheduledLessonRepository.count();

        return new SummaryResponseDTO(totalWorkshops, totalActivities, totalLessons, totalScheduledLessons);
    }
}