package com.coursenexus.repository;

import com.coursenexus.entity.Video;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;
import java.util.List;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface VideoRepository extends JpaRepository<Video, UUID> {
    @Query("SELECT v FROM Video v WHERE v.course.course_id = :courseId")
    List<Video> findByCourse_Course_id(@Param("courseId") UUID courseId);
}

