package com.coursenexus.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.coursenexus.entity.Feedback;

import java.util.Optional;
import java.util.UUID;
import com.coursenexus.entity.Course;

public interface FeedbackRepository extends JpaRepository<Feedback, UUID> {
    Optional<Feedback> findByCourseAndUserId(Course course, UUID userId);
}

