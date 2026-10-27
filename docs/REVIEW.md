# Rà soát mã nguồn trước khi đưa lên Git

> **Cấu hình hiện tại:** dự án đã chuyển sang SQL Server. Các nhận xét MySQL/MariaDB bên dưới mô tả bản nguồn ban đầu; xem [SQLSERVER.md](SQLSERVER.md) và phần xác minh chuyển đổi trong VERIFICATION.md.

Ngày rà soát: 26/10/2026. Đầu vào: gói `MyShop.zip` và SQL `shop_db (1).sql` do nhóm cung cấp. Phạm vi: chọn tệp, cấu hình, dữ liệu, phụ thuộc, luồng nghiệp vụ chính và đối chiếu cơ sở đặc tả ISmart 3.0.

## 1. Kết luận

Bản này là **baseline để quản lý phiên bản và tiếp tục phát triển**, không phải tuyên bố hoàn thành 13 User Story. Các phát hiện chức năng bên dưới được xác định khi đọc mã; cần chạy lại ca kiểm thử để ghi nhận kết quả nghiệm thu thực tế. Kết quả build và các kiểm tra đã chạy nằm riêng tại [VERIFICATION.md](VERIFICATION.md).

Phần Java nghiệp vụ, các controller/entity/repository/DTO, frontend chức năng và phiên bản POM được giữ từ gói tiếp nhận. Thay đổi nội dung trên tệp gốc gồm cấu hình chia sẻ và thông tin liên hệ ở footer. Bốn tệp frontend được bỏ khoảng trắng cuối dòng theo kiểm tra Git; không sửa nghiệp vụ âm thầm.

## 2. Những tệp được giữ và lý do

| Nhóm | Giữ lại | Lý do |
| --- | --- | --- |
| Frontend | HTML, 3 CSS và toàn bộ 29 JavaScript đang được `index.html` nạp | Các trang, API client, router và thành phần có liên kết với nhau |
| Backend | `pom.xml`, `src/main`, `src/test`, `mvnw`, `mvnw.cmd`, `.mvn/wrapper/maven-wrapper.properties` | Đủ mã nguồn và cách build; không cần bản `.class` đã biên dịch |
| Chức năng bổ sung | Quản trị, banner, tin tức, khuyến mại, hồ sơ | Giao diện hiện dùng chúng; việc xóa cần một thay đổi tách module có kiểm thử, không chỉ xóa thư mục |
| Database | DDL 9 bảng + seed tự tạo | Có thể dựng dữ liệu mới mà không công bố dữ liệu cá nhân |
| Quy trình | README, CONTRIBUTING, mẫu Issue và PR | Để 5 thành viên nhận việc, review và gắn minh chứng với Notion |

**Không đổi `namtronlogin` thành package/tên module mới trong lần chuẩn bị này.** Việc đổi tên cần cập nhật package, cấu hình IDE và kiểm thử riêng. Không xóa DTO/entity/repository chỉ vì tên chức năng nằm ngoài phạm vi báo cáo, vì mã còn tham chiếu đến chúng.

## 3. Những nội dung được loại hoặc tách

| Nội dung | Xử lý |
| --- | --- |
| `namtronlogin/target/` | Loại tệp build/`.class`; có thể tạo lại từ source |
| `namtronlogin/.idea/` | Loại trạng thái IDE và đường dẫn máy riêng |
| `HELP.md` được sinh từ mẫu, `frontend/assets/hehe.css` chỉ có comment và không được tham chiếu | Loại khỏi bản chuẩn bị |
| Khóa JWT ghi trực tiếp trong `application.properties` | Thay bằng biến môi trường hoặc tệp cấu hình riêng bị Git bỏ qua |
| Thông tin kết nối máy riêng | Tách sang cấu hình cục bộ; tệp theo dõi không giữ mật khẩu thật |
| Tài khoản và password hash trong SQL gốc | Không sao chép vào repository |
| Giỏ và lịch sử đơn từ SQL gốc | Không sao chép; seed không tạo tài khoản, giỏ hay đơn |
| Liên hệ cá nhân và liên kết video riêng ở footer | Thay bằng liên hệ demo trung lập |
| Lịch sử Git | Không kèm `.git`, không tạo commit lùi ngày hoặc gán tác giả giả |

