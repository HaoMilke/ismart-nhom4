-- Entirely synthetic demo content. No users, carts or orders.
-- Import ONCE after schema.sql in a fresh empty database.
USE `shop_db`;
SET NAMES utf8mb4;
START TRANSACTION;
INSERT INTO `products` (`id`,`category`,`created_at`,`description`,`image_url`,`name`,`price`,`quantity`) VALUES
(1, 'Điện thoại', NOW(6), 'Sản phẩm giả lập phục vụ kiểm thử; giá và thông số chỉ minh họa.', '/assets/images/demo-product.svg', 'Điện thoại Demo A', 3600000, 3),
(2, 'Điện thoại', NOW(6), 'Sản phẩm giả lập phục vụ kiểm thử; giá và thông số chỉ minh họa.', '/assets/images/demo-product.svg', 'Điện thoại Demo B', 3500000, 10),
(3, 'Laptop', NOW(6), 'Sản phẩm giả lập phục vụ kiểm thử; giá và thông số chỉ minh họa.', '/assets/images/demo-product.svg', 'Laptop Demo A', 12100000, 10),
(4, 'Laptop', NOW(6), 'Sản phẩm giả lập phục vụ kiểm thử; giá và thông số chỉ minh họa.', '/assets/images/demo-product.svg', 'Laptop Demo B', 12000000, 10),
(5, 'Phụ kiện', NOW(6), 'Sản phẩm giả lập phục vụ kiểm thử; giá và thông số chỉ minh họa.', '/assets/images/demo-product.svg', 'Phụ kiện Demo A', 250000, 10),
(6, 'Phụ kiện', NOW(6), 'Sản phẩm giả lập phục vụ kiểm thử; giá và thông số chỉ minh họa.', '/assets/images/demo-product.svg', 'Phụ kiện Demo B', 150000, 10),
(7, 'Đồng hồ', NOW(6), 'Sản phẩm giả lập phục vụ kiểm thử; giá và thông số chỉ minh họa.', '/assets/images/demo-product.svg', 'Đồng hồ Demo A', 900000, 10),
(8, 'Đồng hồ', NOW(6), 'Sản phẩm giả lập phục vụ kiểm thử; giá và thông số chỉ minh họa.', '/assets/images/demo-product.svg', 'Đồng hồ Demo B', 800000, 10),
(9, 'Màn hình', NOW(6), 'Sản phẩm giả lập phục vụ kiểm thử; giá và thông số chỉ minh họa.', '/assets/images/demo-product.svg', 'Màn hình Demo A', 2500000, 10),
(10, 'Màn hình', NOW(6), 'Sản phẩm giả lập phục vụ kiểm thử; giá và thông số chỉ minh họa.', '/assets/images/demo-product.svg', 'Màn hình Demo B', 2400000, 10),
(11, 'Gaming', NOW(6), 'Sản phẩm giả lập phục vụ kiểm thử; giá và thông số chỉ minh họa.', '/assets/images/demo-product.svg', 'Gaming Demo A', 700000, 10),
(12, 'Gaming', NOW(6), 'Sản phẩm giả lập phục vụ kiểm thử; giá và thông số chỉ minh họa.', '/assets/images/demo-product.svg', 'Gaming Demo B', 600000, 10);
INSERT INTO `banners` (`id`,`active`,`button_link`,`button_text`,`created_at`,`description`,`display_order`,`gradient_from`,`gradient_to`,`image_url`,`title`) VALUES
(1,b'1','#/products','Xem sản phẩm',NOW(6),'Dữ liệu giả lập cho buổi thực hành của Nhóm 4.',1,'#2563eb','#1e3a8a','/assets/images/demo-product.svg','ISmart - Bản thực hành');
INSERT INTO `news` (`id`,`author`,`category`,`content`,`created_at`,`image_url`,`published`,`summary`,`title`,`updated_at`) VALUES
(1,'Nhóm 4','Hướng dẫn','Đây là nội dung giả lập phục vụ kiểm thử trang tin tức. Không phải tin tức thương mại.',NOW(6),'/assets/images/demo-product.svg',b'1','Nội dung minh họa của bản thực hành.','Hướng dẫn dùng dữ liệu demo ISmart',NOW(6));
COMMIT;
