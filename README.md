# ISmart — Nhóm 4

Website bán thiết bị điện tử cho học phần Quản lý dự án theo Agile/Scrum. Mã nguồn được tiếp nhận từ MyShop, đưa vào Git và chuyển cơ sở dữ liệu sang **Microsoft SQL Server** theo lựa chọn của nhóm.

## 1. Công nghệ và cấu trúc

| Thành phần | Cấu hình hiện tại |
| --- | --- |
| Giao diện | HTML, CSS, JavaScript thuần; Bootstrap 5.3.3 qua CDN |
| Backend | Spring Boot 4.1.1, Spring Security, Spring Data JPA |
| Build | JDK 26; Maven Wrapper tải Maven 3.9.16 |
| Cơ sở dữ liệu | Microsoft SQL Server 2019 trở lên; quản lý bằng SSMS |
| JDBC | Microsoft mssql-jdbc 13.6.0.jre11 (hỗ trợ JDK 26) |
| Xác thực ứng dụng | JWT; mật khẩu băm BCrypt |
| Cấu trúc bảng | T-SQL do nhóm chạy trước; Hibernate `validate` khi khởi động |

| Thư mục | Nội dung |
| --- | --- |
| `frontend/` | Giao diện, router và API client |
| `namtronlogin/` | Backend Maven; giữ tên package gốc |
| `database/schema.sql` | T-SQL tạo `shop_db`, 9 bảng, khóa và ràng buộc |
| `database/seed-demo.sql` | 12 sản phẩm, 1 banner, 1 tin tức giả lập |
| `scripts/` | Kiểm tra SQL Server, tạo cấu hình riêng và chạy trên Windows |
| `docs/SQLSERVER.md` | Cấu hình SQL Server/SSMS, tài khoản và xử lý lỗi kết nối |
| `.github/` | Mẫu Issue, báo lỗi và Pull Request |

SSMS là công cụ quản trị; máy vẫn cần cài **SQL Server Database Engine**. Không cần cài MySQL/MariaDB hoặc npm cho bản này. Giao diện nguồn còn nhãn ShopDemo; phạm vi học phần vẫn là ISmart.

## 2. Chuẩn bị và kiểm tra máy Windows

Mở **toàn bộ thư mục `ismart-nhom4`** bằng VS Code. Terminal mặc định là PowerShell. Nếu đã clone, cập nhật bằng `git pull --ff-only` khi thư mục không có thay đổi riêng cần xử lý.

```powershell
git clone https://github.com/HaoMilke/ismart-nhom4.git
cd ismart-nhom4
code .
```

Kiểm tra:

```powershell
java -version
javac -version
python --version
powershell -ExecutionPolicy Bypass -File .\scripts\Test-SqlServer.ps1
```

Cần JDK 26, Python 3 (hoặc Live Server), SQL Server Database Engine đang chạy và SSMS. SQL Server Express/Developer dùng cho thực hành. Internet cần cho lần tải Maven/dependency đầu và Bootstrap CDN. Giữ Java 25 cho dự án khác nếu cần; chọn JDK 26 trong terminal chạy ISmart.

SQL Server thường có tên `localhost` hoặc `localhost\SQLEXPRESS` trong SSMS. Backend mặc định kết nối TCP `localhost:1433`; với named instance, cấu hình đúng cổng TCP của instance theo [hướng dẫn](docs/SQLSERVER.md).

## 3. Khởi tạo dữ liệu trong SSMS

Kết nối SSMS bằng tài khoản có quyền tạo database, thường là Windows Authentication của chủ máy:

1. **File → Open → File**: mở `database/schema.sql`, bấm **Execute / F5**.
2. Mở `database/seed-demo.sql`, bấm **Execute / F5**.
3. Refresh Object Explorer: thấy `shop_db`, 9 bảng và 12 sản phẩm.

Các tệp hiện là **T-SQL**, có dấu phân cách batch `GO`; chạy trong SSMS hoặc sqlcmd, không gửi nguyên file qua JDBC. Schema chỉ dùng cho database mới và trống; nếu có bảng thì dừng với thông báo, không xóa bảng hay ghi đè dữ liệu. Seed cũng từ chối nạp lặp khi bảng demo đã có dữ liệu.

Mọi chuỗi tiếng Việt dùng `nvarchar` và literal `N'...'`. Các ID dùng `IDENTITY(1,1)`; không phải nhập ID thủ công. Dữ liệu demo không chứa tài khoản, mật khẩu, giỏ hàng hoặc đơn hàng thật.

## 4. Tài khoản kết nối backend

Bản chạy mặc định dùng **SQL Server Authentication**, tài khoản `ismart_app` do bạn tự tạo trong SQL Server. SSMS vẫn có thể đăng nhập bằng Windows Authentication để quản trị.

Thực hiện một lần theo [docs/SQLSERVER.md](docs/SQLSERVER.md): bật Mixed Mode nếu cần, bật TCP/IP, xác định cổng, tạo SQL login `ismart_app`, map vào `shop_db` với quyền đọc/ghi và đọc metadata. Không cần cấp `sysadmin` hoặc `db_owner` cho tài khoản ứng dụng.

