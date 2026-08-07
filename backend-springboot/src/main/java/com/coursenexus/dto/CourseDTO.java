package com.coursenexus.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import java.util.UUID;

@Data
public class CourseDTO {
    private UUID course_id;
    
    @JsonProperty("course_name")
    private String course_name;
    
    private int price;
    
    private String instructor;
    
    private UUID instructorId;
    
    private String description;
    
    private String p_link;
    
    private String y_link;
    
    @JsonProperty("approved")
    private Boolean isApproved;
}
