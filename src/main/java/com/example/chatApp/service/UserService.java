//package com.example.chatApp.service;
//
//import com.example.chatApp.dto.UserResponse;
//import com.example.chatApp.model.User;
//import com.example.chatApp.repository.UserRepository;
//import jakarta.transaction.Transactional;
//import org.springframework.http.ResponseEntity;
//import org.springframework.stereotype.Service;
//
//import java.util.List;
//
//@Service
//public class UserService {
//
//    private final UserRepository userRepository;
//
//    public UserService(UserRepository userRepository) {
//        this.userRepository = userRepository;
//    }
//
//    public List<UserResponse> getAllUsers() {
//        return userRepository.findAll()
//                .stream()
//                .map(user -> new UserResponse(user.getUsername()))
//                .toList();
//    }
//
//    @Transactional
//    public ResponseEntity<?> deleteUser(String username) {
//
//        if (!userRepository.existsByUsername(username)) {
//            return ResponseEntity.status(404)
//                    .body("User not found: " + username);
//        }
//
//        userRepository.deleteByUsername(username);
//
//        return ResponseEntity.ok("User deleted: " + username);
//    }
//}
