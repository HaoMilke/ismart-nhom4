package com.example.namtronlogin.service;

import com.example.namtronlogin.dto.banner.BannerRequestDTO;
import com.example.namtronlogin.dto.banner.BannerResponseDTO;
import com.example.namtronlogin.entity.Banner;
import com.example.namtronlogin.exception.ResourceNotFoundException;
import com.example.namtronlogin.repository.BannerRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BannerService {

    private final BannerRepository bannerRepository;

    public BannerService(BannerRepository bannerRepository) {
        this.bannerRepository = bannerRepository;
    }

    // ==== Dùng cho trang chủ (public) ====
    public List<BannerResponseDTO> getActiveBanners() {
        return bannerRepository.findByActiveTrueOrderByDisplayOrderAsc().stream()
                .map(this::toResponseDTO)
                .toList();
    }

    // ==== Dùng cho Admin ====
    public List<BannerResponseDTO> getAllForAdmin() {
        return bannerRepository.findAllByOrderByDisplayOrderAsc().stream()
                .map(this::toResponseDTO)
                .toList();
    }

    public BannerResponseDTO create(BannerRequestDTO request) {
        Banner banner = new Banner();
        mapRequestToEntity(request, banner);
        return toResponseDTO(bannerRepository.save(banner));
    }

    public BannerResponseDTO update(Long id, BannerRequestDTO request) {
        Banner banner = findById(id);
        mapRequestToEntity(request, banner);
        return toResponseDTO(bannerRepository.save(banner));
    }

    public void delete(Long id) {
        bannerRepository.delete(findById(id));
    }

    private Banner findById(Long id) {
        return bannerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy banner với id: " + id));
    }

    private void mapRequestToEntity(BannerRequestDTO request, Banner banner) {
        banner.setTitle(request.getTitle());
        banner.setDescription(request.getDescription());
        banner.setButtonText(request.getButtonText());
        banner.setButtonLink(request.getButtonLink());
        banner.setImageUrl(request.getImageUrl());
        if (request.getGradientFrom() != null) banner.setGradientFrom(request.getGradientFrom());
        if (request.getGradientTo() != null) banner.setGradientTo(request.getGradientTo());
        banner.setDisplayOrder(request.getDisplayOrder() != null ? request.getDisplayOrder() : 0);
        banner.setActive(request.getActive() != null ? request.getActive() : true);
    }

    private BannerResponseDTO toResponseDTO(Banner banner) {
        BannerResponseDTO dto = new BannerResponseDTO();
        dto.setId(banner.getId());
        dto.setTitle(banner.getTitle());
        dto.setDescription(banner.getDescription());
        dto.setButtonText(banner.getButtonText());
        dto.setButtonLink(banner.getButtonLink());
        dto.setImageUrl(banner.getImageUrl());
        dto.setGradientFrom(banner.getGradientFrom());
        dto.setGradientTo(banner.getGradientTo());
        dto.setDisplayOrder(banner.getDisplayOrder());
        dto.setActive(banner.getActive());
        return dto;
    }
}