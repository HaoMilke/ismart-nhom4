package com.example.namtronlogin.controller;

import com.example.namtronlogin.dto.admin.AdminCreateUserRequestDTO;
import com.example.namtronlogin.dto.admin.AdminUpdateUserRequestDTO;
import com.example.namtronlogin.dto.user.UserResponseDTO;
import com.example.namtronlogin.service.AdminUserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/users")
@PreAuthorize("hasRole('ADMIN')")
public class AdminUserController {

    private final AdminUserService adminUserService;

    public AdminUserController(AdminUserService adminUserService) {
        this.adminUserService = adminUserService;
    }

    @GetMapping
    public ResponseEntity<List<UserResponseDTO>> getAllUsers() {
        return ResponseEntity.ok(adminUserService.getAllUsers());
    }

    @PostMapping
    public ResponseEntity<UserResponseDTO> createUser(@RequestBody AdminCreateUserRequestDTO request) {
        return ResponseEntity.ok(adminUserService.createUser(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<UserResponseDTO> updateUser(@PathVariable Long id,
                                                      @RequestBody AdminUpdateUserRequestDTO request) {
        return ResponseEntity.ok(adminUserService.updateUser(id, request));
    }

    @PutMapping("/{id}/block")
    public ResponseEntity<UserResponseDTO> blockUser(@PathVariable Long id) {
        return ResponseEntity.ok(adminUserService.blockUser(id));
    }

    @PutMapping("/{id}/unblock")
    public ResponseEntity<UserResponseDTO> unblockUser(@PathVariable Long id) {
        return ResponseEntity.ok(adminUserService.unblockUser(id));
    }
}