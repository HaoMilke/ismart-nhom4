package com.example.namtronlogin.controller;

import com.example.namtronlogin.dto.promotion.PromotionRequestDTO;
import com.example.namtronlogin.dto.promotion.PromotionResponseDTO;
import com.example.namtronlogin.service.PromotionService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/promotions")
@PreAuthorize("hasRole('ADMIN')")
public class AdminPromotionController {

    private final PromotionService promotionService;

    public AdminPromotionController(PromotionService promotionService) {
        this.promotionService = promotionService;
    }

    @GetMapping
    public ResponseEntity<List<PromotionResponseDTO>> getAll() {
        return ResponseEntity.ok(promotionService.getAllForAdmin());
    }

    @PostMapping
    public ResponseEntity<PromotionResponseDTO> create(@RequestBody PromotionRequestDTO request) {
        return ResponseEntity.ok(promotionService.create(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<PromotionResponseDTO> update(@PathVariable Long id, @RequestBody PromotionRequestDTO request) {
        return ResponseEntity.ok(promotionService.update(id, request));
    }

    @PatchMapping("/{id}/toggle")
    public ResponseEntity<PromotionResponseDTO> toggle(@PathVariable Long id) {
        return ResponseEntity.ok(promotionService.toggleActive(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> delete(@PathVariable Long id) {
        promotionService.delete(id);
        return ResponseEntity.ok("Xóa mã khuyến mại thành công");
    }
}