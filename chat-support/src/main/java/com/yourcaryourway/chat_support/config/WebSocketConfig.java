package com.yourcaryourway.chat_support.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {
    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry) {
        // Enable a simple in-memory message broker to carry messages back to the client
        // /topic is used for messages that should be broadcast to multiple clients
        // /queue is used for messages that should go to a specific client
        registry.enableSimpleBroker("/topic", "/queue");

        // Messages handled by our message-handling methods are prefixed with /app
        registry.setApplicationDestinationPrefixes("/app");
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        // Register the /chat-websocket endpoint, enabling SockJS fallback options
        registry.addEndpoint("/chat-websocket")
                .setAllowedOriginPatterns("*")  // Configure as needed for your environment
                .withSockJS();
    }
}
