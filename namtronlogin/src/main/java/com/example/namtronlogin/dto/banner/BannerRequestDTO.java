package com.example.namtronlogin.dto.banner;

public class BannerRequestDTO {
    private String title;
    private String description;
    private String buttonText;
    private String buttonLink;
    private String imageUrl;
    private String gradientFrom;
    private String gradientTo;
    private Integer displayOrder;
    private Boolean active;

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
}