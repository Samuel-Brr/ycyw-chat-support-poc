package com.yourcaryourway.chat_support.repositories;

import com.yourcaryourway.chat_support.models.ChatMessage;
import com.yourcaryourway.chat_support.models.ChatSession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {
    List<ChatMessage> findByChatSessionOrderByTimestampAsc(ChatSession chatSession);
}