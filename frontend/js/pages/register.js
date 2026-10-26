const PageRegister = {
  render(container) {
    container.innerHTML = `
      <div class="page container">
        <div class="form-box">
          <h2>Đăng ký tài khoản</h2>
          <div id="msg"></div>
          <form id="registerForm">
            <div class="form-group"><label>Username</label><input name="username" required></div>
            <div class="form-group"><label>Mật khẩu</label><input type="password" name="password" required></div>
            <div class="form-group"><label>Email</label><input type="email" name="email" required></div>
            <div class="form-group"><label>Họ tên</label><input name="fullName"></div>
            <div class="form-group"><label>Số điện thoại</label><input name="phone"></div>
            <div class="form-group"><label>Địa chỉ</label><input name="address"></div>
            <button class="btn" style="width:100%;" type="submit">Đăng ký</button>
          </form>
          <p class="switch-link">Đã có tài khoản? <a href="#/login">Đăng nhập</a></p>
        </div>
      </div>
    `;

    document.getElementById("registerForm").addEventListener("submit", async (e) => {
      e.preventDefault();
      const data = Object.fromEntries(new FormData(e.target));
      const msg = document.getElementById("msg");
      msg.innerHTML = "";

      try {
        await AuthApi.register(data);
        msg.innerHTML = `<div class="alert alert-success">Đăng ký thành công! Đang chuyển tới trang đăng nhập...</div>`;
        setTimeout(() => { window.location.hash = "#/login"; }, 1200);
      } catch (err) {
        msg.innerHTML = `<div class="alert alert-error">${err.message}</div>`;
      }
    });
  }
};
