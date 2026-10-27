# Kết quả kiểm tra kỹ thuật

## Chuyển sang SQL Server — 27/10/2026

Thực hiện theo yêu cầu của Hào. Cấu hình và script hiện tại dùng SQL Server; phần baseline bên dưới được giữ để truy vết bản tiếp nhận, không mô tả trạng thái kiểm thử hiện tại. Hướng dẫn Windows/SSMS: [SQLSERVER.md](SQLSERVER.md).

Môi trường xác minh: Ubuntu 24.04 x64, Amazon Corretto 26.0.2.11.1, Maven Wrapper 3.9.16, Microsoft JDBC 13.6.0.jre11, SQL Server Developer 2025 **17.0.5005.3**, database compatibility level **150**. Engine và database thử nghiệm tách khỏi dữ liệu của nhóm; chỉ dùng dữ liệu giả.

| Kiểm tra | Kết quả thực tế |
| --- | --- |
| Biên dịch/đóng gói | `./mvnw -B -U -DskipTests package`: BUILD SUCCESS |
| Schema T-SQL | Thực thi tạo `shop_db`, đủ 9 bảng, 6 khóa ngoại; IDENTITY và kiểu NVARCHAR/datetime2/decimal/bit |
| Dữ liệu mẫu | 12 sản phẩm, 1 banner, 1 tin tức; đọc đúng tiếng Việt |
| Chạy lặp | Schema từ chối DB đã có bảng (51001); seed từ chối dữ liệu demo đã tồn tại (51003); 12 sản phẩm giữ nguyên |
| Tài khoản database | Backend chạy bằng SQL login `ismart_app`, chỉ db_datareader/db_datawriter và VIEW DEFINITION; không sysadmin/db_owner |
| Hibernate | Khởi động với `ddl-auto=validate`, xác minh được mapping của 9 entity; không tự sửa bảng |
| API đọc | Danh sách 12 sản phẩm, tìm “Điện thoại” trả 2 kết quả; banner và tin tức đọc được |
| API ghi | Đăng ký tài khoản giả lập có họ tên tiếng Việt → đăng nhập/JWT → thêm 1 sản phẩm vào giỏ → tạo đơn → lịch sử trả đúng đơn vừa tạo; địa chỉ tiếng Việt được giữ |
| Kiểm tra DB sau API | 1 user và 1 order trong database thử nghiệm; ID được sinh tự động |
| Test có sẵn | `./mvnw -B test`: contextLoads, 1 test, 0 failures, 0 errors, 0 skipped; kết nối SQL Server thật |
| PowerShell | Parse thành công 4 script bằng PowerShell 7.6.9; thử Setup-Local trong thư mục tạm: mặc định host/port/login, nhập mật khẩu ẩn, JWT ngẫu nhiên 32 byte, reconfigure và sao lưu cấu hình cũ |
| Git | Chuẩn hóa CRLF thành LF cho 78 tệp nguồn theo .gitattributes trong commit riêng; không đổi nội dung Java/JS ở commit chuẩn hóa |

**Giới hạn:** đây là kiểm tra tích hợp khi chuyển database, chưa phải nghiệm thu đầy đủ RTM. Chưa xác minh trực tiếp SQL Server 2019/Express, SSMS, PowerShell 5.1 hoặc máy Windows của nhóm; compatibility level 150 trên SQL Server 2025 không thay thế kiểm thử SQL Server 2019. Chưa kiểm thử UI, nhiều người dùng đồng thời, hiệu năng, các nhánh lỗi nghiệp vụ hay bảo mật động. Các vấn đề trong REVIEW.md chưa được sửa bởi lần chuyển database này; không tự chuyển task/test sang Done/Đạt.

## Hồ sơ baseline trước chuyển đổi

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
- Tại thời điểm kiểm tra trước khi đưa lên GitHub, chưa tạo commit hoặc push. Trạng thái đưa nguồn lên được ghi ở mục bàn giao bên dưới. Chưa tạo Issue/PR, thay đổi quyền kho hoặc gán công việc cho tài khoản thành viên. Gói ZIP không chứa `.git`.
- Chưa chuyển task, ca kiểm thử hoặc Sprint trên Notion sang Done/Đạt.

## Kiểm tra tiếp trên máy nhóm

1. Dùng đúng JDK, import schema/seed vào DB mới và chạy thiết lập cấu hình riêng.
2. Chạy `mvnw.cmd test`, backend và frontend; lưu kết quả có build/commit.
3. Chạy lại các ca RTM theo từng User Story, ưu tiên các chênh lệch RV-01 đến RV-10.
4. Tạo Issue/PR cho từng phần sửa; chỉ ghi Done khi đủ review, tiêu chí và minh chứng thật.

## Bàn giao mã nguồn lên GitHub

Repository: [HaoMilke/ismart-nhom4](https://github.com/HaoMilke/ismart-nhom4), nhánh `main`, riêng tư.

Commit nhập baseline: [6860b9d](https://github.com/HaoMilke/ismart-nhom4/commit/6860b9da9f4374f24a833897de2c3bbbcf12ca1a).

Đã đối chiếu đường dẫn, mode và Git blob SHA của đủ **129 tệp** với gói được rà soát: không sai khác, không có tệp thừa. Bản cập nhật hướng dẫn bàn giao sau đó chỉ thay đổi README và tài liệu xác minh này.

Không kèm tệp build, cấu hình bí mật hoặc SQL dữ liệu người dùng trong lần đưa nguồn lên. Task và test trên Notion chưa được tự chuyển Done/Đạt. Các giới hạn kiểm thử ở trên vẫn còn hiệu lực.
