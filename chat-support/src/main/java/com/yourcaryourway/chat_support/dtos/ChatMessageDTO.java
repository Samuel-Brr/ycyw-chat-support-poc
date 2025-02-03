package com.yourcaryourway.chat_support.dtos;

import java.time.LocalDateTime;
import java.util.UUID;

public record ChatMessageDTO(
    UUID id,
    String content,
    LocalDateTime timestamp,
    UUID sender,
    String status
) {} 