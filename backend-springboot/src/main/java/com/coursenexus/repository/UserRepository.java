package com.coursenexus.repository;

import com.coursenexus.enums.UserRole;
import org.springframework.data.jpa.repository.JpaRepository;

import com.coursenexus.entity.User;

import java.util.UUID;

public interface UserRepository extends JpaRepository<User, UUID> {

    User findByEmail(String email);

    boolean existsByRole(UserRole role);

    User findByEmailAndPassword(String email, String password);
}

