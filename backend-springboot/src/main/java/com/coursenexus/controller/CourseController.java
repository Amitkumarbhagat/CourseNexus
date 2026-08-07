package com.coursenexus.controller;

import com.coursenexus.dto.CourseDTO;
import com.coursenexus.entity.Course;
import com.coursenexus.service.CourseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/courses")
public class CourseController {

    @Autowired
    private CourseService courseService;

    @GetMapping
    @Cacheable(value = "courses", key = "'approved'")
    public List<CourseDTO> getAllCourses() {
        return courseService.getAllApprovedCourses();
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/all")
    @Cacheable(value = "courses", key = "'all'")
    public List<CourseDTO> getAllCoursesAdmin() {
        return courseService.getAllCourses();
    }

    @GetMapping("/{id}")
    public CourseDTO getCourseById(@PathVariable UUID id) {
        return courseService.getCourseById(id);
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'INSTRUCTOR')")
    @GetMapping("/instructor/{instructorId}")
    public List<CourseDTO> getCoursesByInstructor(@PathVariable UUID instructorId) {
        return courseService.getCoursesByInstructorId(instructorId);
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'INSTRUCTOR')")
    @PostMapping
    @CacheEvict(value = "courses", allEntries = true)
    public CourseDTO createCourse(@RequestBody Course course) {
        return courseService.createCourse(course);
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'INSTRUCTOR')")
    @PutMapping("/{id}")
    @CacheEvict(value = "courses", allEntries = true)
    public CourseDTO updateCourse(@PathVariable UUID id, @RequestBody Course course) {
        return courseService.updateCourse(id, course);
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'INSTRUCTOR')")
    @DeleteMapping("/{id}")
    @CacheEvict(value = "courses", allEntries = true)
    public void deleteCourse(@PathVariable UUID id) {
        courseService.deleteCourse(id);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PatchMapping("/{id}/approve")
    @CacheEvict(value = "courses", allEntries = true)
    public CourseDTO approveCourse(@PathVariable UUID id) {
        return courseService.approveCourse(id);
    }
}
