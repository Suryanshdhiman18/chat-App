//package com.example.chatApp.Controller;
//
//import com.example.chatApp.model.Message;
//import com.example.chatApp.dto.MessageStatusDTO;
//import com.example.chatApp.dto.MessageTypingDTO;
//import org.springframework.messaging.handler.annotation.DestinationVariable;
//import org.springframework.messaging.handler.annotation.MessageMapping;
//import org.springframework.messaging.handler.annotation.Payload;
//import org.springframework.messaging.handler.annotation.SendTo;
//import org.springframework.messaging.simp.SimpMessagingTemplate;
//import org.springframework.stereotype.Controller;
//import org.springframework.web.bind.annotation.GetMapping;
//
//@Controller
//public class ChatController {
//
//    private final SimpMessagingTemplate simpMessagingTemplate;
//
//    public ChatController(SimpMessagingTemplate simpMessagingTemplate) {
//        this.simpMessagingTemplate = simpMessagingTemplate;
//    }
//
//    @GetMapping("/")
//    public String home() {
//        return "redirect:/login.html";
//    }
//
//    // BROADCAST
//    @MessageMapping("/chat.broadcast")
//    @SendTo("/topic/public")
//    public Message sendPublicMessage(@Payload Message message) {
//        System.out.println("MessageID = " + message.getMessageId());
//        return message;
//    }
//
//    // PRIVATE CHAT
//    @MessageMapping("/chat.private.{receiver}")
//    public void sendPrivateMessage(@DestinationVariable String receiver, Message message) {
//        System.out.println("Private messageId = " + message.getMessageId());
//        simpMessagingTemplate.convertAndSendToUser(receiver, "/queue/private", message);
//    }
//
//    // TYPING INDICATOR
//    @MessageMapping("/typing")
//    public void typing(MessageTypingDTO typingDTO) {
//        if (typingDTO.getType().equals("broadcast")) {
//            simpMessagingTemplate.convertAndSend("/topic/typing", typingDTO);
//        } else {
//            simpMessagingTemplate.convertAndSendToUser(
//                    typingDTO.getReceiver(),
//                    "/queue/typing",
//                    typingDTO
//            );
//        }
//    }
//
//    // MESSAGE STATUS (DELIVERED / SEEN)
//    @MessageMapping("/chat.status.{receiver}")
//    public void updateStatus(@DestinationVariable String receiver, MessageStatusDTO statusDTO) {
//
//        // Forward status update back to original sender
//        simpMessagingTemplate.convertAndSendToUser(
//                statusDTO.getSender(),
//                "/queue/status",
//                statusDTO
//        );
//    }
//}

package com.example.chatApp.Controller;

import com.example.chatApp.model.Message;
import com.example.chatApp.dto.MessageStatusDTO;
import com.example.chatApp.dto.MessageTypingDTO;
import com.example.chatApp.service.MessageService;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Controller
public class ChatController {

    private final SimpMessagingTemplate messagingTemplate;
    private final MessageService messageService;

    public ChatController(SimpMessagingTemplate messagingTemplate,
                          MessageService messageService) {
        this.messagingTemplate = messagingTemplate;
        this.messageService = messageService;
    }

    @GetMapping("/")
    public String home() {
        return "redirect:/login.html";
    }

    /* ---------------- PUBLIC CHAT ---------------- */
    @MessageMapping("/chat.broadcast")
    public void broadcast(@Payload Message msg) {
        messageService.save(msg);
        messagingTemplate.convertAndSend("/topic/public", msg);
    }

    /* ---------------- PRIVATE CHAT ---------------- */
    @MessageMapping("/chat.private.{receiver}")
    public void privateChat(@DestinationVariable String receiver,
                            @Payload Message msg) {

        messageService.save(msg);

        messagingTemplate.convertAndSendToUser(
                receiver,
                "/queue/private",
                msg
        );
    }

    /* ---------------- HISTORY API ---------------- */
    @GetMapping("/history/{u1}/{u2}")
    @ResponseBody
    public List<Message> history(@PathVariable String u1,
                                 @PathVariable String u2) {
        return messageService.getChat(u1, u2);
    }

    /* ---------------- TYPING ---------------- */
    @MessageMapping("/typing")
    public void typing(MessageTypingDTO typingDTO) {
        if (typingDTO.getType().equals("broadcast")) {
            messagingTemplate.convertAndSend("/topic/typing", typingDTO);
        } else {
            messagingTemplate.convertAndSendToUser(
                    typingDTO.getReceiver(),
                    "/queue/typing",
                    typingDTO
            );
        }
    }

    /* ---------------- STATUS (DELIVERED/SEEN) ---------------- */
    @MessageMapping("/chat.status.{receiver}")
    public void status(@Payload MessageStatusDTO statusDTO) {
        messagingTemplate.convertAndSendToUser(
                statusDTO.getSender(), "/queue/status", statusDTO
        );
    }
}

