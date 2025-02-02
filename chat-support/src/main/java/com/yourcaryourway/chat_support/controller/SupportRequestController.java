package com.yourcaryourway.chat_support.controller;

import com.yourcaryourway.chat_support.models.SupportRequestCreationRequest;
import com.yourcaryourway.chat_support.dtos.SupportRequestsResponse;
import com.yourcaryourway.chat_support.services.SupportRequestService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@Slf4j
@RestController
@RequestMapping("/api/support_requests")
public class SupportRequestController {
    private final SupportRequestService supportRequestService;

    public SupportRequestController(SupportRequestService supportRequestService) {
        this.supportRequestService = supportRequestService;
    }

    @Operation(summary = "Create a new support request with chat session")
    @ApiResponse(responseCode = "201", description = "Support request created successfully")
    @PostMapping
    public ResponseEntity<UUID> createSupportRequest(
            @Valid @RequestBody SupportRequestCreationRequest request) {
        UUID chatSessionId = supportRequestService.createSupportRequest(request.userId());
        return ResponseEntity.ok(chatSessionId);
    }

    @Operation(summary = "Get all support requests for a user")
    @ApiResponse(responseCode = "200", description = "Support requests retrieved successfully")
    @GetMapping("/user/{userId}")
    public ResponseEntity<SupportRequestsResponse> getUserSupportRequests(
            @PathVariable UUID userId) {
        SupportRequestsResponse response = supportRequestService.getUserSupportRequests(userId);
        return ResponseEntity.ok(response);
    }
}