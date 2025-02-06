package com.yourcaryourway.chat_support.controller;

import com.yourcaryourway.chat_support.dtos.ChatMessageDTO;
import com.yourcaryourway.chat_support.services.ChatMessageService;
import org.slf4j.Logger;
import org.springframework.messaging.handler.annotation.*;
import org.springframework.messaging.simp.annotation.SubscribeMapping;
import org.springframework.stereotype.Controller;

import java.util.UUID;

@Controller
public class ChatWebSocketController {
    private final ChatMessageService chatMessageService;
    private static final Logger log = org.slf4j.LoggerFactory.getLogger(ChatWebSocketController.class);

    public ChatWebSocketController( ChatMessageService chatMessageService) {
        this.chatMessageService = chatMessageService;
    }

    /**
     * Handles new chat messages sent by clients.
     * The destination will be /app/chat/{sessionId}/message
     */
    @MessageMapping("/chat/{sessionId}/message")
    @SendTo("/topic/chat/{sessionId}")
    public ChatMessageDTO handleChatMessage(@DestinationVariable UUID sessionId,
                                  @Payload ChatMessageDTO message,
                                  @Header("simpUser") String userId) {
        log.debug("Received message for session {}: {}", sessionId, message);


        // Process and save the message
        // Broadcast the message to all users in this session
        return chatMessageService.saveMessage(message, sessionId, UUID.fromString(userId));
    }

    /**
     * Handles user subscription to a chat session.
     * This is called when a user first connects to a session.
     */
    @SubscribeMapping("/chat/{sessionId}")
    public void handleSessionSubscription(@DestinationVariable UUID sessionId,
                                          @Header("simpUser") String userId) {
        log.info("User {} subscribed to chat session {}", userId, sessionId);

    }
}