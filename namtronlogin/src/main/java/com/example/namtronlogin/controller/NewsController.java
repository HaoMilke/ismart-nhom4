package com.example.namtronlogin.controller;

import com.example.namtronlogin.dto.news.NewsResponseDTO;
import com.example.namtronlogin.service.NewsService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/news")
public class NewsController {

    private final NewsService newsService;

    public NewsController(NewsService newsService) {
        this.newsService = newsService;
    }

    @GetMapping
    public ResponseEntity<List<NewsResponseDTO>> getAllNews() {
        return ResponseEntity.ok(newsService.getPublishedNews());
    }

    @GetMapping("/{id}")
    public ResponseEntity<NewsResponseDTO> getNewsById(@PathVariable Long id) {
        return ResponseEntity.ok(newsService.getNewsById(id));
    }

    @GetMapping("/category/{category}")
    public ResponseEntity<List<NewsResponseDTO>> getByCategory(@PathVariable String category) {
        return ResponseEntity.ok(newsService.getPublishedNewsByCategory(category));
    }

    @GetMapping("/search")
    public ResponseEntity<List<NewsResponseDTO>> search(@RequestParam String keyword) {
        return ResponseEntity.ok(newsService.searchNews(keyword));
    }
}