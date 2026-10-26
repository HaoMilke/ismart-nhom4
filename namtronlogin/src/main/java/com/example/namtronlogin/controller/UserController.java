package com.example.namtronlogin.controller;

import com.example.namtronlogin.dto.user.ChangePasswordRequestDTO;
import com.example.namtronlogin.dto.user.UpdateProfileRequestDTO;
import com.example.namtronlogin.dto.user.UserResponseDTO;
import com.example.namtronlogin.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users/me")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    public ResponseEntity<UserResponseDTO> getProfile(Authentication authentication) {
        return ResponseEntity.ok(userService.getProfile(authentication.getName()));
    }

    @PutMapping
    public ResponseEntity<UserResponseDTO> updateProfile(Authentication authentication,
                                                         @RequestBody UpdateProfileRequestDTO request) {
        return ResponseEntity.ok(userService.updateProfile(authentication.getName(), request));
    }

    @PutMapping("/password")
    public ResponseEntity<String> changePassword(Authentication authentication,
                                                 @RequestBody ChangePasswordRequestDTO request) {
        userService.changePassword(authentication.getName(), request);
        return ResponseEntity.ok("Đổi mật khẩu thành công");
    }

    @DeleteMapping
    public ResponseEntity<String> deleteAccount(Authentication authentication) {
        userService.deleteAccount(authentication.getName());
        return ResponseEntity.ok("Xóa tài khoản thành công");
    }
}