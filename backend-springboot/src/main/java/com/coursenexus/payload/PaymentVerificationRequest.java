package com.coursenexus.payload;

import lombok.Data;
import java.util.UUID;

@Data
public class PaymentVerificationRequest {
    private String razorpayOrderId;
    private String razorpayPaymentId;
    private String razorpaySignature;
    private UUID courseId;
    private UUID userId;
    private int amount;
}
