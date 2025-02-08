package com.yourcaryourway.chat_support.config;

import com.yourcaryourway.chat_support.services.JwtService;
import org.slf4j.Logger;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.config.ChannelRegistration;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.messaging.support.MessageHeaderAccessor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@Order(Ordered.HIGHEST_PRECEDENCE + 99)
@EnableWebSocketMessageBroker
public class WebSocketAuthConfig implements WebSocketMessageBrokerConfigurer {

    private static final Logger log = org.slf4j.LoggerFactory.getLogger(WebSocketAuthConfig.class);
    private final JwtService jwtService;

    public WebSocketAuthConfig(JwtService jwtService) {
        this.jwtService = jwtService;
    }

    @Override
    public void configureClientInboundChannel(ChannelRegistration registration) {
        registration.interceptors(new ChannelInterceptor() {
            @Override
            public Message<?> preSend(Message<?> message, MessageChannel channel) {
                StompHeaderAccessor accessor = MessageHeaderAccessor.getAccessor(message, StompHeaderAccessor.class);

                if (StompCommand.CONNECT.equals(accessor.getCommand())) {
                    String token = accessor.getFirstNativeHeader("Authorization");
                    if (token != null && token.startsWith("Bearer ")) {
                        token = token.substring(7);
                        try {
                            Authentication auth = jwtService.getAuthenticationFromToken(token);
                            accessor.setUser(auth);
                            SecurityContextHolder.getContext().setAuthentication(auth);
                            log.debug("WebSocket connection authenticated for user: {}", auth.getName());
                        } catch (Exception e) {
                            log.error("WebSocket authentication failed", e);
                            throw new IllegalArgumentException("Invalid JWT token", e);
                        }
                    }
                } else if (accessor.getCommand() != null) {
                    // Get existing authentication
                    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
                    if (authentication != null) {
                        accessor.setUser(authentication);
                    }
                }
                return message;
            }
        });
    }
}