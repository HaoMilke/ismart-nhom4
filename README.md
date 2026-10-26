# ISmart — Nhóm 4

Website bán thiết bị điện tử, dùng cho học phần Quản lý dự án theo Agile/Scrum. Đây là bản mã nguồn tiếp nhận từ `MyShop`, được làm sạch để khởi tạo quản lý phiên bản và tiếp tục thực hành.

**Đọc [báo cáo rà soát](docs/REVIEW.md) và [kết quả kiểm tra](docs/VERIFICATION.md) trước khi đánh giá mức hoàn thành. Có mã nguồn chưa đồng nghĩa đã nghiệm thu các User Story.**

## 1. Công nghệ và cấu trúc

| Thành phần | Cấu hình trong mã nguồn được tiếp nhận |
| --- | --- |
| Giao diện | HTML, CSS, JavaScript thuần; Bootstrap 5.3.3 qua CDN |
| Backend | Spring Boot 4.1.1, Spring Security, Spring Data JPA |
| Build | Java 26; Maven Wrapper tải Maven 3.9.16 |
| Xác thực | JWT; mật khẩu băm BCrypt |
| Cơ sở dữ liệu | JDBC MySQL; SQL đầu vào xuất từ MariaDB 10.4.32 |

| Thư mục / tệp | Mục đích |
| --- | --- |
| `frontend/` | Giao diện, router và API client |
| `namtronlogin/` | Backend Maven; giữ tên thư mục và package gốc để tránh đổi đường dẫn không cần thiết |
| `database/schema.sql` | Cấu trúc 9 bảng, không chứa dữ liệu người dùng |
| `database/seed-demo.sql` | 12 sản phẩm, 1 banner, 1 tin tức hoàn toàn giả lập |
| `scripts/` | Thiết lập cấu hình riêng và mở backend/frontend trên Windows |
| `docs/` | Rà soát, phạm vi và kết quả kiểm tra |
| `.github/` | Mẫu Issue công việc, báo lỗi và Pull Request |

Giao diện gốc còn nhãn **ShopDemo**. Tên báo cáo/kế hoạch của nhóm là **ISmart**; việc đồng bộ tên giao diện được ghi riêng trong báo cáo, chưa tự đổi hàng loạt.

## 2. Phạm vi thực hành

Nhóm tập trung 4 nhóm chức năng: tài khoản, tra cứu sản phẩm, giỏ hàng, đặt hàng COD và tra cứu đơn. Cơ sở kế hoạch gồm 13 User Story/Use Case, 3 Sprint, 60 task, lịch giả định 01–25/10/2026.

Quản trị, banner, tin tức, hồ sơ và khuyến mại đã có trong gói tiếp nhận, đang được các trang gọi đến nên được giữ để không phá phụ thuộc. Sự hiện diện của chúng không tự mở rộng phạm vi nghiệm thu.

Không đưa tài khoản, mật khẩu băm, địa chỉ khách hàng hay đơn hàng trong SQL gốc lên repository. Dữ liệu demo chỉ là ví dụ, không phản ánh giá bán hay đơn hàng thật.

## 3. Chuẩn bị môi trường

- JDK **26** hoặc mới hơn để biên dịch target 26 hiện có. Kiểm tra `java -version`, `javac -version` và `JAVA_HOME`.
- MySQL hoặc MariaDB đang chạy, thường tại `127.0.0.1:3306`. Xem kết quả xác minh thực tế tại `docs/VERIFICATION.md`; không mặc định mọi phiên bản DB đã được kiểm thử.
- Python 3 cho script mở frontend, hoặc VS Code Live Server tại cổng 5500.
- Internet ở lần chạy đầu để Maven Wrapper tải Maven/dependency và để tải Bootstrap từ CDN. Không cần npm để chạy frontend hiện tại.

## 4. Khởi tạo database cục bộ

Chỉ nhập các tệp dưới đây vào **database `shop_db` mới và trống**. Không nhập đè lên database đang có dữ liệu cần giữ. Tệp schema không dùng `DROP`, `TRUNCATE` hoặc `DELETE`; việc chạy lại trên bảng đã tồn tại không phải cơ chế nâng cấp schema.

Mở MySQL/MariaDB client hoặc phpMyAdmin, thực hiện lần lượt:

1. `database/schema.sql`
2. `database/seed-demo.sql`

Ví dụ với command-line client, mở từ thư mục repository:

```text
mysql -u root -p
SOURCE database/schema.sql;
SOURCE database/seed-demo.sql;
```

`-p` yêu cầu nhập mật khẩu tương tác. Dữ liệu demo không có tài khoản mặc định. Đăng ký tài khoản mới trên giao diện, rồi dùng chính username/mật khẩu vừa tạo để đăng nhập.

