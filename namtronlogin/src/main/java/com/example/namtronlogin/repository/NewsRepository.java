package com.example.namtronlogin.repository;

import com.example.namtronlogin.entity.News;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NewsRepository extends JpaRepository<News, Long> {

    // Dùng cho trang public: chỉ lấy bài đã "published", mới nhất lên trước
    List<News> findByPublishedTrueOrderByCreatedAtDesc();

    List<News> findByPublishedTrueAndCategoryIgnoreCaseOrderByCreatedAtDesc(String category);

    List<News> findByTitleContainingIgnoreCaseAndPublishedTrue(String keyword);

    // Dùng cho admin: lấy tất cả kể cả bài ẩn
    List<News> findAllByOrderByCreatedAtDesc();
}