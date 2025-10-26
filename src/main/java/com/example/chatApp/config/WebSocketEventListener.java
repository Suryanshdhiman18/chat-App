package com.example.chatApp.config;

import com.example.chatApp.service.ActiveUserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionConnectEvent;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

import java.security.Principal;

@Component
public class WebSocketEventListener {

    private static final Logger logger = LoggerFactory.getLogger(WebSocketEventListener.class);

    private final ActiveUserService activeUserService;
    private final SimpMessagingTemplate messagingTemplate;

    // ✅ Manual constructor-based injection (no Lombok needed)
    public WebSocketEventListener(ActiveUserService activeUserService, SimpMessagingTemplate messagingTemplate) {
        this.activeUserService = activeUserService;
        this.messagingTemplate = messagingTemplate;
    }

    @EventListener
    public void handleWebSocketConnectListener(SessionConnectEvent event) {
        Principal user = event.getUser();
        if (user != null) {
            String username = user.getName();
            activeUserService.addUser(username);
            logger.info("✅ User connected: {}", username);
            broadcastOnlineUsers();
        }
    }

    @EventListener
    public void handleWebSocketDisconnectListener(SessionDisconnectEvent event) {
        Principal user = event.getUser();
        if (user != null) {
            String username = user.getName();
            activeUserService.removeUser(username);
            logger.info("❌ User disconnected: {}", username);
            broadcastOnlineUsers();
        }
    }

    private void broadcastOnlineUsers() {
        messagingTemplate.convertAndSend("/topic/onlineUsers", activeUserService.getActiveUsers());
    }
}
