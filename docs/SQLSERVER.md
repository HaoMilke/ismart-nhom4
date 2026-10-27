# Chạy ISmart với SQL Server và SSMS

Bản hiện tại dùng Microsoft JDBC Driver 13.6.0.jre11, JDK 26, SQLServerDialect và schema `dbo`. Hướng dẫn áp dụng SQL Server 2019+ trên máy Windows; dùng Express/Developer cho thực hành. Đã kiểm tra tích hợp trên SQL Server 2025 Developer với compatibility level 150; SQL Server 2019/Express và môi trường Windows của nhóm cần xác minh riêng theo checklist cuối trang.

## 1. Kiểm tra đã có Database Engine

Tại thư mục repository trong VS Code:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\Test-SqlServer.ps1
```

Nếu chỉ có SSMS mà không có dịch vụ `MSSQLSERVER` hoặc `MSSQL$SQLEXPRESS` thì cần cài SQL Server Database Engine. Nếu dịch vụ đã có nhưng dừng, mở SQL Server Configuration Manager và Start đúng instance. Không cần cài MariaDB.

## 2. Kết nối SSMS và tạo database

- Server type: Database Engine.
- Server name: tên instance thực tế; ví dụ `localhost` cho default instance hoặc `localhost\SQLEXPRESS` cho Express.
- Authentication: Windows Authentication bằng tài khoản quản trị SQL Server của bạn.
- Với chứng chỉ tự ký trên máy phát triển, có thể cần chọn Trust server certificate trong tùy chọn kết nối của SSMS.
- Mở và Execute lần lượt `database/schema.sql`, `database/seed-demo.sql`.

Schema dừng nếu database đã có bảng; seed dừng nếu ba bảng demo đã có dữ liệu. Không có lệnh DROP/TRUNCATE/DELETE. Lỗi tạo database hoặc chọn sai context được chặn trước khi tạo bảng.

Kiểm tra:

```sql
USE [shop_db];
SELECT COUNT(*) AS [tables] FROM sys.tables WHERE [is_ms_shipped] = 0;
SELECT COUNT(*) AS [products] FROM [dbo].[products];
SELECT TOP (3) [name], [category], [price] FROM [dbo].[products] ORDER BY [id];
```

Kết quả dự kiến: 9 bảng, 12 sản phẩm, tiếng Việt nguyên dấu.

## 3. Bật TCP và xác định cổng

Backend Java kết nối qua TCP. Việc SSMS kết nối được bằng Shared Memory chưa chứng minh TCP đã bật.

1. Mở **SQL Server Configuration Manager**.
2. Vào **SQL Server Network Configuration → Protocols for đúng instance**.
3. Bật **TCP/IP**.
4. Mở **TCP/IP → IP Addresses → IPAll**. Với instance dành cho dự án, có thể để trống TCP Dynamic Ports và đặt TCP Port là `1433` nếu cổng này chưa được instance khác sử dụng.
5. Restart **SQL Server (đúng instance)** để thay đổi có hiệu lực.
6. Trong SSMS thử kết nối bằng server name `tcp:localhost,1433` (hoặc cổng thực tế).

Không cần SQL Server Browser khi kết nối bằng host và cổng cố định. Không mở firewall ra Internet để chạy frontend/backend/database cùng máy. Nếu có nhiều instance, dùng cổng thực tế của instance dự án và nhập cổng đó vào Setup-Local.ps1.

## 4. Tạo SQL login cho backend

Backend mặc định dùng SQL Authentication để không cần chép DLL xác thực Windows vào JDK. SSMS vẫn dùng Windows Authentication để quản trị.

1. Trong SSMS, nhấp phải server → **Properties → Security**.
2. Nếu đang chỉ cho Windows Authentication, chọn **SQL Server and Windows Authentication mode** rồi Restart đúng dịch vụ SQL Server.
3. Vào **Security → Logins → New Login**.
4. Login name: `ismart_app`; chọn **SQL Server authentication** và tự đặt mật khẩu riêng.
5. Với tài khoản ứng dụng tự động kết nối, bỏ **User must change password at next login**; giữ chính sách độ mạnh mật khẩu. Chọn Default database: `shop_db`.
6. Trong **User Mapping**, chọn `shop_db`, đặt Default schema: `dbo`, chọn `db_datareader` và `db_datawriter`, rồi lưu.
7. Chạy đoạn dưới bằng tài khoản quản trị để Hibernate đọc metadata khi xác minh cấu trúc:

```sql
USE [shop_db];
GRANT VIEW DEFINITION TO [ismart_app];
```

Không cấp `sysadmin`/`db_owner` cho tài khoản ứng dụng. Schema được tạo bằng tài khoản quản trị ở bước 2; ứng dụng chỉ xác minh rồi đọc/ghi dữ liệu.

Thử đăng nhập SSMS bằng **SQL Server Authentication**, server `tcp:localhost,1433`, login `ismart_app` và mật khẩu vừa tạo. Khi bước này thành công mới cấu hình backend.

## 5. Tạo cấu hình riêng và chạy

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\Setup-Local.ps1
```

