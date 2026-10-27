package com.example.namtronlogin.dto.cart;

import java.math.BigDecimal;
import java.util.List;

public class CartResponseDTO {
    private Long cartId;
    private List<CartItemResponseDTO> items;
    private BigDecimal totalAmount;

    public Long getCartId() { return cartId; }
    public void setCartId(Long cartId) { this.cartId = cartId; }
    public List<CartItemResponseDTO> getItems() { return items; }
    public void setItems(List<CartItemResponseDTO> items) { this.items = items; }
    public BigDecimal getTotalAmount() { return totalAmount; }
    public void setTotalAmount(BigDecimal totalAmount) { this.totalAmount = totalAmount; }
}