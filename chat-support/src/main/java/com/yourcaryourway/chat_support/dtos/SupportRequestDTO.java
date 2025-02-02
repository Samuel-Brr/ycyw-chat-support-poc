package com.yourcaryourway.chat_support.dtos;

import java.util.UUID;

public record SupportRequestDTO(
    UUID id,
    String status,
    String agentName,
    ChatMessageDTO lastMessage,
    int unreadCount
) {} 