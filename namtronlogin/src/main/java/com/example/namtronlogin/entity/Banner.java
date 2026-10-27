package com.example.namtronlogin.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "banners")
public class Banner {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 255)
    private String title;

    @Column(length = 500)
    private String description;

    @Column(name = "button_text", length = 100)
    private String buttonText;

    @Column(name = "button_link", length = 255)
    private String buttonLink;

    @Column(name = "image_url", length = 500)
    private String imageUrl; // nếu để trống, Frontend sẽ dùng màu gradient thay thế

    @Column(name = "gradient_from", length = 20)
    private String gradientFrom = "#2563eb";

    @Column(name = "gradient_to", length = 20)
    private String gradientTo = "#1e3a8a";

    @Column(name = "display_order", nullable = false)
    private Integer displayOrder = 0;

    @Column(nullable = false)
    private Boolean active = true;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getButtonText() { return buttonText; }
    public void setButtonText(String buttonText) { this.buttonText = buttonText; }
    public String getButtonLink() { return buttonLink; }
    public void setButtonLink(String buttonLink) { this.buttonLink = buttonLink; }
    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
    public String getGradientFrom() { return gradientFrom; }
    public void setGradientFrom(String gradientFrom) { this.gradientFrom = gradientFrom; }
    public String getGradientTo() { return gradientTo; }
    public void setGradientTo(String gradientTo) { this.gradientTo = gradientTo; }
    public Integer getDisplayOrder() { return displayOrder; }
    public void setDisplayOrder(Integer displayOrder) { this.displayOrder = displayOrder; }
    public Boolean getActive() { return active; }
    public void setActive(Boolean active) { this.active = active; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}