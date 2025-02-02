package com.yourcaryourway.chat_support.repositories;

import com.yourcaryourway.chat_support.models.ChatSession;
import com.yourcaryourway.chat_support.models.SupportRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface ChatSessionRepository extends JpaRepository<ChatSession, UUID> {
    ChatSession findBySupportRequest(SupportRequest supportRequest);
}