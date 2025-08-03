// src/test/java/com/github/pooya1361/makerspace/repository/ActivityRepositoryTest.java
package com.github.pooya1361.makerspace.repository;

import com.github.pooya1361.makerspace.model.Activity;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import org.springframework.test.context.ActiveProfiles;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.ANY)
@ActiveProfiles("test")
class ActivityRepositoryTest {

    @Autowired
    private TestEntityManager entityManager;

    @Autowired
    private ActivityRepository activityRepository;

    @Test
    void whenFindByName_thenReturnActivity() {
        // given
        Activity activity = new Activity();
        activity.setName("Test Activity");
        activity.setDescription("Test Description");
        entityManager.persistAndFlush(activity);

        // when
        Optional<Activity> found = activityRepository.findById(activity.getId());

        // then
        assertThat(found).isPresent();
        assertThat(found.get().getName()).isEqualTo("Test Activity");
    }

    @Test
    void whenFindAll_thenReturnActivityList() {
        // given
        Activity activity1 = new Activity();
        activity1.setName("Activity 1");
        activity1.setDescription("Description 1");

        Activity activity2 = new Activity();
        activity2.setName("Activity 2");
        activity2.setDescription("Description 2");

        entityManager.persist(activity1);
        entityManager.persist(activity2);
        entityManager.flush();

        // when
        List<Activity> activities = activityRepository.findAll();

        // then
        assertThat(activities).hasSize(2);
        assertThat(activities).extracting(Activity::getName)
                .containsExactlyInAnyOrder("Activity 1", "Activity 2");
    }
}