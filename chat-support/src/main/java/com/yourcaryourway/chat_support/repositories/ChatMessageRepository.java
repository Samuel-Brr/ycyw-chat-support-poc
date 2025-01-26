package com.yourcaryourway.chat_support.repositories;

import com.yourcaryourway.chat_support.models.ChatMessage;
import com.yourcaryourway.chat_support.models.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ChatMessageRepository extends JpaRepository<ChatMessage, UUID> {
    
    // Find messages by chat session with pagination
    Page<ChatMessage> findByChatSession_SessionIdOrderByTimestampDesc(UUID sessionId, Pageable pageable);
    
    // Find messages by sender
    List<ChatMessage> findBySender(User sender);
}