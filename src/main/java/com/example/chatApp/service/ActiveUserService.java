package com.example.chatApp.service;

import org.springframework.stereotype.Service;

import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class ActiveUserService {

    private final Set<String> activeUsers = ConcurrentHashMap.newKeySet();

    public void addUser(String username) {
        activeUsers.add(username);
    }

    public void removeUser(String username) {
        activeUsers.remove(username);
    }

    public Set<String> getActiveUsers() {
        return activeUsers;
    }
}
