package com.yourcaryourway.chat_support.controller;

import com.yourcaryourway.chat_support.dtos.ChatMessageDTO;
import com.yourcaryourway.chat_support.services.ChatMessageService;
import com.yourcaryourway.chat_support.services.UserInfoService;
import org.slf4j.Logger;
import org.springframework.messaging.handler.annotation.*;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.annotation.SubscribeMapping;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;

import java.util.UUID;

@Controller
public class ChatWebSocketController {
    private final ChatMessageService chatMessageService;
    private final UserInfoService userInfoService;
    private static final Logger log = org.slf4j.LoggerFactory.getLogger(ChatWebSocketController.class);

    public ChatWebSocketController(ChatMessageService chatMessageService, UserInfoService userInfoService) {
        this.chatMessageService = chatMessageService;
        this.userInfoService = userInfoService;
    }

    /**
     * Handles new chat messages sent by clients.
     */
    @MessageMapping("/chat/{sessionId}/message")
    @SendTo("/topic/chat/{sessionId}")
    public ChatMessageDTO handleChatMessage(
            @DestinationVariable UUID sessionId,
            @Payload ChatMessageDTO message,
            SimpMessageHeaderAccessor headerAccessor) {

        // Get authentication from the message headers
        Authentication authentication = (Authentication) headerAccessor.getUser();
        if (authentication == null) {
            log.error("No authentication found for message");
            throw new IllegalStateException("User not authenticated");
        }

        // Extract user ID from the authentication principal
        String userEmail = authentication.getName(); // This will be the user's email from JWT
        log.debug("Received message for session {} from user {}", sessionId, userEmail);

        // Get the actual user ID from the email (you'll need to add this method to your service)
        UUID actualUserId = userInfoService.getUserByEmail(userEmail).getId();

        // Process and save the message
        return chatMessageService.saveMessage(message, sessionId, actualUserId);
    }

    /**
     * Handles user subscription to a chat session.
     */
    @SubscribeMapping("/chat/{sessionId}")
    public void handleSessionSubscription(
            @DestinationVariable UUID sessionId,
            SimpMessageHeaderAccessor headerAccessor) {

        Authentication authentication = (Authentication) headerAccessor.getUser();
        if (authentication == null) {
            log.error("No authentication found for subscription");
            throw new IllegalStateException("User not authenticated");
        }

        String userEmail = authentication.getName();
        log.info("User {} subscribed to chat session {}", userEmail, sessionId);
    }
}