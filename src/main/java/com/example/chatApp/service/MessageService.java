package com.example.chatApp.service;

import com.example.chatApp.model.Message;
import com.example.chatApp.repository.MessageRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MessageService {

    private final MessageRepository repo;

    public MessageService(MessageRepository repo) {
        this.repo = repo;
    }

    public Message save(Message msg) {
        return repo.save(msg);
    }

    public List<Message> getChat(String u1, String u2) {
        return repo.getChatHistory(u1, u2);
    }
}
