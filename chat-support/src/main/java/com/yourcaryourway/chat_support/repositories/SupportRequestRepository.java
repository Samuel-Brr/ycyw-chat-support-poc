package com.yourcaryourway.chat_support.repositories;

import com.yourcaryourway.chat_support.models.SupportRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface SupportRequestRepository extends JpaRepository<SupportRequest, UUID> {
    List<SupportRequest> findAllByUserId(UUID userId);
}