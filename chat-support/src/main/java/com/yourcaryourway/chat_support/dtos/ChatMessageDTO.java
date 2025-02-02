package com.yourcaryourway.chat_support.dtos;

import java.time.LocalDateTime;

public record ChatMessageDTO(
    Long id,
    String content,
    LocalDateTime timestamp,
    Long sender,
    String status
) {} 