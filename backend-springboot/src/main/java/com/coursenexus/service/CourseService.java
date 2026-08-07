package com.coursenexus.service;

import com.coursenexus.dto.CourseDTO;
import com.coursenexus.entity.Course;
import com.coursenexus.exception.ResourceNotFoundException;
import com.coursenexus.repository.CourseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Service
public class CourseService {

    private final CourseRepository courseRepository;

    public List<CourseDTO> getAllCourses() {
        return courseRepository.findAll().stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    public List<CourseDTO> getAllApprovedCourses() {
        return courseRepository.findByIsApprovedTrue().stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    public List<CourseDTO> getCoursesByInstructorId(UUID instructorId) {
        return courseRepository.findByInstructorId(instructorId).stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    public CourseDTO getCourseById(UUID id) {
        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found with id: " + id));
        return mapToDTO(course);
    }

    public CourseDTO createCourse(Course course) {
        if (course.getIsApproved() == null) {
            course.setIsApproved(false);
        }
        Course savedCourse = courseRepository.save(course);
        return mapToDTO(savedCourse);
    }
    
    public CourseDTO approveCourse(UUID id) {
        Course existingCourse = courseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found with id: " + id));
        existingCourse.setIsApproved(true);
        return mapToDTO(courseRepository.save(existingCourse));
    }

    public CourseDTO updateCourse(UUID id, Course updatedCourse) {
        Course existingCourse = courseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found with id: " + id));
        
        existingCourse.setCourse_name(updatedCourse.getCourse_name());
        existingCourse.setDescription(updatedCourse.getDescription());
        existingCourse.setP_link(updatedCourse.getP_link());
        existingCourse.setY_link(updatedCourse.getY_link());
        existingCourse.setPrice(updatedCourse.getPrice());
        
        if (updatedCourse.getIsApproved() != null) {
            existingCourse.setIsApproved(updatedCourse.getIsApproved());
        }

        Course savedCourse = courseRepository.save(existingCourse);
        return mapToDTO(savedCourse);
    }

    public void deleteCourse(UUID id) {
        Course existingCourse = courseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found with id: " + id));
        courseRepository.delete(existingCourse);
    }
    
    // Mapping method
    private CourseDTO mapToDTO(Course course) {
        CourseDTO dto = new CourseDTO();
        dto.setCourse_id(course.getCourse_id());
        dto.setCourse_name(course.getCourse_name());
        dto.setPrice(course.getPrice());
        dto.setInstructor(course.getInstructor());
        dto.setInstructorId(course.getInstructorId());
        dto.setDescription(course.getDescription());
        dto.setP_link(course.getP_link());
        dto.setY_link(course.getY_link());
        dto.setIsApproved(course.getIsApproved());
        return dto;
    }
}
