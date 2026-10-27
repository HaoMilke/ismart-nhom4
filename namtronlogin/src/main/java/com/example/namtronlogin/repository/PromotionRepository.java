package com.example.namtronlogin.repository;

import com.example.namtronlogin.entity.Promotion;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PromotionRepository extends JpaRepository<Promotion, Long> {
    Optional<Promotion> findByCodeIgnoreCase(String code);
    List<Promotion> findAllByOrderByCreatedAtDesc();
}