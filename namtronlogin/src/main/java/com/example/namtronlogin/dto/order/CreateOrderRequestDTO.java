package com.example.namtronlogin.dto.order;

public class CreateOrderRequestDTO {
    private String shippingAddress;
    private String promotionCode; // có thể null/rỗng nếu không dùng mã

    public String getShippingAddress() { return shippingAddress; }
    public void setShippingAddress(String shippingAddress) { this.shippingAddress = shippingAddress; }
    public String getPromotionCode() { return promotionCode; }
    public void setPromotionCode(String promotionCode) { this.promotionCode = promotionCode; }
}