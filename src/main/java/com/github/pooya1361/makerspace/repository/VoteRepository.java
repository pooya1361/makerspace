package com.github.pooya1361.makerspace.repository;

import com.github.pooya1361.makerspace.model.Lesson;
import com.github.pooya1361.makerspace.model.Vote;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface VoteRepository extends JpaRepository<Vote, Long> { }