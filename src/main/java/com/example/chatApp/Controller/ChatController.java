package com.example.chatApp.Controller;

import com.example.chatApp.model.Message;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.time.LocalDateTime;

@Controller
public class ChatController {

    private final SimpMessagingTemplate simpMessagingTemplate;

    public ChatController(SimpMessagingTemplate simpMessagingTemplate) {
        this.simpMessagingTemplate = simpMessagingTemplate;
    }

    // ✅ Broadcast message to everyone
//    @MessageMapping("/chat.broadcast")
//    @SendTo("/topic/public")
//    public Message broadcastMessage(@Payload Message message) {
//        return message;
//    }
    @MessageMapping("/chat.broadcast")
    @SendTo("/topic/public")
    public Message sendPublicMessage(@Payload Message message) {
        message.setTimestamp(LocalDateTime.now());
        return message;
    }


    // ✅ Send private message to a specific user
//    @MessageMapping("/chat.private.{receiver}")
//    public void sendPrivateMessage(@DestinationVariable String receiver, @Payload Message message) {
//        simpMessagingTemplate.convertAndSendToUser(receiver, "/queue/private", message);
//    }
    @MessageMapping("/chat.private.{receiver}")
    public void sendPrivateMessage(@DestinationVariable String receiver, Message message) {
        message.setTimestamp(LocalDateTime.now());
        simpMessagingTemplate.convertAndSendToUser(receiver, "/queue/private", message);
    }

}

