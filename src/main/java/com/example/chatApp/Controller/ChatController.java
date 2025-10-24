package com.example.chatApp.Controller;

import com.example.chatApp.model.Message;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

@Controller
public class ChatController {

    // This handles messages sent to /app/sendMessage from the client
    @MessageMapping("/sendMessage")
    @SendTo("/topic/messages")
    public Message sendMessage(Message message) {
        System.out.println("Received: " + message.getSender() + " -> " + message.getContent());
        return message; // broadcasts to all subscribers of /topic/messages
    }
}
