package com.example.chatApp.dto;

public class MessageStatusDTO {

    private String messageId;
    private String sender;
    private String receiver;
    private String status; // "SENT", "DELIVERED", "SEEN"

    public MessageStatusDTO() {
    }

    public MessageStatusDTO(String messageId, String sender, String receiver, String status) {
        this.messageId = messageId;
        this.sender = sender;
        this.receiver = receiver;
        this.status = status;
    }

    public String getMessageId() {
        return messageId;
    }

    public void setMessageId(String messageId) {
        this.messageId = messageId;
    }

    public String getSender() {
        return sender;
    }

    public void setSender(String sender) {
        this.sender = sender;
    }

    public String getReceiver() {
        return receiver;
    }

    public void setReceiver(String receiver) {
        this.receiver = receiver;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    @Override
    public String toString() {
        return "MessageStatusDTO{" +
                "messageId='" + messageId + '\'' +
                ", sender='" + sender + '\'' +
                ", receiver='" + receiver + '\'' +
                ", status='" + status + '\'' +
                '}';
    }
}
