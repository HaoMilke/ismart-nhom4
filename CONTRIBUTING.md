# Quy trình làm việc của Nhóm 4

## Một nơi cập nhật cho mỗi loại thông tin

- Notion: yêu cầu, người phụ trách, reviewer, Sprint, trạng thái và giờ làm thực tế.
- GitHub: mã nguồn, Issue, lịch sử thay đổi, Pull Request và review.
- Excel: tổng hợp báo cáo; các cột MP tiếp tục là mô phỏng.

## Thực hiện một công việc

1. Nhận task đã phân công, đọc AC, đầu vào và phụ thuộc trên Notion.
2. Tạo Issue theo mẫu Công việc ISmart; ghi mã task/US và đường dẫn Notion. Dán URL Issue vào task.
3. Cập nhật nhánh chính bằng `git switch main` rồi `git pull --ff-only`.
4. Tạo nhánh, ví dụ `git switch -c chore/T-002-repository-setup`. Thay mã task theo việc thực sự làm.
5. Chỉ commit thay đổi có liên quan; kiểm tra `git diff` và `git diff --cached --check`.
6. Đẩy nhánh, tạo PR với cách kiểm tra, kết quả và reviewer. Gắn URL PR vào task và chuyển Code Review.
7. Sửa phản hồi; kiểm thử trên bản tích hợp. Ghi lỗi có dữ liệu tái hiện, build/commit, ca kiểm thử và minh chứng.
8. Hợp nhất khi đã được người khác review; cập nhật tiêu chí, minh chứng và Actual giờ trên Notion trước khi Done.

## Vai trò theo kế hoạch

| Thành viên | Trọng tâm |
| --- | --- |
| Bùi Huy Hào | PO/BA, phạm vi, đặc tả, tài liệu và nghiệm thu |
| Nguyễn Minh Tiến | Scrum Master, điều phối, tích hợp và giao diện sản phẩm |
| Nguyễn Hữu Thịnh | Kỹ thuật, Git, backend và dữ liệu |
| Bùi Thành Nam | Giao diện tài khoản, giỏ và đặt hàng |
| Nguyễn Ngọc Hiển | Kiểm thử, dữ liệu thử, RTM và bằng chứng |

Tên trong bảng là vai trò kế hoạch, không tự tạo tài khoản, lời mời hoặc gán GitHub username. Mỗi thành viên dùng tài khoản của mình để tạo lịch sử thật.

## Các quy tắc bắt buộc trong nhóm

- Không commit khóa JWT, mật khẩu, token, cấu hình máy riêng hoặc SQL xuất từ dữ liệu khách hàng.
- Dữ liệu mới đưa vào repo phải là dữ liệu giả lập đã kiểm tra; mẫu seed hiện tại không có tài khoản hay đơn hàng.
- Không tự đẩy thẳng thay đổi chức năng lên `main`; dùng PR và reviewer được phân công.
- Không tạo commit lùi ngày hoặc ghi công cho người chưa thực hiện.
- Không tự mở rộng SRS theo chức năng có sẵn trong gói tiếp nhận; đề nghị thay đổi phải được nhóm chốt và lưu quyết định.
- Các giới hạn trong `docs/REVIEW.md` là việc còn phải xử lý, không phải chức năng đã đạt.

Sau khi repository GitHub được xác định, chủ kho có thể bật quy tắc bảo vệ `main`, yêu cầu review và giới hạn force push. Tệp trong gói chỉ hướng dẫn quy trình; chưa thay đổi cài đặt GitHub.
