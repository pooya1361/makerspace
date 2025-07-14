package com.github.pooya1361.makerspace.repository;

import com.github.pooya1361.makerspace.model.User;
import com.github.pooya1361.makerspace.model.Workshop;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface WorkshopRepository extends JpaRepository<Workshop, Long> {

}