85 tệp của gói tiếp nhận được loại, chủ yếu là build và IDE. DDL được rút riêng từ SQL gốc; toàn bộ INSERT trong seed là dữ liệu mới, không phải dữ liệu khách hàng đã ẩn vài trường.

## 4. Chênh lệch với đặc tả và lỗi cần xử lý

### RV-01 — Đăng ký/đăng nhập khác với luồng email trong đặc tả

**Ưu tiên cao — UC-01, UC-02.** `frontend/js/pages/login.js`, `register.js`, `AuthService.java` và DTO đang dùng username để xác thực. Đặc tả dùng email/mật khẩu; luồng đăng ký có xác nhận mật khẩu và chuẩn hóa email. Code hiện không có trường xác nhận mật khẩu, chưa có kiểm tra email sau chuẩn hóa hay validation server tương ứng trong DTO.

**Cần làm:** nhóm quyết định giữ đặc tả hay thay đổi luồng; nếu giữ đặc tả thì sửa xuyên suốt FE/DTO/service/repository và test email trùng khác hoa/thường/khoảng trắng, dữ liệu thiếu và xác nhận sai. Không đổi tài liệu chỉ để tự tuyên bố chức năng đạt.

### RV-02 — Khách chưa đăng nhập không có giỏ như đặc tả

**Ưu tiên cao — UC-02, UC-07 đến UC-10.** `app.js` bảo vệ route giỏ; `productDetail.js` chuyển sang login trước khi thêm; `CartService` lưu giỏ theo tài khoản trong DB. Baseline đặc tả cho khách dùng giỏ của trình duyệt và giữ giỏ để tiếp tục sau đăng nhập.

**Cần làm:** chốt mô hình giỏ. Nếu giữ đặc tả, bổ sung giỏ khách và chuyển tiếp/giữ giỏ sau đăng nhập; kiểm tra logout và dữ liệu giữa tài khoản. Đây là thay đổi nghiệp vụ, không giải quyết bằng cách xóa entity giỏ.

### RV-03 — Kiểm tra tồn kho của giỏ chưa đủ

**Ưu tiên cao — UC-07, UC-09.** Trong `CartService.addToCart`, kiểm tra chỉ so số lượng mới gửi với tồn; sau đó cộng vào số lượng đang có mà không kiểm tra tổng. `updateCartItem` chỉ từ chối số lượng <= 0, chưa so tồn kho. Giá trị null cũng chưa có kiểm tra đầu vào rõ ràng.

**Ví dụ cần chạy:** tồn 3, giỏ đã có 2, thêm 2 phải bị từ chối và giữ giỏ; đổi số lượng từ 2 lên 4 cũng phải bị từ chối. Kiểm tra 0, âm, null và sản phẩm không tồn tại. Checkout có kiểm tra tồn lại nhưng không thay thế yêu cầu giữ giỏ hợp lệ.

### RV-04 — Chưa có cơ chế chống tạo đơn lặp

**Ưu tiên cao — UC-11.** `CreateOrderRequestDTO` chỉ có địa chỉ và mã khuyến mại; schema không có mã yêu cầu duy nhất; `OrderService.createOrder` không xử lý idempotency. `checkout.js` chưa có trạng thái đang gửi để ngăn bấm liên tiếp. Một giao dịch đơn lẻ không tự bảo đảm hai request đồng thời cùng mã chỉ tạo một đơn.

**Cần làm:** mã yêu cầu và ràng buộc duy nhất tại DB, xử lý gửi lại nhất quán, kiểm thử gửi đồng thời. Khóa nút chỉ là hỗ trợ UX, không thay cơ chế phía server.

### RV-05 — Nguy cơ tranh chấp tồn khi mua đồng thời

**Ưu tiên cao — UC-11.** `OrderService` có `@Transactional`, nhưng đọc tồn rồi ghi giảm qua entity; `ProductRepository` chưa có thao tác khóa dòng hay cập nhật tồn có điều kiện và `Product` chưa có trường version. Đọc mã cho thấy chưa có cơ chế xử lý tranh chấp rõ ràng; cần kiểm thử đồng thời để xác định biểu hiện thực tế.

**Cần làm:** chọn khóa bi quan/phiên bản lạc quan/cập nhật có điều kiện phù hợp; khi đặt nhiều sản phẩm cần thứ tự khóa nhất quán và xử lý xung đột. Test hai người mua sản phẩm tồn thấp, tổng lượng bán và tồn sau giao dịch.

