package com.example.namtronlogin.controller;

import com.example.namtronlogin.dto.banner.BannerRequestDTO;
import com.example.namtronlogin.dto.banner.BannerResponseDTO;
import com.example.namtronlogin.service.BannerService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/banners")
@PreAuthorize("hasRole('ADMIN')")
public class AdminBannerController {

    private final BannerService bannerService;

    public AdminBannerController(BannerService bannerService) {
        this.bannerService = bannerService;
    }

    @GetMapping
    public ResponseEntity<List<BannerResponseDTO>> getAll() {
        return ResponseEntity.ok(bannerService.getAllForAdmin());
    }

    @PostMapping
    public ResponseEntity<BannerResponseDTO> create(@RequestBody BannerRequestDTO request) {
        return ResponseEntity.ok(bannerService.create(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<BannerResponseDTO> update(@PathVariable Long id, @RequestBody BannerRequestDTO request) {
        return ResponseEntity.ok(bannerService.update(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> delete(@PathVariable Long id) {
        bannerService.delete(id);
        return ResponseEntity.ok("Xóa banner thành công");
    }
}