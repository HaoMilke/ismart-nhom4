package com.example.namtronlogin.dto.promotion;

import java.math.BigDecimal;

public class PromotionValidateResponseDTO {
    private String code;
    private BigDecimal discountAmount;
    private BigDecimal finalAmount;
    private String message;

    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }
    public BigDecimal getDiscountAmount() { return discountAmount; }
    public void setDiscountAmount(BigDecimal discountAmount) { this.discountAmount = discountAmount; }
    public BigDecimal getFinalAmount() { return finalAmount; }
    public void setFinalAmount(BigDecimal finalAmount) { this.finalAmount = finalAmount; }
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
}