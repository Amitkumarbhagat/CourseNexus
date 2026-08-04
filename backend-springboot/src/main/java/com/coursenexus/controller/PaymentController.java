package com.coursenexus.controller;

import com.coursenexus.entity.Course;
import com.coursenexus.entity.Payment;
import com.coursenexus.entity.User;
import com.coursenexus.payload.OrderRequest;
import com.coursenexus.payload.PaymentVerificationRequest;
import com.coursenexus.repository.CourseRepository;
import com.coursenexus.repository.PaymentRepository;
import com.coursenexus.repository.UserRepository;
import com.coursenexus.dto.EnrollRequest;
import com.coursenexus.service.LearningService;
import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.razorpay.Utils;
import lombok.RequiredArgsConstructor;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentRepository paymentRepository;
    private final CourseRepository courseRepository;
    private final UserRepository userRepository;
    private final LearningService learningService;
    private final RazorpayClient razorpayClient;

    @Value("${razorpay.key.secret}")
    private String keySecret;

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/all")
    public List<Payment> getAllPayments() {
        return paymentRepository.findAll();
    }

    @PreAuthorize("hasRole('INSTRUCTOR')")
    @GetMapping("/instructor/{instructorId}")
    public List<Payment> getInstructorPayments(@PathVariable UUID instructorId) {
        return paymentRepository.findByCourse_InstructorId(instructorId);
    }

    @PostMapping("/createOrder")
    public ResponseEntity<?> createOrder(@RequestBody OrderRequest orderRequest) {
        try {
            Course course = courseRepository.findById(orderRequest.getCourseId())
                    .orElseThrow(() -> new RuntimeException("Course not found"));
            
            // Amount in paise (1 INR = 100 Paise)
            int amountInPaise = orderRequest.getAmount() * 100;

            JSONObject orderRequestJson = new JSONObject();
            orderRequestJson.put("amount", amountInPaise);
            orderRequestJson.put("currency", "INR");
            orderRequestJson.put("receipt", "receipt_" + System.currentTimeMillis());

            Order order = razorpayClient.orders.create(orderRequestJson);
            return ResponseEntity.ok(order.toString());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error creating order");
        }
    }

    @PostMapping("/verify")
    public ResponseEntity<?> verifyPayment(@RequestBody PaymentVerificationRequest request) {
        try {
            JSONObject options = new JSONObject();
            options.put("razorpay_order_id", request.getRazorpayOrderId());
            options.put("razorpay_payment_id", request.getRazorpayPaymentId());
            options.put("razorpay_signature", request.getRazorpaySignature());

            boolean isValid = Utils.verifyPaymentSignature(options, keySecret);

            if (isValid) {
                User user = userRepository.findById(request.getUserId())
                        .orElseThrow(() -> new RuntimeException("User not found"));
                Course course = courseRepository.findById(request.getCourseId())
                        .orElseThrow(() -> new RuntimeException("Course not found"));

                // Record payment
                Payment payment = new Payment();
                payment.setUser(user);
                payment.setCourse(course);
                payment.setAmount(request.getAmount());
                payment.setPaymentDate(LocalDateTime.now());
                payment.setStatus("SUCCESS");
                payment.setRazorpayPaymentId(request.getRazorpayPaymentId());
                paymentRepository.save(payment);

                // Enroll user
                EnrollRequest enrollRequest = new EnrollRequest(user.getId(), course.getCourse_id());
                learningService.enrollCourse(enrollRequest);

                return ResponseEntity.ok(Map.of("message", "Payment verified and user enrolled successfully"));
            } else {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", "Invalid signature"));
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("message", "Error verifying payment"));
        }
    }
}
