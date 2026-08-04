package com.coursenexus.service;

import com.coursenexus.dto.EnrollRequest;
import com.coursenexus.entity.Course;
import com.coursenexus.entity.Learning;
import com.coursenexus.entity.User;
import com.coursenexus.repository.CourseRepository;
import com.coursenexus.repository.LearningRepository;
import com.coursenexus.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@RequiredArgsConstructor
@Service
public class LearningService {

    private final LearningRepository learningRepository;

    private final UserRepository userRepository;

    private final CourseRepository courseRepository;

    private final com.coursenexus.repository.PaymentRepository paymentRepository;

    public List<Course> getLearningCourses(UUID userId) {
        Optional<User> optionalUser = userRepository.findById(userId);
        
        if (optionalUser.isPresent()) {
            User user = optionalUser.get();
            List<Course> learningCourses = new ArrayList<>();

            for (Learning learning : user.getLearningCourses()) {
                Course course = learning.getCourse();
                learningCourses.add(course);
            }

            return learningCourses;
        }

        return null;
    }
    
    public List<Learning> getEnrollments() {
    	return learningRepository.findAll();
    }

    public String enrollCourse(EnrollRequest enrollRequest) {
        User user = userRepository.findById(enrollRequest.getUserId()).orElse(null);
        Course course = courseRepository.findById(enrollRequest.getCourseId()).orElse(null);

        if (user != null && course != null) {
            Learning existingLearning = learningRepository.findByUserAndCourse(user, course);
            if (existingLearning != null) {
                return "Course already enrolled";
            }

            Learning learning = new Learning();
            learning.setUser(user);
            learning.setCourse(course);
            learningRepository.save(learning);

            // Payment record is handled by PaymentController for paid courses

            return "Enrolled successfully";
        }

        return "Failed to enroll";
    }


    public void unenrollCourse(UUID id) {
        learningRepository.deleteById(id);
    }

    public String updateProgress(UUID userId, UUID courseId, int percent) {
        User user = userRepository.findById(userId).orElse(null);
        Course course = courseRepository.findById(courseId).orElse(null);

        if (user != null && course != null) {
            Learning learning = learningRepository.findByUserAndCourse(user, course);
            if (learning != null) {
                // Ensure progress only increases and caps at 100
                int newPercent = Math.max(learning.getProgressPercent(), Math.min(100, percent));
                learning.setProgressPercent(newPercent);
                learningRepository.save(learning);
                return "Progress updated successfully";
            }
        }
        return "Failed to update progress";
    }

    public int getProgress(UUID userId, UUID courseId) {
        User user = userRepository.findById(userId).orElse(null);
        Course course = courseRepository.findById(courseId).orElse(null);

        if (user != null && course != null) {
            Learning learning = learningRepository.findByUserAndCourse(user, course);
            if (learning != null) {
                return learning.getProgressPercent();
            }
        }
        return 0;
    }
}


