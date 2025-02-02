package com.yourcaryourway.chat_support.dtos;

import java.util.List;

public record SupportRequestsResponse(
    List<SupportRequestDTO> support_requests
) {} 