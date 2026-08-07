package com.coursenexus.service;

import com.coursenexus.dto.UserDTO;
import com.coursenexus.entity.User;
import com.coursenexus.exception.BadRequestException;
import com.coursenexus.exception.ResourceNotFoundException;
import com.coursenexus.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public List<UserDTO> getAllUsers() {
        return userRepository.findAll().stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    public UserDTO getUserById(UUID id) {
        User user = getUserEntityById(id);
        return mapToDTO(user);
    }
    
    public User getUserEntityById(UUID id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
    }

    public UserDTO createUser(User user) {
        if (userRepository.findByEmail(user.getEmail()) != null) {
            throw new BadRequestException("Email already exists");
        }
        if (user.getRole() == null) {
            user.setRole(com.coursenexus.enums.UserRole.USER);
        }
        if (user.getIsActive() == null) {
            user.setIsActive(true);
        }
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return mapToDTO(userRepository.save(user));
    }

    public void updateUserProfile(MultipartFile file, UUID id) throws IOException {
        User user = getUserEntityById(id);
        user.setProfileImage(file.getBytes());
        userRepository.save(user);
    }

    public UserDTO updateUser(UUID id, User updatedUser) {
        User existingUser = getUserEntityById(id);
        
        existingUser.setUsername(updatedUser.getUsername());
        existingUser.setEmail(updatedUser.getEmail());
        existingUser.setDob(updatedUser.getDob());
        existingUser.setMobileNumber(updatedUser.getMobileNumber());
        existingUser.setGender(updatedUser.getGender());
        existingUser.setLocation(updatedUser.getLocation());
        existingUser.setProfession(updatedUser.getProfession());
        existingUser.setLinkedin_url(updatedUser.getLinkedin_url());
        existingUser.setGithub_url(updatedUser.getGithub_url());
        
        // Add missing fields for Admin updates
        if (updatedUser.getRole() != null) {
            existingUser.setRole(updatedUser.getRole());
        }
        if (updatedUser.getIsActive() != null) {
            existingUser.setIsActive(updatedUser.getIsActive());
        }
        
        return mapToDTO(userRepository.save(existingUser));
    }
    
    public UserDTO getUserByEmail(String email) {
        User user = userRepository.findByEmail(email);
        if (user == null) {
            throw new ResourceNotFoundException("User not found with email: " + email);
        }
        return mapToDTO(user);
    }
    
    public User authenticateUser(String email, String password) {
        return userRepository.findByEmailAndPassword(email, password);
    }

    public void deleteUser(UUID id) {
        User user = getUserEntityById(id);
        userRepository.delete(user);
    }

    public boolean resetPasswordWithDetails(String email, String username, String dob, String mobileNumber, String newPassword) {
        User user = userRepository.findByEmail(email);
        if (user != null 
            && username.equals(user.getUsername()) 
            && dob.equals(user.getDob()) 
            && mobileNumber.equals(user.getMobileNumber())) {
            
            user.setPassword(passwordEncoder.encode(newPassword));
            userRepository.save(user);
            return true;
        }
        return false;
    }
    
    private UserDTO mapToDTO(User user) {
        UserDTO dto = new UserDTO();
        dto.setId(user.getId());
        dto.setUsername(user.getUsername());
        dto.setEmail(user.getEmail());
        dto.setMobileNumber(user.getMobileNumber());
        dto.setRole(user.getRole());
        dto.setIsActive(user.getIsActive());
        dto.setDob(user.getDob());
        dto.setGender(user.getGender());
        dto.setLocation(user.getLocation());
        dto.setProfession(user.getProfession());
        dto.setLinkedin_url(user.getLinkedin_url());
        dto.setGithub_url(user.getGithub_url());
        return dto;
    }
}
