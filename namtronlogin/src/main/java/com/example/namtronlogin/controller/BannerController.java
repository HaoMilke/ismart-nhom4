package com.example.namtronlogin.controller;

import com.example.namtronlogin.dto.banner.BannerResponseDTO;
import com.example.namtronlogin.service.BannerService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/banners")
public class BannerController {

    private final BannerService bannerService;

    public BannerController(BannerService bannerService) {
        this.bannerService = bannerService;
    }

    @GetMapping
    public ResponseEntity<List<BannerResponseDTO>> getActive() {
        return ResponseEntity.ok(bannerService.getActiveBanners());
    }
}