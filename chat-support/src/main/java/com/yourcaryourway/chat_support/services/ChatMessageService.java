package com.yourcaryourway.chat_support.services;

import com.yourcaryourway.chat_support.dtos.ChatMessageDTO;
import com.yourcaryourway.chat_support.models.ChatMessage;
import com.yourcaryourway.chat_support.models.ChatSession;
import com.yourcaryourway.chat_support.models.MessageStatus;
import com.yourcaryourway.chat_support.models.SessionStatus;
import com.yourcaryourway.chat_support.repositories.ChatMessageRepository;
import com.yourcaryourway.chat_support.repositories.ChatSessionRepository;
import com.yourcaryourway.chat_support.repositories.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@Slf4j
public class ChatMessageService {
    private final ChatMessageRepository chatMessageRepository;
    private final ChatSessionRepository chatSessionRepository;
    private final UserRepository userRepository;

    public ChatMessageService(ChatMessageRepository chatMessageRepository, ChatSessionRepository chatSessionRepository, UserRepository userRepository) {
        this.chatMessageRepository = chatMessageRepository;
        this.chatSessionRepository = chatSessionRepository;
        this.userRepository = userRepository;
    }
    /**
     * Saves a new chat message and updates related entities
     */
    @Transactional
    public ChatMessageDTO saveMessage(ChatMessageDTO messageDTO, UUID sessionId, UUID senderId) {
        // Validate the chat session is active
        ChatSession session = chatSessionRepository.findById(sessionId)
                .filter(s -> s.getStatus() == SessionStatus.ACTIVE)
                .orElseThrow(() -> new IllegalArgumentException("Chat session is not active"));

        // Create and save the message
        ChatMessage message = new ChatMessage();
        message.setChatSession(session);
        message.setSender(userRepository.findById(senderId).get());
        message.setContent(messageDTO.content());
        message.setStatus(MessageStatus.SENT);

        ChatMessage savedMessage = chatMessageRepository.save(message);

        // Convert to DTO and return
        return new ChatMessageDTO(
            savedMessage.getMessageId(),
            savedMessage.getContent(),
            savedMessage.getTimestamp(),
            savedMessage.getSender().getId(),
            savedMessage.getStatus().toString()
        );
    }
}