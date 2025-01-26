package com.yourcaryourway.chat_support.repositories;

import com.yourcaryourway.chat_support.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserRepository extends JpaRepository<User, UUID> {
    
    // Find user by email (for authentication)
    Optional<User> findByEmail(String email);
}