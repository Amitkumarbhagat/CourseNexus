package com.coursenexus.service;

import com.coursenexus.dto.FeedbackRequest;
import com.coursenexus.entity.Course;
import com.coursenexus.entity.Feedback;
import com.coursenexus.repository.CourseRepository;
import com.coursenexus.repository.FeedbackRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@RequiredArgsConstructor
@Service
public class FeedbackService {

    private final FeedbackRepository feedbackRepository;


    @Autowired
    private CourseRepository courseRepository;

    public List<Feedback> getFeedbacksForCourse(UUID courseId) {
        Course course = courseRepository.findById(courseId).orElse(null);
        if (course != null) {
            return course.getFeedbacks();
        }
        return null;
    }

    public String submitFeedback(FeedbackRequest fr) {
        Course course = courseRepository.findById(fr.getCourse_id()).orElse(null);

        if (course != null) {
            Feedback feedback = feedbackRepository.findByCourseAndUserId(course, fr.getUserId())
                    .orElse(new Feedback());

            feedback.setCourse(course);
            feedback.setComment(fr.getComment());
            feedback.setRating(fr.getRating());
            feedback.setUserName(fr.getUserName());
            feedback.setUserId(fr.getUserId());
            feedbackRepository.save(feedback);
            return "feedback submitted successfully";
        }
        return "feedback submition failed";
    }
}


