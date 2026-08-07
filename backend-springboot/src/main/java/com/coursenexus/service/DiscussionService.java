package com.coursenexus.service;

import com.coursenexus.dto.DiscussionRequest;
import com.coursenexus.entity.Course;
import com.coursenexus.entity.Discussion;
import com.coursenexus.repository.DiscussionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@RequiredArgsConstructor
@Service
public class DiscussionService {

    private final DiscussionRepository discussionRepository;
    private final com.coursenexus.repository.CourseRepository courseRepository;

    public List<Discussion> getDiscussionsCourse(UUID courseId) {
        Course course = courseRepository.findById(courseId).orElseThrow(() -> new RuntimeException("Course not found"));
        return discussionRepository.findByCourseAndParentIsNull(course);
    }
    public Discussion createDiscussion( DiscussionRequest discussionRequest) {
        Course course = courseRepository.findById(discussionRequest.getCourse_id()).orElseThrow(() -> new RuntimeException("Course not found"));
        Discussion discussion = new Discussion();
        discussion.setUserName(discussionRequest.getName());
        discussion.setCourse(course);
        discussion.setContent(discussionRequest.getContent());
        if (discussionRequest.getParentId() != null) {
            Discussion parent = discussionRepository.findById(discussionRequest.getParentId()).orElse(null);
            discussion.setParent(parent);
        }
        return discussionRepository.save(discussion);
    }
}

