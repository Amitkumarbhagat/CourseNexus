package com.coursenexus.controller;

import com.coursenexus.dto.PaymentDTO;
import com.coursenexus.payload.OrderRequest;
import com.coursenexus.payload.PaymentVerificationRequest;
import com.coursenexus.service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/all")
    public List<PaymentDTO> getAllPayments() {
        return paymentService.getAllPayments();
    }

    @PreAuthorize("hasRole('INSTRUCTOR')")
    @GetMapping("/instructor/{instructorId}")
    public List<PaymentDTO> getInstructorPayments(@PathVariable UUID instructorId) {
        return paymentService.getInstructorPayments(instructorId);
    }

    @PostMapping("/createOrder")
    public ResponseEntity<String> createOrder(@RequestBody OrderRequest orderRequest) {
        String orderResponse = paymentService.createOrder(orderRequest);
        return ResponseEntity.ok(orderResponse);
    }

    @PostMapping("/verify")
    public ResponseEntity<Map<String, String>> verifyPayment(@RequestBody PaymentVerificationRequest request) {
        Map<String, String> response = paymentService.verifyPayment(request);
        return ResponseEntity.ok(response);
    }
}
