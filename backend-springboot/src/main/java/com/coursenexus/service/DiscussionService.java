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
    private final CourseService courseService;

    public List<Discussion> getDiscussionsCourse(UUID courseId) {
        Course course = courseService.getCourseById(courseId);
        return discussionRepository.findByCourseAndParentIsNull(course);
    }
    public Discussion createDiscussion( DiscussionRequest discussionRequest) {
        Course course = courseService.getCourseById(discussionRequest.getCourse_id());
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

