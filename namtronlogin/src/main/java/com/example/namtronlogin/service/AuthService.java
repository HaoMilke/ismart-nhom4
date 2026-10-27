package com.example.namtronlogin.service;

import com.example.namtronlogin.dto.auth.LoginRequestDTO;
import com.example.namtronlogin.dto.auth.LoginResponseDTO;
import com.example.namtronlogin.dto.auth.RegisterRequestDTO;
import com.example.namtronlogin.entity.User;
import com.example.namtronlogin.exception.BadRequestException;
import com.example.namtronlogin.repository.UserRepository;
import com.example.namtronlogin.security.JwtUtil;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final CartService cartService;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthService(UserRepository userRepository, CartService cartService,
                       PasswordEncoder passwordEncoder, JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.cartService = cartService;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    public void register(RegisterRequestDTO request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new BadRequestException("Username đã tồn tại");
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email đã được sử dụng");
        }

        User user = new User();
        user.setUsername(request.getUsername());
        user.setPassword(passwordEncoder.encode(request.getPassword())); // mã hóa trước khi lưu
        user.setEmail(request.getEmail());
        user.setFullName(request.getFullName());
        user.setPhone(request.getPhone());
        user.setAddress(request.getAddress());
        user.setRole(User.Role.USER);
        user.setStatus(User.AccountStatus.ACTIVE);

        User savedUser = userRepository.save(user);

        // Mỗi user mới đăng ký tự động có 1 giỏ hàng rỗng
        cartService.createCartForUser(savedUser);
    }

    public LoginResponseDTO login(LoginRequestDTO request) {
        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new BadRequestException("Sai username hoặc mật khẩu"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new BadRequestException("Sai username hoặc mật khẩu");
        }

        if (user.getStatus() == User.AccountStatus.BLOCKED) {
            throw new BadRequestException("Tài khoản đã bị khóa");
        }

        String token = jwtUtil.generateToken(user.getUsername(), user.getRole().name());

        return new LoginResponseDTO(token, user.getId(), user.getUsername(), user.getRole().name());
    }
}