//package com.example.chatApp.model;
//
//import java.time.LocalDateTime;
//
//public class Message {
//
//    private String messageId;   // used for ticks (DELIVERED / SEEN)
//    private String sender;
//    private String content;
//    private LocalDateTime timestamp;
//
//    public Message() {}
//
//    public Message(String sender, String content) {
//        this.sender = sender;
//        this.content = content;
//    }
//
//    public Message(String sender, String content, LocalDateTime timestamp) {
//        this.sender = sender;
//        this.content = content;
//        this.timestamp = timestamp;
//    }
//
//    /* ---------------------- GETTERS & SETTERS ---------------------- */
//
//    public String getMessageId() {
//        return messageId;
//    }
//
//    public void setMessageId(String messageId) {
//        this.messageId = messageId;
//    }
//
//    public String getSender() {
//        return sender;
//    }
//
//    public void setSender(String sender) {
//        this.sender = sender;
//    }
//
//    public String getContent() {
//        return content;
//    }
//
//    public void setContent(String content) {
//        this.content = content;
//    }
//
//    public LocalDateTime getTimestamp() {
//        return timestamp;
//    }
//
//    public void setTimestamp(LocalDateTime timestamp) {
//        this.timestamp = timestamp;
//    }
//}

package com.example.chatApp.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "messages")
public class Message {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String messageId;
    private String sender;
    private String receiver;

    @Column(columnDefinition = "TEXT")
    private String content;

    private String status = "SENT";

    private LocalDateTime timestamp = LocalDateTime.now();

    public Message() {}

    public Message(String sender, String receiver, String content) {
        this.sender = sender;
        this.receiver = receiver;
        this.content = content;
    }

    // Getters & Setters
    public Long getId() { return id; }

    public String getMessageId() { return messageId; }
    public void setMessageId(String messageId) { this.messageId = messageId; }

    public String getSender() { return sender; }
    public void setSender(String sender) { this.sender = sender; }

    public String getReceiver() { return receiver; }
    public void setReceiver(String receiver) { this.receiver = receiver; }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }
}
