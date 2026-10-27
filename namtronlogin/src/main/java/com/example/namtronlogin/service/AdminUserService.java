package com.example.namtronlogin.service;

import com.example.namtronlogin.dto.admin.AdminCreateUserRequestDTO;
import com.example.namtronlogin.dto.admin.AdminUpdateUserRequestDTO;
import com.example.namtronlogin.dto.user.UserResponseDTO;
import com.example.namtronlogin.entity.User;
import com.example.namtronlogin.exception.BadRequestException;
import com.example.namtronlogin.exception.ResourceNotFoundException;
import com.example.namtronlogin.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AdminUserService {

    private final UserRepository userRepository;
    private final CartService cartService;
    private final PasswordEncoder passwordEncoder;

    public AdminUserService(UserRepository userRepository, CartService cartService,
                            PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.cartService = cartService;
        this.passwordEncoder = passwordEncoder;
    }

    public List<UserResponseDTO> getAllUsers() {
        return userRepository.findAll().stream()
                .map(this::toResponseDTO)
                .toList();
    }

    public UserResponseDTO createUser(AdminCreateUserRequestDTO request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new BadRequestException("Username đã tồn tại");
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email đã được sử dụng");
        }

        User user = new User();
        user.setUsername(request.getUsername());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setEmail(request.getEmail());
        user.setFullName(request.getFullName());
        user.setRole(parseRole(request.getRole()));
        user.setStatus(User.AccountStatus.ACTIVE);

        User saved = userRepository.save(user);
        cartService.createCartForUser(saved); // admin tạo user cũng cần có cart, giữ nhất quán với luồng register

        return toResponseDTO(saved);
    }

    public UserResponseDTO updateUser(Long id, AdminUpdateUserRequestDTO request) {
        User user = findById(id);
        user.setEmail(request.getEmail());
        user.setFullName(request.getFullName());
        user.setPhone(request.getPhone());
        user.setAddress(request.getAddress());
        if (request.getRole() != null) {
            user.setRole(parseRole(request.getRole()));
        }
        userRepository.save(user);
        return toResponseDTO(user);
    }

    public UserResponseDTO blockUser(Long id) {
        User user = findById(id);
        user.setStatus(User.AccountStatus.BLOCKED);
        userRepository.save(user);
        return toResponseDTO(user);
    }

    public UserResponseDTO unblockUser(Long id) {
        User user = findById(id);
        user.setStatus(User.AccountStatus.ACTIVE);
        userRepository.save(user);
        return toResponseDTO(user);
    }

    private User findById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy user với id: " + id));
    }

    private User.Role parseRole(String role) {
        try {
            return User.Role.valueOf(role.toUpperCase());
        } catch (Exception e) {
            throw new BadRequestException("Role không hợp lệ: " + role);
        }
    }

    private UserResponseDTO toResponseDTO(User user) {
        UserResponseDTO dto = new UserResponseDTO();
        dto.setId(user.getId());
        dto.setUsername(user.getUsername());
        dto.setEmail(user.getEmail());
        dto.setFullName(user.getFullName());
        dto.setPhone(user.getPhone());
        dto.setAddress(user.getAddress());
        dto.setRole(user.getRole().name());
        dto.setStatus(user.getStatus().name());
        return dto;
    }
}