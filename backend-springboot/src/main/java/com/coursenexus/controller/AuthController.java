package com.coursenexus.controller;

import com.coursenexus.dto.ApiResponse;
import com.coursenexus.dto.JwtResponseDTO;
import com.coursenexus.dto.LoginRequestDTO;
import com.coursenexus.entity.User;
import com.coursenexus.security.UserPrincipal;
import com.coursenexus.security.util.JwtUtils;
import com.coursenexus.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Slf4j
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtUtils jwtUtils;
    private final UserService authService;

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<JwtResponseDTO>> login(@Valid @RequestBody LoginRequestDTO loginRequest) {
        log.info("Login attempt for email: {}", loginRequest.getEmail());

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getEmail(),
                        loginRequest.getPassword()
                )
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);

        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();

        JwtResponseDTO jwtResponse = JwtResponseDTO.builder()
                .token(jwt)
                .type("Bearer")
                .id(userPrincipal.getId())
                .email(userPrincipal.getEmail())
                .name(userPrincipal.getName())
                .role(userPrincipal.getAuthorities().iterator().next().getAuthority())
                .build();

        log.info("User logged in successfully: {}", loginRequest.getEmail());
        return ResponseEntity.ok(new ApiResponse<>("Login successful", jwtResponse));
    }

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<User>> register(@Valid @RequestBody User signUpRequest) {
        log.info("Registration attempt for email: {}", signUpRequest.getEmail());

        User user = authService.createUser(signUpRequest);

        log.info("User registered successfully: {}", signUpRequest.getEmail());
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new ApiResponse<>("User registered successfully", user));
    }

    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<Void>> logout() {
        SecurityContextHolder.clearContext();
        return ResponseEntity.ok(new ApiResponse<>("Logout successful", null));
    }

    @PostMapping("/reset-password-with-details")
    public ResponseEntity<ApiResponse<Void>> resetPasswordWithDetails(@Valid @RequestBody com.coursenexus.dto.ResetPasswordRequestDTO request) {
        boolean success = authService.resetPasswordWithDetails(
            request.getEmail(), 
            request.getUsername(), 
            request.getDob(), 
            request.getMobileNumber(), 
            request.getNewPassword()
        );
        
        if (success) {
            return ResponseEntity.ok(new ApiResponse<>("Password reset successfully", null));
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new ApiResponse<>("Invalid user details provided", null));
        }
    }
}
