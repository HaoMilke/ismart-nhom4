# Kết quả kiểm tra bản chuẩn bị Git

Ngày: 26/10/2026. Đây là bằng chứng kiểm tra kỹ thuật của bản baseline, không thay cho báo cáo nghiệm thu chức năng.

## Đã thực hiện

| Kiểm tra | Kết quả | Giới hạn |
| --- | --- | --- |
| Maven Wrapper | Chạy được, tải và dùng Maven 3.9.16 | Không yêu cầu đưa Maven binary vào repository |
| Build backend | **BUILD SUCCESS** bằng JDK 26.0.2, `./mvnw -B -U -DskipTests package` | Biên dịch/đóng gói; có bỏ chạy test |
| POM | Parse XML hợp lệ; giữ Spring Boot 4.1.1 và target Java 26 | Không tự đổi dependency hoặc hạ target |
| JavaScript | **29/29** tệp qua `node --check` | Kiểm tra cú pháp, không phải tương tác trình duyệt |
| Tệp frontend | **32** tham chiếu JS/CSS cục bộ trong HTML đều tồn tại | Không kiểm tra khả dụng của Bootstrap CDN |
| Phục vụ frontend cục bộ | **34/34** yêu cầu nhận HTTP 200: HTML, 32 JS/CSS và SVG demo | Không xác nhận giao diện và API nghiệp vụ hoạt động end-to-end |
| SQL tĩnh | **9** bảng, **6** khóa ngoại; đích tham chiếu đều có trong schema | Chưa thực thi import bằng MySQL/MariaDB |
| Seed | **12** sản phẩm, **1** banner, **1** tin tức giả lập | Không tạo tài khoản, password hash, giỏ hay đơn hàng |
| Giữ nguyên Java | **73/73** tệp Java (gồm test) giống byte với gói tiếp nhận; POM cũng giữ nguyên | Chưa khắc phục các lỗi nghiệp vụ trong REVIEW.md |
| Thông tin nhạy cảm | Không còn giá trị secret không rỗng từ cấu hình cũ hoặc email cá nhân cũ ở footer trong các tệp chuẩn bị | Rà soát theo mẫu và dữ liệu đã biết, không phải cam kết phát hiện mọi loại bí mật |
| Bộ lọc Git | Đã xác minh bỏ qua `target`, `.idea`, cấu hình riêng, `.env`, SQL dump gốc, backup và ZIP | Vẫn cần kiểm tra diff khi nhóm thêm tệp mới |
| Chất lượng diff | `git diff --cached --check` được dùng trước khi đóng gói | Bốn khoảng trắng cuối dòng ở frontend gốc đã được bỏ |

Thời điểm build thành công được Maven ghi: 26/10/2026, 18:19, múi giờ +07:00. Build lần đầu tải dependency; tệp JAR và `target/` được sinh để kiểm tra nhưng không nằm trong gói mã nguồn đưa lên Git.

## Chưa thực hiện / không được suy diễn

- Chưa chạy test nạp Spring context với database; không có kết quả test chức năng đạt.
- Chưa chạy import SQL, API đăng ký/đăng nhập, giỏ, checkout hay truy cập chéo tài khoản với MySQL/MariaDB thật.
- Chưa kiểm thử đồng thời, hiệu năng p95, responsive 390/1366 px hoặc kiểm thử bảo mật động.
- Chưa thực thi các script PowerShell trên Windows; đã rà soát mã và đường dẫn của chúng. Build thực hiện trực tiếp bằng Maven Wrapper trên Linux.
- Chưa thực hiện các thay đổi nghiệp vụ được liệt kê trong REVIEW.md.
- Chưa tạo commit, ghi công tác giả, push, tạo Issue/PR hay thay đổi quyền GitHub. Gói nguồn không chứa `.git`.
- Chưa chuyển task, ca kiểm thử hoặc Sprint trên Notion sang Done/Đạt.

## Kiểm tra tiếp trên máy nhóm

1. Dùng đúng JDK, import schema/seed vào DB mới và chạy thiết lập cấu hình riêng.
2. Chạy `mvnw.cmd test`, backend và frontend; lưu kết quả có build/commit.
3. Chạy lại các ca RTM theo từng User Story, ưu tiên các chênh lệch RV-01 đến RV-10.
4. Tạo Issue/PR cho từng phần sửa; chỉ ghi Done khi đủ review, tiêu chí và minh chứng thật.