Tại thư mục gốc repository:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\Setup-Local.ps1
```

Script hỏi host, cổng (mặc định `localhost`, `1433`), SQL login (mặc định `ismart_app`) và mật khẩu ở chế độ ẩn; sau đó sinh khóa JWT ngẫu nhiên. File riêng là `namtronlogin/application-local.properties`, đã được Git bỏ qua.

Nếu đã tạo cấu hình cũ cho MySQL, chuyển bằng:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\Setup-Local.ps1 -Reconfigure
```

Cấu hình trước được sao lưu dưới `private/local-config/` (Git bỏ qua). Script không tự đọc hay nhập database; phải hoàn tất bước SSMS trước. Không gửi mật khẩu/khóa trong chat hoặc đưa file riêng lên Git.

Ví dụ URL kết nối cục bộ:

```text
jdbc:sqlserver://localhost:1433;databaseName=shop_db;encrypt=true;trustServerCertificate=true;loginTimeout=10
```

`trustServerCertificate=true` dành cho SQL Server phát triển trên máy với chứng chỉ tự ký. Môi trường dùng chứng chỉ tin cậy cần đặt `false` và cấu hình tên máy/chứng chỉ phù hợp. Username/password được lưu ngoài URL. Backend cũng nhận `DB_URL`, `DB_USERNAME`, `DB_PASSWORD`, `JWT_SECRET`, `JWT_EXPIRATION_MS`, `SERVER_PORT`, `SHOW_SQL` từ môi trường; file cấu hình riêng có thể ghi đè các giá trị mặc định đó.

## 5. Chạy trong VS Code

Terminal 1 — tại thư mục gốc repository:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\Start-Backend.ps1
```

Backend mặc định: `http://localhost:8080/api`. Chờ thông báo `Started NamtronloginApplication`; lỗi kết nối/đăng nhập/schema phải được xử lý trước khi kiểm tra chức năng.

Terminal 2 — vẫn tại thư mục gốc:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\Start-Frontend.ps1
```

Mở **http://127.0.0.1:5500/**. Không mở `index.html` bằng `file://`. CORS nguồn cho phép cổng 5500 và 63342. Nếu đổi API/cổng, đồng bộ `frontend/js/api/api.js` và cấu hình CORS.

Đăng ký tài khoản ứng dụng mới trên giao diện rồi dùng username/mật khẩu vừa tạo để đăng nhập. Tài khoản `ismart_app` là tài khoản kết nối database, không phải tài khoản đăng nhập website.

Nếu cần thử trang quản trị, sau khi đăng ký một tài khoản demo trên web, dùng SSMS cập nhật **chính tài khoản demo trong DB cục bộ**:

```sql
USE [shop_db];
UPDATE [dbo].[users] SET [role] = N'ADMIN' WHERE [username] = N'admin_demo_local';
```

Thay username bằng tài khoản thực sự vừa tạo, đăng xuất và đăng nhập lại để nhận JWT quyền mới.

## 6. Build và xác minh

Trong `namtronlogin/`, với JDK 26:

```powershell
.\mvnw.cmd -DskipTests package
.\mvnw.cmd test
```

Lệnh đầu bỏ chạy test. Test context hiện có cần SQL Server và cấu hình DB/JWT hợp lệ. Xem [kết quả và giới hạn xác minh](docs/VERIFICATION.md), [hướng dẫn SQL Server](docs/SQLSERVER.md) và [các chênh lệch với đặc tả](docs/REVIEW.md). Không dùng một lần build thành công để kết luận các User Story đã nghiệm thu.

## 7. Quy trình nhóm

Phạm vi: tài khoản, tra cứu sản phẩm, giỏ hàng, đặt hàng COD và tra cứu đơn; 13 US/UC, 3 Sprint, 60 task, lịch mô phỏng 01–25/10/2026. Các phần quản trị/banner/tin tức/khuyến mại trong gói nguồn vẫn được giữ vì giao diện có phụ thuộc.

- [Repository Public](https://github.com/HaoMilke/ismart-nhom4)
- [GitHub Projects — 60 Issues, 4 cách xem](https://github.com/users/HaoMilke/projects/2) (quyền xem Projects độc lập với repo)
- [Notion — tài liệu, kế hoạch và RTM](https://app.notion.com/p/4039c7e56e0181e08750c16da7ec85da)
- [CONTRIBUTING.md](CONTRIBUTING.md)

Thực hành theo chuỗi **task Notion → Issue → nhánh → commit → PR → review → kiểm thử → minh chứng**. Chỉ Done khi đủ tiêu chí thực tế; không lùi ngày commit theo lịch mô phỏng. Các Issue đã được tạo, không tạo trùng 60 task đó.

Trước commit, kiểm tra `git diff --cached --name-only` và `git diff --cached --check`. Không đưa `target/`, cấu hình riêng, khóa, log, bản sao database hoặc dữ liệu người dùng thật lên repository.
