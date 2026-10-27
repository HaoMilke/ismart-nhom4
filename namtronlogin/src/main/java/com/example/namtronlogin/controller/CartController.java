package com.example.namtronlogin.controller;

import com.example.namtronlogin.dto.cart.AddToCartRequestDTO;
import com.example.namtronlogin.dto.cart.CartResponseDTO;
import com.example.namtronlogin.dto.cart.UpdateCartItemRequestDTO;
import com.example.namtronlogin.service.CartService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cart")
public class CartController {

    private final CartService cartService;

    public CartController(CartService cartService) {
        this.cartService = cartService;
    }

    @GetMapping
    public ResponseEntity<CartResponseDTO> getCart(Authentication authentication) {
        return ResponseEntity.ok(cartService.getCart(authentication.getName()));
    }

    @PostMapping
    public ResponseEntity<CartResponseDTO> addToCart(Authentication authentication,
                                                     @RequestBody AddToCartRequestDTO request) {
        return ResponseEntity.ok(cartService.addToCart(authentication.getName(), request));
    }

    @PutMapping("/{cartItemId}")
    public ResponseEntity<CartResponseDTO> updateCartItem(Authentication authentication,
                                                          @PathVariable Long cartItemId,
                                                          @RequestBody UpdateCartItemRequestDTO request) {
        return ResponseEntity.ok(
                cartService.updateCartItem(authentication.getName(), cartItemId, request.getQuantity()));
    }

    @DeleteMapping("/{cartItemId}")
    public ResponseEntity<CartResponseDTO> removeCartItem(Authentication authentication,
                                                          @PathVariable Long cartItemId) {
        return ResponseEntity.ok(cartService.removeCartItem(authentication.getName(), cartItemId));
    }
}