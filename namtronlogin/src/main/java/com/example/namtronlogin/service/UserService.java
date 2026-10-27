package com.example.namtronlogin.service;

import com.example.namtronlogin.dto.user.ChangePasswordRequestDTO;
import com.example.namtronlogin.dto.user.UpdateProfileRequestDTO;
import com.example.namtronlogin.dto.user.UserResponseDTO;
import com.example.namtronlogin.entity.User;
import com.example.namtronlogin.exception.BadRequestException;
import com.example.namtronlogin.exception.ResourceNotFoundException;
import com.example.namtronlogin.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public UserResponseDTO getProfile(String username) {
        User user = findUserByUsername(username);
        return toResponseDTO(user);
    }

    public UserResponseDTO updateProfile(String username, UpdateProfileRequestDTO request) {
        User user = findUserByUsername(username);
        user.setFullName(request.getFullName());
        user.setPhone(request.getPhone());
        user.setAddress(request.getAddress());
        userRepository.save(user);
        return toResponseDTO(user);
    }

    public void changePassword(String username, ChangePasswordRequestDTO request) {
        User user = findUserByUsername(username);

        if (!passwordEncoder.matches(request.getOldPassword(), user.getPassword())) {
            throw new BadRequestException("Mật khẩu cũ không đúng");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }

    public void deleteAccount(String username) {
        User user = findUserByUsername(username);
        userRepository.delete(user);
        // Nhờ cascade ở Cart/Order (nếu cấu hình), hoặc xử lý riêng nếu cần giữ lại lịch sử đơn hàng
    }

    private User findUserByUsername(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy user"));
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