package com.coursenexus.dto;

import lombok.Data;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
public class PaymentDTO {
    private UUID id;
    private int amount;
    private LocalDateTime paymentDate;
    private String status;
    private String razorpayPaymentId;
    
    private CourseSummaryDTO course;
    private UserSummaryDTO user;
    
    @Data
    public static class CourseSummaryDTO {
        private UUID course_id;
        private String course_name;
    }
    
    @Data
    public static class UserSummaryDTO {
        private UUID id;
        private String email;
    }
}
