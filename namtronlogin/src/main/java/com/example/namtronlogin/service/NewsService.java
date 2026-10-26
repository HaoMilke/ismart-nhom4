package com.example.namtronlogin.service;

import com.example.namtronlogin.dto.news.NewsRequestDTO;
import com.example.namtronlogin.dto.news.NewsResponseDTO;
import com.example.namtronlogin.entity.News;
import com.example.namtronlogin.exception.ResourceNotFoundException;
import com.example.namtronlogin.repository.NewsRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class NewsService {

    private final NewsRepository newsRepository;

    public NewsService(NewsRepository newsRepository) {
        this.newsRepository = newsRepository;
    }

    // ==== Dùng cho phía người dùng (public) ====
    public List<NewsResponseDTO> getPublishedNews() {
        return newsRepository.findByPublishedTrueOrderByCreatedAtDesc().stream()
                .map(this::toResponseDTO)
                .toList();
    }

    public List<NewsResponseDTO> getPublishedNewsByCategory(String category) {
        return newsRepository.findByPublishedTrueAndCategoryIgnoreCaseOrderByCreatedAtDesc(category).stream()
                .map(this::toResponseDTO)
                .toList();
    }

    public List<NewsResponseDTO> searchNews(String keyword) {
        return newsRepository.findByTitleContainingIgnoreCaseAndPublishedTrue(keyword).stream()
                .map(this::toResponseDTO)
                .toList();
    }

    public NewsResponseDTO getNewsById(Long id) {
        return toResponseDTO(findNewsById(id));
    }

    // ==== Dùng cho Admin ====
    public List<NewsResponseDTO> getAllNewsForAdmin() {
        return newsRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(this::toResponseDTO)
                .toList();
    }

    public NewsResponseDTO createNews(NewsRequestDTO request) {
        News news = new News();
        mapRequestToEntity(request, news);
        news.setCreatedAt(LocalDateTime.now());
        news.setUpdatedAt(LocalDateTime.now());
        return toResponseDTO(newsRepository.save(news));
    }

    public NewsResponseDTO updateNews(Long id, NewsRequestDTO request) {
        News news = findNewsById(id);
        mapRequestToEntity(request, news);
        news.setUpdatedAt(LocalDateTime.now());
        return toResponseDTO(newsRepository.save(news));
    }

    public void deleteNews(Long id) {
        News news = findNewsById(id);
        newsRepository.delete(news);
    }

    private News findNewsById(Long id) {
        return newsRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy tin tức với id: " + id));
    }

    private void mapRequestToEntity(NewsRequestDTO request, News news) {
        news.setTitle(request.getTitle());
        news.setSummary(request.getSummary());
        news.setContent(request.getContent());
        news.setImageUrl(request.getImageUrl());
        news.setCategory(request.getCategory());
        news.setAuthor(request.getAuthor());
        news.setPublished(request.getPublished() != null ? request.getPublished() : true);
    }

    private NewsResponseDTO toResponseDTO(News news) {
        NewsResponseDTO dto = new NewsResponseDTO();
        dto.setId(news.getId());
        dto.setTitle(news.getTitle());
        dto.setSummary(news.getSummary());
        dto.setContent(news.getContent());
        dto.setImageUrl(news.getImageUrl());
        dto.setCategory(news.getCategory());
        dto.setAuthor(news.getAuthor());
        dto.setPublished(news.getPublished());
        dto.setCreatedAt(news.getCreatedAt());
        return dto;
    }
}