### RV-06 — Dữ liệu và xác nhận đơn chưa đủ theo UC-11

**Ưu tiên cao.** Checkout chỉ nhập địa chỉ; DTO/Order chưa lưu riêng tên người nhận, điện thoại, phương thức COD và ảnh chụp tên sản phẩm lúc đặt. `toResponseDTO` lấy tên từ sản phẩm hiện tại, trong khi giá được snapshot đúng bằng `priceAtOrder`. Luồng hiện chưa có bước yêu cầu xác nhận lại khi giá thay đổi giữa lúc xem giỏ và gửi đơn.

**Cần làm:** bổ sung trường/bước đã yêu cầu, validation server, lưu snapshot dữ liệu cần giữ. Test đổi giá/đổi tên sản phẩm sau đặt, thiếu thông tin nhận hàng, giá thay đổi trước khi xác nhận.

### RV-07 — Chưa có API/trang chi tiết đơn riêng theo mã

**Ưu tiên cao — UC-13.** `OrderController` hiện chỉ POST tạo đơn và GET danh sách của tài khoản; `orders.js` hiển thị item trong từng thẻ danh sách. Chưa có `GET /api/orders/{id}` và route chi tiết đơn theo mã để kiểm tra truy cập chéo đúng như UC-13. Danh sách hiện có lọc theo user, đó là phần đã thấy trong code nhưng chưa thay thế ca chi tiết theo mã.

**Cần làm:** thêm truy vấn kiểm tra đồng thời id và chủ sở hữu; không tiết lộ đơn khác tài khoản. Test hai user, mã đơn không tồn tại và phiên hết hạn.

### RV-08 — Validation server và phản hồi lỗi chưa chặt

**Ưu tiên cao.** DTO nhận đăng ký, giỏ, đơn và cập nhật chưa có quy tắc validation tương ứng; controller nhận `@RequestBody` chưa có `@Valid`. Một số thao tác gọi phương thức trên trường có thể null. `GlobalExceptionHandler.handleGeneral` trả trực tiếp `ex.getMessage()` ra client, có thể lộ chi tiết nội bộ khi lỗi DB.

**Cần làm:** validation server theo BR, ánh xạ lỗi 400 có thông báo phù hợp, lỗi nội bộ trả thông báo chung và log phía server đã loại dữ liệu nhạy cảm. Thêm test dữ liệu thiếu/sai kiểu và lỗi ràng buộc.

### RV-09 — JWT chưa phản ánh thay đổi trạng thái/quyền trong DB

**Ưu tiên cao cho bản triển khai dùng chung.** `JwtAuthenticationFilter` lấy username/role từ token hợp lệ và không đọc trạng thái tài khoản hiện tại. Việc block/đổi quyền/đổi mật khẩu trong DB chưa có cơ chế làm mất hiệu lực token đã cấp; TTL mặc định là 24 giờ. Logout frontend chỉ xóa token trên trình duyệt đó.

**Cần làm:** chốt chính sách phiên, kiểm tra trạng thái hoặc version/revocation phù hợp; test tài khoản bị khóa sau login, quyền admin bị hạ và token cũ sau thay mật khẩu. Không tuyên bố có thu hồi token server khi chưa cài đặt.

### RV-10 — Giá trị dữ liệu được ghép vào HTML chưa escape

**Ưu tiên cao trước khi cho người ngoài nhập dữ liệu.** Nhiều trang dùng template literal rồi gán `innerHTML`, ví dụ username ở header, tên/mô tả sản phẩm, địa chỉ đơn và hồ sơ. Chưa thấy cơ chế escape/sanitize dùng thống nhất. Đây là vị trí cần xác minh nguy cơ XSS, chưa phải kết quả penetration test.

**Cần làm:** dùng `textContent`/DOM API cho văn bản và escape thuộc tính đúng ngữ cảnh; nếu cho phép rich text, sanitize theo danh sách cho phép. Test đầu vào chứa dấu nháy, ký tự HTML và payload thử an toàn trong môi trường cục bộ.

### RV-11 — Tạo tài khoản và tạo giỏ chưa có giao dịch bao ngoài

