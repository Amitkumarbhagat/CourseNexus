package com.coursenexus.repository;

import com.coursenexus.entity.Course;
import com.coursenexus.entity.Learning;
import com.coursenexus.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface LearningRepository extends JpaRepository<Learning, UUID> {

	Learning findByUserAndCourse(User user, Course course);
}
