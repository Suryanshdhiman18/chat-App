package com.example.chatApp.Controller;
import com.example.chatApp.model.Message;
import com.example.chatApp.repository.MessageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/messages")
public class MessageController {

    @Autowired
    private MessageRepository messageRepository;

    @GetMapping("/history/{user1}/{user2}")
    public List<Message> getHistory(@PathVariable String user1,
                                    @PathVariable String user2) {

        return messageRepository.getChatHistory(user1, user2);
    }
}
