package com.example.namtronlogin.controller;

import com.example.namtronlogin.dto.news.NewsRequestDTO;
import com.example.namtronlogin.dto.news.NewsResponseDTO;
import com.example.namtronlogin.service.NewsService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/news")
@PreAuthorize("hasRole('ADMIN')")
public class AdminNewsController {

    private final NewsService newsService;

    public AdminNewsController(NewsService newsService) {
        this.newsService = newsService;
    }

    @GetMapping
    public ResponseEntity<List<NewsResponseDTO>> getAllNews() {
        return ResponseEntity.ok(newsService.getAllNewsForAdmin());
    }

    @PostMapping
    public ResponseEntity<NewsResponseDTO> createNews(@RequestBody NewsRequestDTO request) {
        return ResponseEntity.ok(newsService.createNews(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<NewsResponseDTO> updateNews(@PathVariable Long id, @RequestBody NewsRequestDTO request) {
        return ResponseEntity.ok(newsService.updateNews(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteNews(@PathVariable Long id) {
        newsService.deleteNews(id);
        return ResponseEntity.ok("Xóa tin tức thành công");
    }
}