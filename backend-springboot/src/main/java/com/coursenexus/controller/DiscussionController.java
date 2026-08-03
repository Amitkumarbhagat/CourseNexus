package com.coursenexus.controller;

import com.coursenexus.dto.DiscussionRequest;
import com.coursenexus.entity.Discussion;
import com.coursenexus.service.DiscussionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/discussions")
public class DiscussionController {

    @Autowired
    private DiscussionService discussionService;

    @GetMapping("/{courseId}")
    public ResponseEntity<List<Discussion>> getDiscussionsAndCourse(@PathVariable UUID courseId) {
        List<Discussion> discussions = discussionService.getDiscussionsCourse(courseId);
        return ResponseEntity.ok(discussions);
    }

    @PostMapping("/addMessage")
    public ResponseEntity<Discussion> createDiscussion(@RequestBody DiscussionRequest discussionRequest) {
        Discussion discussion = discussionService.createDiscussion(discussionRequest);
        return ResponseEntity.status(HttpStatus.CREATED).body(discussion);
    }
}

