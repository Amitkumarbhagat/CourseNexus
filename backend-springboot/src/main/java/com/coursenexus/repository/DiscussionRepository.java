package com.coursenexus.repository;
import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.coursenexus.entity.Course;
import com.coursenexus.entity.Discussion;

public interface DiscussionRepository extends JpaRepository<Discussion, UUID> {

    List<Discussion> findByCourseAndParentIsNull(Course course);
}

