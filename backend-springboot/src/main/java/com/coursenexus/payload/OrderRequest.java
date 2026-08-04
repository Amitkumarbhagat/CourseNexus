package com.coursenexus.payload;

import lombok.Data;
import java.util.UUID;

@Data
public class OrderRequest {
    private int amount; // Amount in rupees
    private UUID courseId;
    private UUID userId;
}
