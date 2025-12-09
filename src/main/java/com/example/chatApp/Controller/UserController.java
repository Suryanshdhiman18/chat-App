package com.example.chatApp.Controller;

import com.example.chatApp.model.User;
import com.example.chatApp.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/all")
    public List<String> getAllUsers() {
        return userRepository.findAll()
                .stream()
                .map(User::getUsername)
                .toList();
    }

    @DeleteMapping("/delete/{username}")
    @Transactional
    public ResponseEntity<?> deleteUser(@PathVariable String username) {

        if (!userRepository.existsByUsername(username)) {
            return ResponseEntity.status(404)
                    .body("User not found: " + username);
        }

        userRepository.deleteByUsername(username);

        return ResponseEntity.ok("User deleted successfully: " + username);
    }

}