Nếu cần thực hành trang quản trị, sau khi tự đăng ký một tài khoản demo, nâng quyền chính tài khoản đó trong **DB cục bộ của mình**, ví dụ với username do mình chọn:

```sql
UPDATE users SET role = 'ADMIN' WHERE username = 'admin_demo_local';
```

Đăng xuất rồi đăng nhập lại để nhận JWT mang quyền mới. Không dùng tài khoản hoặc dữ liệu người dùng thật.

## 5. Tạo cấu hình riêng

Mở PowerShell tại thư mục repository:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\Setup-Local.ps1
```

Script hỏi tài khoản DB, nhập mật khẩu ở chế độ ẩn và sinh khóa JWT ngẫu nhiên. Kết quả nằm tại `namtronlogin/application-local.properties`, đã được `.gitignore` loại trừ. Script không ghi đè nếu tệp đã tồn tại và không in khóa/mật khẩu ra màn hình.

Cách thủ công: sao chép `namtronlogin/application-local.properties.example` thành `application-local.properties` ngay trong cùng thư mục, điền cấu hình máy mình và khóa JWT riêng ít nhất 32 byte. Giá trị `jwt.secret` trống trong tệp mẫu không thể dùng để ký token.

Backend cũng nhận `DB_URL`, `DB_USERNAME`, `DB_PASSWORD`, `JWT_SECRET`, `JWT_EXPIRATION_MS`, `SERVER_PORT`, `SHOW_SQL` từ môi trường. Tệp cấu hình riêng được nạp khi chạy với thư mục làm việc là `namtronlogin/`. Không chép tệp riêng vào `src/main/resources`.

## 6. Chạy bằng VS Code / PowerShell

Mở toàn bộ thư mục repository bằng VS Code, không chỉ mở `frontend/`.

Terminal 1 — backend:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\Start-Backend.ps1
```

Backend mặc định: `http://localhost:8080/api`. Có thể chạy trực tiếp `mvnw.cmd spring-boot:run` trong `namtronlogin/` sau khi chuẩn bị cấu hình.

Terminal 2 — frontend:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\Start-Frontend.ps1
```

Mở `http://127.0.0.1:5500/`. Không mở `index.html` bằng `file://`. CORS hiện cho phép cổng 5500 và 63342. Nếu đổi cổng/API, cần đồng bộ cấu hình CORS và `frontend/js/api/api.js`.

## 7. Biên dịch và kiểm thử

Trong `namtronlogin/`:

```powershell
.\mvnw.cmd -DskipTests package
.\mvnw.cmd test
```

Lệnh đầu bỏ chạy test, không phải kết quả kiểm thử chức năng. Lệnh thứ hai chạy test hiện có và cần cấu hình DB/JWT phù hợp; mã tiếp nhận mới có một test nạp Spring context. Xem chính xác những kiểm tra đã/chưa thực hiện tại `docs/VERIFICATION.md`.

## 8. Lấy mã nguồn và làm việc với Git

Repository của nhóm: [HaoMilke/ismart-nhom4](https://github.com/HaoMilke/ismart-nhom4). Kho đang để riêng tư; thành viên cần được chủ kho cấp quyền trước khi clone.

Mở PowerShell tại thư mục muốn lưu dự án:

```powershell
git clone https://github.com/HaoMilke/ismart-nhom4.git
cd ismart-nhom4
code .
```

Tiếp tục chuẩn bị database và cấu hình riêng theo mục 4–6. Dùng [CONTRIBUTING.md](CONTRIBUTING.md) cho công việc mới: cập nhật main, tạo nhánh theo mã task, commit bằng tài khoản của mình, mở PR và nhận review.

Bản đầu tiên được đưa lên gồm 129 tệp đã rà soát. Lịch sử nhập nguồn không phải lịch sử triển khai các User Story của cả nhóm; không đổi ngày commit về lịch Sprint giả định.

Trước mỗi commit, kiểm tra `git diff --cached --name-only` và `git diff --cached --check`. Danh sách không được có `target/`, `.idea/`, `application-local.properties`, SQL gốc, khóa, log hoặc dữ liệu khách hàng.

## 9. Liên kết Notion

[Notion ISmart — Nhóm 4](https://app.notion.com/p/4039c7e56e0181e08750c16da7ec85da)

Mỗi việc mới dùng chuỗi: **task Notion → GitHub Issue → nhánh → Pull Request → review → ca kiểm thử → minh chứng**. Chỉ cập nhật Done khi đủ điều kiện thực tế. Chi tiết tại [CONTRIBUTING.md](CONTRIBUTING.md).