**Ưu tiên trung bình.** `AuthService.register` và `AdminUserService.createUser` lưu user rồi tạo giỏ ở lời gọi tiếp theo, chưa có `@Transactional` tại phương thức bao ngoài. Nếu bước tạo giỏ lỗi, có thể giữ tài khoản không có giỏ.

**Cần làm:** giao dịch phù hợp cho hai bước hoặc phương án bù rõ ràng; test lỗi ở bước tạo giỏ và đăng ký đồng thời email/username giống nhau.

### RV-12 — CORS không liệt kê PATCH của API khuyến mại

**Ưu tiên trung bình, ngoài phạm vi lõi.** Controller quản trị khuyến mại có `@PatchMapping`, trong khi cả `SecurityConfig` và `CorsConfig` chỉ liệt kê GET/POST/PUT/DELETE/OPTIONS. Nếu FE gọi PATCH từ origin khác sẽ cần kiểm tra preflight. Cấu hình CORS đang được định nghĩa ở hai nơi.

**Cần làm:** thống nhất một nguồn cấu hình; chỉ bổ sung method/origin được dùng và kiểm tra preflight. Không mở toàn bộ origin để che lỗi cấu hình.

### RV-13 — Xóa user/product cần chính sách dữ liệu liên quan

**Ưu tiên trung bình, ngoài phạm vi lõi.** `UserService.deleteAccount` và `ProductService.deleteProduct` xóa trực tiếp; schema có khóa ngoại từ giỏ/đơn và chưa có chính sách cascade/soft delete đầy đủ cho các luồng này. Cần chạy ca có đơn/giỏ trước khi kết luận hành vi xóa.

**Cần làm:** xác định chính sách giữ lịch sử, trả thông báo nghiệp vụ khi không được xóa; không thêm cascade xóa lịch sử đơn một cách tùy tiện.

### RV-14 — Các phần phụ cần chỉnh khi được đưa vào phạm vi

**Ưu tiên trung bình/thấp.** `AdminApi` có các khóa phương thức quản lý tin tức bị khai báo lặp; các khai báo sau trùng chức năng hiện ghi đè khai báo trước. API chi tiết tin tức đọc theo id chưa kiểm tra cờ published trong service. Bộ đếm lượt khuyến mại chưa có xử lý tranh chấp rõ ràng. Branding ShopDemo/ISmart chưa thống nhất. Các điểm này được giữ trong danh sách việc, chưa mở rộng phạm vi học phần tự động.

## 5. Gợi ý chia việc tiếp theo

| Nhóm việc | Thành viên trọng tâm | Kết quả cần có |
| --- | --- | --- |
| Chốt chênh lệch đặc tả và code | Hào, cả nhóm | Quyết định email/username, mô hình giỏ và phạm vi thực hành |
| Git, cấu hình và backend lõi | Thịnh | Baseline thật; Issue cho validation, tồn kho, đơn, quyền sở hữu |
| Tích hợp và giao diện sản phẩm/đơn | Tiến | Luồng hợp nhất có thể chạy; route chi tiết theo phạm vi đã chốt |
| Giao diện tài khoản, giỏ, checkout | Nam | Trường/bước theo đặc tả, thông báo lỗi và trạng thái gửi |
| Kiểm thử và minh chứng | Hiển | Dữ liệu mới, ca âm/biên/đồng thời, bằng chứng build/commit |

Đây là gợi ý để nhóm tạo Issue; chưa tạo task mới, gán tài khoản, đổi ước lượng hay chuyển trạng thái Notion. Không tạo lịch sử công việc giả để khớp lịch 01–25/10.

## 6. Cấu hình và nguồn tham khảo kỹ thuật

Cấu hình riêng được nạp qua `spring.config.import` và có thể nhận biến môi trường; cách này đối chiếu với [Spring Boot — Externalized Configuration](https://docs.spring.io/spring-boot/reference/features/external-config.html). Maven Wrapper của gói dùng `distributionType=only-script`; vì vậy giữ hai script và properties, không cần đưa Maven binary hay JAR wrapper vào repo, theo [Apache Maven Wrapper Distribution](https://maven.apache.org/tools/wrapper/maven-wrapper-distribution/).

Các phiên bản Spring Boot 4.1.1, Java 26 và Maven 3.9.16 được giữ nguyên từ dự án, không tự thay để làm mất dấu nguồn lỗi. Kết quả xác minh cụ thể được ghi tại VERIFICATION.md.
