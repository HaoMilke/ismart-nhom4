package com.example.namtronlogin.controller;

import com.example.namtronlogin.dto.order.CreateOrderRequestDTO;
import com.example.namtronlogin.dto.order.OrderResponseDTO;
import com.example.namtronlogin.service.OrderService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @PostMapping
    public ResponseEntity<OrderResponseDTO> createOrder(Authentication authentication,
                                                        @RequestBody CreateOrderRequestDTO request) {
        return ResponseEntity.ok(orderService.createOrder(authentication.getName(), request));
    }

    @GetMapping
    public ResponseEntity<List<OrderResponseDTO>> getOrderHistory(Authentication authentication) {
        return ResponseEntity.ok(orderService.getOrderHistory(authentication.getName()));
    }
}