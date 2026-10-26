package com.example.namtronlogin.service;

import com.example.namtronlogin.dto.cart.AddToCartRequestDTO;
import com.example.namtronlogin.dto.cart.CartItemResponseDTO;
import com.example.namtronlogin.dto.cart.CartResponseDTO;
import com.example.namtronlogin.entity.*;
import com.example.namtronlogin.exception.BadRequestException;
import com.example.namtronlogin.exception.ResourceNotFoundException;
import com.example.namtronlogin.repository.CartItemRepository;
import com.example.namtronlogin.repository.CartRepository;
import com.example.namtronlogin.repository.ProductRepository;
import com.example.namtronlogin.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
public class CartService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    public CartService(CartRepository cartRepository, CartItemRepository cartItemRepository,
                       ProductRepository productRepository, UserRepository userRepository) {
        this.cartRepository = cartRepository;
        this.cartItemRepository = cartItemRepository;
        this.productRepository = productRepository;
        this.userRepository = userRepository;
    }

    public void createCartForUser(User user) {
        Cart cart = new Cart();
        cart.setUser(user);
        cartRepository.save(cart);
    }

    public CartResponseDTO getCart(String username) {
        Cart cart = getCartEntityByUsername(username);
        return toResponseDTO(cart);
    }

    public CartResponseDTO addToCart(String username, AddToCartRequestDTO request) {
        Cart cart = getCartEntityByUsername(username);
        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy sản phẩm"));

        if (request.getQuantity() <= 0) {
            throw new BadRequestException("Số lượng phải lớn hơn 0");
        }
        if (product.getQuantity() < request.getQuantity()) {
            throw new BadRequestException("Sản phẩm không đủ số lượng tồn kho");
        }

        // Kiểm tra sản phẩm đã có trong giỏ chưa
        CartItem existingItem = cartItemRepository
                .findByCartIdAndProductId(cart.getId(), product.getId())
                .orElse(null);

        if (existingItem != null) {
            existingItem.setQuantity(existingItem.getQuantity() + request.getQuantity());
            cartItemRepository.save(existingItem);
        } else {
            CartItem newItem = new CartItem();
            newItem.setCart(cart);
            newItem.setProduct(product);
            newItem.setQuantity(request.getQuantity());
            cartItemRepository.save(newItem);
        }

        return toResponseDTO(getCartEntityByUsername(username));
    }

    public CartResponseDTO updateCartItem(String username, Long cartItemId, Integer quantity) {
        Cart cart = getCartEntityByUsername(username);
        CartItem item = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy sản phẩm trong giỏ"));

        // Kiểm tra item này có thuộc đúng cart của user đang đăng nhập không
        // (tránh trường hợp user A sửa được giỏ hàng của user B)
        if (!item.getCart().getId().equals(cart.getId())) {
            throw new BadRequestException("Sản phẩm không thuộc giỏ hàng của bạn");
        }

        if (quantity <= 0) {
            throw new BadRequestException("Số lượng phải lớn hơn 0");
        }

        item.setQuantity(quantity);
        cartItemRepository.save(item);

        return toResponseDTO(getCartEntityByUsername(username));
    }

    public CartResponseDTO removeCartItem(String username, Long cartItemId) {
        Cart cart = getCartEntityByUsername(username);
        CartItem item = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy sản phẩm trong giỏ"));

        if (!item.getCart().getId().equals(cart.getId())) {
            throw new BadRequestException("Sản phẩm không thuộc giỏ hàng của bạn");
        }

        cartItemRepository.delete(item);

        return toResponseDTO(getCartEntityByUsername(username));
    }

    // Dùng nội bộ bởi OrderService khi checkout
    Cart getCartEntityByUsername(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy user"));
        return cartRepository.findByUserId(user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy giỏ hàng"));
    }

    private CartResponseDTO toResponseDTO(Cart cart) {
        List<CartItemResponseDTO> itemDTOs = cart.getItems().stream().map(item -> {
            CartItemResponseDTO dto = new CartItemResponseDTO();
            dto.setCartItemId(item.getId());
            dto.setProductId(item.getProduct().getId());
            dto.setProductName(item.getProduct().getName());
            dto.setImageUrl(item.getProduct().getImageUrl());
            dto.setPrice(item.getProduct().getPrice());
            dto.setQuantity(item.getQuantity());
            dto.setSubtotal(item.getProduct().getPrice().multiply(BigDecimal.valueOf(item.getQuantity())));
            return dto;
        }).toList();

        BigDecimal total = itemDTOs.stream()
                .map(CartItemResponseDTO::getSubtotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        CartResponseDTO dto = new CartResponseDTO();
        dto.setCartId(cart.getId());
        dto.setItems(itemDTOs);
        dto.setTotalAmount(total);
        return dto;
    }
}