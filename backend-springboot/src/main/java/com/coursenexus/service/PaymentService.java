package com.coursenexus.service;

import com.coursenexus.dto.EnrollRequest;
import com.coursenexus.dto.PaymentDTO;
import com.coursenexus.entity.Course;
import com.coursenexus.entity.Payment;
import com.coursenexus.entity.User;
import com.coursenexus.exception.BadRequestException;
import com.coursenexus.exception.ResourceNotFoundException;
import com.coursenexus.payload.OrderRequest;
import com.coursenexus.payload.PaymentVerificationRequest;
import com.coursenexus.repository.CourseRepository;
import com.coursenexus.repository.PaymentRepository;
import com.coursenexus.repository.UserRepository;
import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import com.razorpay.Utils;
import lombok.RequiredArgsConstructor;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Service
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final CourseRepository courseRepository;
    private final UserRepository userRepository;
    private final LearningService learningService;
    private final RazorpayClient razorpayClient;

    @Value("${razorpay.key.secret}")
    private String keySecret;

    public List<PaymentDTO> getAllPayments() {
        return paymentRepository.findAll().stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    public List<PaymentDTO> getInstructorPayments(UUID instructorId) {
        return paymentRepository.findByCourse_InstructorId(instructorId).stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    public String createOrder(OrderRequest orderRequest) {
        courseRepository.findById(orderRequest.getCourseId())
                .orElseThrow(() -> new ResourceNotFoundException("Course not found"));
        
        int amountInPaise = orderRequest.getAmount() * 100;

        try {
            JSONObject orderRequestJson = new JSONObject();
            orderRequestJson.put("amount", amountInPaise);
            orderRequestJson.put("currency", "INR");
            orderRequestJson.put("receipt", "receipt_" + System.currentTimeMillis());

            Order order = razorpayClient.orders.create(orderRequestJson);
            return order.toString();
        } catch (RazorpayException e) {
            throw new RuntimeException("Error creating Razorpay order: " + e.getMessage());
        }
    }

    public Map<String, String> verifyPayment(PaymentVerificationRequest request) {
        try {
            JSONObject options = new JSONObject();
            options.put("razorpay_order_id", request.getRazorpayOrderId());
            options.put("razorpay_payment_id", request.getRazorpayPaymentId());
            options.put("razorpay_signature", request.getRazorpaySignature());

            boolean isValid = Utils.verifyPaymentSignature(options, keySecret);

            if (!isValid) {
                throw new BadRequestException("Invalid payment signature");
            }

            User user = userRepository.findById(request.getUserId())
                    .orElseThrow(() -> new ResourceNotFoundException("User not found"));
            Course course = courseRepository.findById(request.getCourseId())
                    .orElseThrow(() -> new ResourceNotFoundException("Course not found"));

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

            return Map.of("message", "Payment verified and user enrolled successfully");
        } catch (RazorpayException e) {
            throw new RuntimeException("Error verifying payment signature: " + e.getMessage());
        }
    }
    
    private PaymentDTO mapToDTO(Payment payment) {
        PaymentDTO dto = new PaymentDTO();
        dto.setId(payment.getId());
        dto.setAmount(payment.getAmount());
        dto.setPaymentDate(payment.getPaymentDate());
        dto.setStatus(payment.getStatus());
        dto.setRazorpayPaymentId(payment.getRazorpayPaymentId());
        
        PaymentDTO.CourseSummaryDTO courseSummary = new PaymentDTO.CourseSummaryDTO();
        if (payment.getCourse() != null) {
            courseSummary.setCourse_id(payment.getCourse().getCourse_id());
            courseSummary.setCourse_name(payment.getCourse().getCourse_name());
        }
        dto.setCourse(courseSummary);
        
        PaymentDTO.UserSummaryDTO userSummary = new PaymentDTO.UserSummaryDTO();
        if (payment.getUser() != null) {
            userSummary.setId(payment.getUser().getId());
            userSummary.setEmail(payment.getUser().getEmail());
        }
        dto.setUser(userSummary);
        
        return dto;
    }
}
