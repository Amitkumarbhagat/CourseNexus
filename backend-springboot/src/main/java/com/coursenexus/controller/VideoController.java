package com.coursenexus.controller;

import com.coursenexus.entity.Course;
import com.coursenexus.entity.Video;
import com.coursenexus.repository.CourseRepository;
import com.coursenexus.repository.VideoRepository;
import com.coursenexus.service.CloudinaryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/videos")
@RequiredArgsConstructor
public class VideoController {

    private final VideoRepository videoRepository;
    private final CourseRepository courseRepository;
    private final CloudinaryService cloudinaryService;

    @GetMapping("/course/{courseId}")
    public List<Video> getVideosByCourse(@PathVariable UUID courseId) {
        return videoRepository.findByCourse_Course_id(courseId);
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'INSTRUCTOR')")
    @PostMapping("/upload")
    public ResponseEntity<Map<String, String>> uploadVideoFile(@RequestParam("file") MultipartFile file) {
        try {
            String url = cloudinaryService.uploadVideo(file);
            Map<String, String> response = new HashMap<>();
            response.put("url", url);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'INSTRUCTOR')")
    @PostMapping("/course/{courseId}")
    public ResponseEntity<Video> addVideo(@PathVariable UUID courseId, @RequestBody Video video) {
        Course course = courseRepository.findById(courseId).orElse(null);
        if (course == null) return ResponseEntity.notFound().build();
        
        video.setCourse(course);
        return ResponseEntity.ok(videoRepository.save(video));
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'INSTRUCTOR')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteVideo(@PathVariable UUID id) {
        if (!videoRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        videoRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }
}

