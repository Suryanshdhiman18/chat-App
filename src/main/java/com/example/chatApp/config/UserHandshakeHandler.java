package com.example.chatApp.config;

import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.server.support.DefaultHandshakeHandler;

import java.security.Principal;
import java.util.Map;

public class UserHandshakeHandler extends DefaultHandshakeHandler {

    @Override
    protected Principal determineUser(ServerHttpRequest request, WebSocketHandler wsHandler, Map<String, Object> attributes) {
        String uri = request.getURI().toString();
        String username = null;

        if (uri.contains("user=")) {
            username = uri.substring(uri.indexOf("user=") + 5);
        }

        // fallback only if no username found
        if (username == null || username.isEmpty()) {
            username = "anonymous-" + System.currentTimeMillis();
        }

        String finalUsername = username;
        return () -> finalUsername;
    }
}
