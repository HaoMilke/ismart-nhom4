package com.example.namtronlogin.controller;

import com.example.namtronlogin.dto.promotion.PromotionValidateResponseDTO;
import com.example.namtronlogin.service.PromotionService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.Map;

@RestController
@RequestMapping("/api/promotions")
public class PromotionController {

    private final PromotionService promotionService;

    public PromotionController(PromotionService promotionService) {
        this.promotionService = promotionService;
    }

    // Yêu cầu đăng nhập (không cần ADMIN) vì chỉ user đã login mới thanh toán được
    @PreAuthorize("isAuthenticated()")
    @PostMapping("/check")
    public ResponseEntity<PromotionValidateResponseDTO> check(@RequestBody Map<String, Object> body) {
        String code = (String) body.get("code");
        BigDecimal orderTotal = new BigDecimal(body.get("orderTotal").toString());
        return ResponseEntity.ok(promotionService.checkPromotion(code, orderTotal));
    }
}