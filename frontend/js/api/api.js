// Đổi lại URL này nếu Backend của bạn chạy ở địa chỉ khác
const API_BASE_URL = "http://localhost:8080/api";

const Api = {
  /**
   * Hàm gọi API dùng chung cho toàn bộ Frontend.
   * @param {string} path   - đường dẫn API, ví dụ "/products"
   * @param {string} method - GET | POST | PUT | DELETE
   * @param {object|null} body - dữ liệu gửi lên (sẽ tự JSON.stringify)
   * @param {boolean} auth  - true nếu cần gắn kèm token (mặc định true)
   */
  async request(path, method = "GET", body = null, auth = true) {
    const headers = { "Content-Type": "application/json" };

    if (auth) {
      const token = localStorage.getItem("token");
      if (token) headers["Authorization"] = "Bearer " + token;
    }

    const options = { method, headers };
    if (body !== null) options.body = JSON.stringify(body);

    const res = await fetch(API_BASE_URL + path, options);

    // Backend có thể trả JSON hoặc chuỗi thường (VD "Đăng ký thành công")
    const text = await res.text();
    let data = null;
    if (text) {
      try { data = JSON.parse(text); } catch (e) { data = text; }
    }

    if (!res.ok) {
      // GlobalExceptionHandler trả về { message, status } khi có lỗi
      const message = (data && data.message) ? data.message : "Đã có lỗi xảy ra, vui lòng thử lại.";
      throw new Error(message);
    }

    return data;
  }
};
