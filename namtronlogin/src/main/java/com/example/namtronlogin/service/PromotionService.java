package com.example.namtronlogin.service;

import com.example.namtronlogin.dto.promotion.PromotionRequestDTO;
import com.example.namtronlogin.dto.promotion.PromotionResponseDTO;
import com.example.namtronlogin.dto.promotion.PromotionValidateResponseDTO;
import com.example.namtronlogin.entity.Promotion;
import com.example.namtronlogin.exception.BadRequestException;
import com.example.namtronlogin.exception.ResourceNotFoundException;
import com.example.namtronlogin.repository.PromotionRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class PromotionService {

    private final PromotionRepository promotionRepository;

    public PromotionService(PromotionRepository promotionRepository) {
        this.promotionRepository = promotionRepository;
    }

    // ==== Nghiệp vụ chính: kiểm tra mã hợp lệ và tính số tiền được giảm ====
    // dùng chung cho cả bước "kiểm tra trước" ở checkout và bước "áp dụng thật" khi tạo đơn
    public Promotion validatePromotion(String code, BigDecimal orderTotal) {
        Promotion promo = promotionRepository.findByCodeIgnoreCase(code)
                .orElseThrow(() -> new BadRequestException("Mã khuyến mại không tồn tại"));

        if (!Boolean.TRUE.equals(promo.getActive())) {
            throw new BadRequestException("Mã khuyến mại đã bị vô hiệu hóa");
        }

        LocalDateTime now = LocalDateTime.now();
        if (promo.getStartDate() != null && now.isBefore(promo.getStartDate())) {
            throw new BadRequestException("Mã khuyến mại chưa tới thời gian áp dụng");
        }
        if (promo.getEndDate() != null && now.isAfter(promo.getEndDate())) {
            throw new BadRequestException("Mã khuyến mại đã hết hạn");
        }

        if (promo.getUsageLimit() != null && promo.getUsedCount() >= promo.getUsageLimit()) {
            throw new BadRequestException("Mã khuyến mại đã hết lượt sử dụng");
        }

        if (orderTotal.compareTo(promo.getMinOrderAmount()) < 0) {
            throw new BadRequestException(
                    "Đơn hàng cần tối thiểu " + promo.getMinOrderAmount() + "đ để áp dụng mã này");
        }

        return promo;
    }

    public BigDecimal calculateDiscount(Promotion promo, BigDecimal orderTotal) {
        BigDecimal discount;

        if (promo.getDiscountType() == Promotion.DiscountType.PERCENT) {
            discount = orderTotal
                    .multiply(promo.getDiscountValue())
                    .divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);

            if (promo.getMaxDiscountAmount() != null && discount.compareTo(promo.getMaxDiscountAmount()) > 0) {
                discount = promo.getMaxDiscountAmount();
            }
        } else {
            discount = promo.getDiscountValue();
        }

        // Số tiền giảm không được vượt quá tổng đơn hàng
        if (discount.compareTo(orderTotal) > 0) {
            discount = orderTotal;
        }

        return discount;
    }

    // Dùng ở FE trang checkout: kiểm tra mã, KHÔNG tính lượt dùng
    public PromotionValidateResponseDTO checkPromotion(String code, BigDecimal orderTotal) {
        Promotion promo = validatePromotion(code, orderTotal);
        BigDecimal discount = calculateDiscount(promo, orderTotal);

        PromotionValidateResponseDTO dto = new PromotionValidateResponseDTO();
        dto.setCode(promo.getCode());
        dto.setDiscountAmount(discount);
        dto.setFinalAmount(orderTotal.subtract(discount));
        dto.setMessage("Áp dụng mã thành công! Giảm " + discount + "đ");
        return dto;
    }

    // Dùng khi thật sự tạo đơn hàng: tính lượt dùng
    @Transactional
    public BigDecimal applyPromotion(String code, BigDecimal orderTotal) {
        Promotion promo = validatePromotion(code, orderTotal);
        BigDecimal discount = calculateDiscount(promo, orderTotal);

        promo.setUsedCount(promo.getUsedCount() + 1);
        promotionRepository.save(promo);

        return discount;
    }

    // ==== Admin CRUD ====
    public List<PromotionResponseDTO> getAllForAdmin() {
        return promotionRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(this::toResponseDTO)
                .toList();
    }

    public PromotionResponseDTO create(PromotionRequestDTO request) {
        if (promotionRepository.findByCodeIgnoreCase(request.getCode()).isPresent()) {
            throw new BadRequestException("Mã khuyến mại này đã tồn tại");
        }
        Promotion promo = new Promotion();
        mapRequestToEntity(request, promo);
        return toResponseDTO(promotionRepository.save(promo));
    }

    public PromotionResponseDTO update(Long id, PromotionRequestDTO request) {
        Promotion promo = findById(id);
        mapRequestToEntity(request, promo);
        return toResponseDTO(promotionRepository.save(promo));
    }

    public PromotionResponseDTO toggleActive(Long id) {
        Promotion promo = findById(id);
        promo.setActive(!Boolean.TRUE.equals(promo.getActive()));
        return toResponseDTO(promotionRepository.save(promo));
    }

    public void delete(Long id) {
        promotionRepository.delete(findById(id));
    }

    private Promotion findById(Long id) {
        return promotionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy mã khuyến mại với id: " + id));
    }

    private void mapRequestToEntity(PromotionRequestDTO r, Promotion promo) {
        promo.setCode(r.getCode().toUpperCase());
        promo.setDescription(r.getDescription());
        promo.setDiscountType(r.getDiscountType() != null ? r.getDiscountType() : Promotion.DiscountType.PERCENT);
        promo.setDiscountValue(r.getDiscountValue());
        promo.setMaxDiscountAmount(r.getMaxDiscountAmount());
        promo.setMinOrderAmount(r.getMinOrderAmount() != null ? r.getMinOrderAmount() : BigDecimal.ZERO);
        promo.setStartDate(r.getStartDate());
        promo.setEndDate(r.getEndDate());
        promo.setUsageLimit(r.getUsageLimit());
        promo.setActive(r.getActive() != null ? r.getActive() : true);
    }

    private PromotionResponseDTO toResponseDTO(Promotion p) {
        PromotionResponseDTO dto = new PromotionResponseDTO();
        dto.setId(p.getId());
        dto.setCode(p.getCode());
        dto.setDescription(p.getDescription());
        dto.setDiscountType(p.getDiscountType());
        dto.setDiscountValue(p.getDiscountValue());
        dto.setMaxDiscountAmount(p.getMaxDiscountAmount());
        dto.setMinOrderAmount(p.getMinOrderAmount());
        dto.setStartDate(p.getStartDate());
        dto.setEndDate(p.getEndDate());
        dto.setUsageLimit(p.getUsageLimit());
        dto.setUsedCount(p.getUsedCount());
        dto.setActive(p.getActive());
        return dto;
    }
}