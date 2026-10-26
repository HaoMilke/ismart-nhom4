package com.example.namtronlogin.service;

import com.example.namtronlogin.dto.order.CreateOrderRequestDTO;
import com.example.namtronlogin.dto.order.OrderItemResponseDTO;
import com.example.namtronlogin.dto.order.OrderResponseDTO;
import com.example.namtronlogin.entity.*;
import com.example.namtronlogin.exception.BadRequestException;
import com.example.namtronlogin.exception.ResourceNotFoundException;
import com.example.namtronlogin.repository.OrderRepository;
import com.example.namtronlogin.repository.ProductRepository;
import com.example.namtronlogin.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final CartService cartService;
    private final PromotionService promotionService;

    public OrderService(OrderRepository orderRepository, ProductRepository productRepository,
                        UserRepository userRepository, CartService cartService, PromotionService promotionService) {
        this.orderRepository = orderRepository;
        this.productRepository = productRepository;
        this.userRepository = userRepository;
        this.cartService = cartService;
        this.promotionService = promotionService;
    }

    @Transactional
    public OrderResponseDTO createOrder(String username, CreateOrderRequestDTO request) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy user"));

        Cart cart = cartService.getCartEntityByUsername(username);

        if (cart.getItems().isEmpty()) {
            throw new BadRequestException("Giỏ hàng đang trống");
        }

        Order order = new Order();
        order.setUser(user);
        order.setStatus(Order.OrderStatus.PENDING);
        order.setShippingAddress(request.getShippingAddress());

        BigDecimal total = BigDecimal.ZERO;

        for (CartItem cartItem : cart.getItems()) {
            Product product = cartItem.getProduct();

            // Kiểm tra lại tồn kho ngay tại thời điểm đặt hàng (phòng trường hợp
            // tồn kho đã thay đổi kể từ lúc thêm vào giỏ)
            if (product.getQuantity() < cartItem.getQuantity()) {
                throw new BadRequestException(
                        "Sản phẩm '" + product.getName() + "' không đủ số lượng tồn kho");
            }

            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(order);
            orderItem.setProduct(product);
            orderItem.setQuantity(cartItem.getQuantity());
            orderItem.setPriceAtOrder(product.getPrice()); // snapshot giá tại thời điểm mua
            order.getItems().add(orderItem);

            total = total.add(product.getPrice().multiply(BigDecimal.valueOf(cartItem.getQuantity())));

            // Trừ tồn kho
            product.setQuantity(product.getQuantity() - cartItem.getQuantity());
            productRepository.save(product);
        }

        order.setTotalAmount(total);

        // ==== Áp dụng mã khuyến mại (nếu có) ====
        BigDecimal discountAmount = BigDecimal.ZERO;
        if (request.getPromotionCode() != null && !request.getPromotionCode().isBlank()) {
            discountAmount = promotionService.applyPromotion(request.getPromotionCode(), total);
            order.setPromotionCode(request.getPromotionCode().toUpperCase());
        }
        order.setDiscountAmount(discountAmount);
        order.setTotalAmount(total.subtract(discountAmount)); // tổng cuối cùng sau khi giảm

        Order savedOrder = orderRepository.save(order);

        // Xóa sạch giỏ hàng sau khi đặt hàng thành công
        cart.getItems().clear();

        return toResponseDTO(savedOrder);
    }

    public List<OrderResponseDTO> getOrderHistory(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy user"));

        return orderRepository.findByUserIdOrderByCreatedAtDesc(user.getId()).stream()
                .map(this::toResponseDTO)
                .toList();
    }

    private OrderResponseDTO toResponseDTO(Order order) {
        List<OrderItemResponseDTO> itemDTOs = order.getItems().stream().map(item -> {
            OrderItemResponseDTO dto = new OrderItemResponseDTO();
            dto.setProductId(item.getProduct().getId());
            dto.setProductName(item.getProduct().getName());
            dto.setQuantity(item.getQuantity());
            dto.setPriceAtOrder(item.getPriceAtOrder());
            return dto;
        }).toList();

        OrderResponseDTO dto = new OrderResponseDTO();
        dto.setId(order.getId());
        dto.setStatus(order.getStatus().name());
        dto.setTotalAmount(order.getTotalAmount());
        dto.setShippingAddress(order.getShippingAddress());
        dto.setCreatedAt(order.getCreatedAt());
        dto.setItems(itemDTOs);
        dto.setPromotionCode(order.getPromotionCode());     // <-- thêm dòng này
        dto.setDiscountAmount(order.getDiscountAmount());   // <-- thêm dòng này
        return dto;
    }
}