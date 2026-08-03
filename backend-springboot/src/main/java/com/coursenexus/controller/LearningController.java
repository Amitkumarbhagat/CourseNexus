package com.coursenexus.controller;

import com.coursenexus.dto.EnrollRequest;
import com.coursenexus.entity.Course;
import com.coursenexus.entity.Learning;
import com.coursenexus.service.LearningService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/learning")
public class LearningController {

    @Autowired
    private LearningService learningService;

    @GetMapping("/{userId}")
    public List<Course> getLearningCourses(@PathVariable UUID userId) {
        return learningService.getLearningCourses(userId);
    }
    
    @GetMapping
    public List<Learning> getEnrollments() {
        return learningService.getEnrollments();
    }

    @PostMapping
    public String enrollCourse(@RequestBody EnrollRequest enrollRequest) {
        return learningService.enrollCourse(enrollRequest);
    }

    @DeleteMapping("/{id}")
    public void unenrollCourse(@PathVariable UUID id) {
        learningService.unenrollCourse(id);
    }

    @PutMapping("/update-progress/{userId}/{courseId}")
    public String updateProgress(@PathVariable UUID userId, @PathVariable UUID courseId, @RequestParam int percent) {
        return learningService.updateProgress(userId, courseId, percent);
    }

    @GetMapping("/progress/{userId}/{courseId}")
    public int getProgress(@PathVariable UUID userId, @PathVariable UUID courseId) {
        return learningService.getProgress(userId, courseId);
    }
}

