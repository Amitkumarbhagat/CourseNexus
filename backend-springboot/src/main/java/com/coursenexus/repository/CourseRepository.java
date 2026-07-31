package com.coursenexus.repository;
import org.springframework.data.jpa.repository.JpaRepository;

import com.coursenexus.entity.Course;

import java.util.UUID;

import java.util.List;

public interface CourseRepository extends JpaRepository<Course, UUID> {
    List<Course> findByIsApprovedTrue();
    List<Course> findByInstructorId(UUID instructorId);
}