Nhập host, cổng, login và mật khẩu của SQL Server. Nếu đã có file cấu hình cũ:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\Setup-Local.ps1 -Reconfigure
```

Script sao lưu file cũ vào thư mục Git bỏ qua `private/local-config/`, rồi sinh khóa JWT mới. Không chép mật khẩu vào file được Git theo dõi. Giữ file riêng ngay trong `namtronlogin/`, không chép vào `src/main/resources`.

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\Start-Backend.ps1
```

Sau khi backend khởi động, mở terminal thứ hai:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\Start-Frontend.ps1
```

Mở http://127.0.0.1:5500/. Chạy trực tiếp Maven thì thư mục làm việc phải là `namtronlogin/` để đọc file cấu hình riêng.

## 6. Các lỗi thường gặp

| Thông báo | Cách kiểm tra |
| --- | --- |
| TCP/IP connection failed / connection refused / timeout | Dịch vụ đang Running, TCP/IP đã bật, host/cổng đúng; thử SSMS với `tcp:localhost,cổng` |
| Login failed for user | SQL login đúng, Mixed Mode đã bật và restart, mật khẩu đúng, login không bị khóa/yêu cầu đổi mật khẩu |
| Cannot open database shop_db | Đã chạy schema, User Mapping vào đúng DB và có quyền đọc/ghi |
| Schema-validation: missing table / wrong column type | Chạy đúng schema SQL Server trên DB mới; không dùng dump MySQL hoặc DB thuộc dự án khác |
| Cannot load driver com.mysql... / jdbc:mysql | Cấu hình riêng cũ còn ghi đè driver hoặc URL; dùng Setup-Local.ps1 -Reconfigure và kiểm tra biến môi trường cũ |
| PKIX / certificate verification | Kiểm tra URL cục bộ đã chọn đúng thiết lập chứng chỉ; khi dùng chứng chỉ tin cậy phải khớp tên server và trust store |
| UnsatisfiedLinkError mssql-jdbc_auth... | Đang dùng Windows integrated authentication trong URL; cấu hình mặc định của dự án dùng SQL Authentication, không cần DLL này |
| Port 8080 already in use | Dừng backend ISmart cũ hoặc chọn SERVER_PORT và đồng bộ URL API frontend |

`encrypt=true;trustServerCertificate=true` là cấu hình mặc định dành cho máy phát triển với chứng chỉ tự ký. Khi dùng chứng chỉ được tin cậy, đặt `trustServerCertificate=false` và cấu hình trust store/hostname phù hợp.

## 7. Xác minh sau khi chạy trên máy nhóm

- Đăng ký tài khoản demo mới; đăng nhập bằng username, tải lại trang.
- Kiểm tra tên sản phẩm có dấu và tìm kiếm sản phẩm.
- Thêm/sửa/xóa giỏ; đặt đơn và xem lịch sử bằng tài khoản vừa tạo.
- Trong SSMS đối chiếu users/carts/orders/order_items; ID mới phải được sinh tự động.
- Ghi đúng kết quả vào RTM/Issue, đính kèm minh chứng; các lỗi nghiệp vụ đã nêu trong REVIEW.md vẫn cần xử lý riêng.

Đây là checklist cần chạy trên môi trường thực tế của nhóm; không mặc định các mục đã đạt chỉ vì chuyển driver/schema.
