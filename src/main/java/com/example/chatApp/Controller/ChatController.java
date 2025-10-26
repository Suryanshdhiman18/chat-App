package com.example.chatApp.Controller;

import com.example.chatApp.model.Message;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

import java.time.LocalDateTime;

@Controller
public class ChatController {

    private final SimpMessagingTemplate simpMessagingTemplate;

    public ChatController(SimpMessagingTemplate simpMessagingTemplate) {
        this.simpMessagingTemplate = simpMessagingTemplate;
    }

    @GetMapping("/")
    public String home() {
        return "redirect:/login.html";
    }

    @MessageMapping("/chat.broadcast")
    @SendTo("/topic/public")
    public Message sendPublicMessage(@Payload Message message) {
        message.setTimestamp(LocalDateTime.now());
        return message;
    }

    @MessageMapping("/chat.private.{receiver}")
    public void sendPrivateMessage(@DestinationVariable String receiver, Message message) {
        message.setTimestamp(LocalDateTime.now());
        System.out.println("Private message from " + message.getSender() + " to " + receiver + ": " + message.getContent());
        simpMessagingTemplate.convertAndSendToUser(receiver, "/queue/private", message);
    }

}

