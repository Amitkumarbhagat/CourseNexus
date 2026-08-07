package com.coursenexus.dto;

import com.coursenexus.enums.UserRole;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
public class UserDTO {
    private UUID id;
    private String username;
    private String email;
    private String mobileNumber;
    private UserRole role;
    
    @JsonProperty("isActive")
    private Boolean isActive;
    
    private String dob;
    private String gender;
    private String location;
    private String profession;
    private String linkedin_url;
    private String github_url;
    private String portfolio_url;
    private String description;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
