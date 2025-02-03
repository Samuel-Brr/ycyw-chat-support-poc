package com.yourcaryourway.chat_support.services;

import com.yourcaryourway.chat_support.dtos.ChatMessageDTO;
import com.yourcaryourway.chat_support.dtos.SupportRequestDTO;
import com.yourcaryourway.chat_support.dtos.SupportRequestsResponse;
import com.yourcaryourway.chat_support.dtos.ChatMessagesResponse;
import com.yourcaryourway.chat_support.models.*;
import com.yourcaryourway.chat_support.repositories.ChatSessionRepository;
import com.yourcaryourway.chat_support.repositories.SupportRequestRepository;
import com.yourcaryourway.chat_support.repositories.UserRepository;
import com.yourcaryourway.chat_support.repositories.ChatMessageRepository;
import lombok.extern.slf4j.Slf4j;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Slf4j
@Service
public class SupportRequestService {
    private static final Logger logger = LoggerFactory.getLogger(SupportRequestService.class);
    private final SupportRequestRepository supportRequestRepository;
    private final ChatSessionRepository chatSessionRepository;
    private final UserRepository userRepository;
    private final ChatMessageRepository chatMessageRepository;

    public SupportRequestService(SupportRequestRepository supportRequestRepository, ChatSessionRepository chatSessionRepository, UserRepository userRepository, ChatMessageRepository chatMessageRepository) {
        this.supportRequestRepository = supportRequestRepository;
        this.chatSessionRepository = chatSessionRepository;
        this.userRepository = userRepository;
        this.chatMessageRepository = chatMessageRepository;
    }

    /**
     * Creates a new support request and associated chat session for a user.
     * This operation is transactional to ensure both entities are created together.
     *
     * @param userId The ID of the user creating the support request
     * @return SupportRequestCreationResponse containing the new session details
     */
    @Transactional
    public UUID createSupportRequest(UUID userId) {
        logger.info("Creating new support request for user: {}", userId);

        // Create the support request
        SupportRequest supportRequest = new SupportRequest();
        supportRequest.setUser(userRepository.findById(userId).get());
        supportRequest.setType(RequestType.CHAT);
        supportRequest.setStatus(RequestStatus.NEW);
        supportRequest.setPriority(RequestPriority.MEDIUM); // Default priority

        // Save the support request
        SupportRequest savedRequest = supportRequestRepository.save(supportRequest);

        // Create associated chat session
        ChatSession chatSession = new ChatSession();
        chatSession.setSupportRequest(savedRequest);
        chatSession.setStatus(SessionStatus.ACTIVE);

        // Save the chat session
        ChatSession savedSession = chatSessionRepository.save(chatSession);
        logger.debug("Created chat session with ID: {}", savedSession.getSessionId());

        return savedSession.getSessionId();
    }

    public SupportRequestsResponse getUserSupportRequests(UUID userId) {
        List<SupportRequestDTO> requests = supportRequestRepository.findAllByUserId(userId).stream()
            .map(request -> {
                ChatMessageDTO lastMessage = new ChatMessageDTO(new UUID(0L,0L), "Hello", LocalDateTime.now(), new UUID(0L,0L), "READ");
                String agentName = request.getAgent() != null ? request.getAgent().getFirstName() : null;
                int unreadCount = 0;
                ChatSession chatSession = chatSessionRepository.findBySupportRequest(request);

                return new SupportRequestDTO(
                    chatSession.getSessionId(),
                    request.getStatus().toString(),
                    agentName,
                    lastMessage,
                    unreadCount
                );
            })
            .toList();

        return new SupportRequestsResponse(requests);
    }

    public ChatMessagesResponse getChatMessages(UUID chatSessionId) {
        logger.info("Fetching messages for chat session: {}", chatSessionId);
        
        ChatSession chatSession = chatSessionRepository.findById(chatSessionId)
            .orElseThrow(() -> new RuntimeException("Chat session not found"));

        List<ChatMessageDTO> messages = chatMessageRepository.findByChatSessionOrderByTimestampAsc(chatSession)
            .stream()
            .map(message -> new ChatMessageDTO(
                message.getMessageId(),
                message.getContent(),
                message.getTimestamp(),
                message.getSender().getId(),
                "DEFAULT"
            ))
            .toList();

        return new ChatMessagesResponse(messages);
    }
} 