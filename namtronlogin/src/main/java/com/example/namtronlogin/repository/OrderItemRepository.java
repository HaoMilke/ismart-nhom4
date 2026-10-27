package com.example.namtronlogin.repository;

import com.example.namtronlogin.entity.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {
    // Không cần thêm hàm nào — OrderItem luôn được truy cập
    // thông qua Order.getItems() (do quan hệ cascade ở Order),
    // không truy vấn OrderItem độc lập.
}