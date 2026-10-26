const PageLogin = {
  render(container) {
    container.innerHTML = `
      <div class="page container">
        <div class="form-box">
          <h2>Đăng nhập</h2>
          <div id="msg"></div>
          <form id="loginForm">
            <div class="form-group">
              <label>Username</label>
              <input name="username" required>
            </div>
            <div class="form-group">
              <label>Mật khẩu</label>
              <input type="password" name="password" required>
            </div>
            <button class="btn" style="width:100%;" type="submit">Đăng nhập</button>
          </form>
          <p class="switch-link">Chưa có tài khoản? <a href="#/register">Đăng ký ngay</a></p>
        </div>
      </div>
    `;

    document.getElementById("loginForm").addEventListener("submit", async (e) => {
      e.preventDefault();
      const data = Object.fromEntries(new FormData(e.target));
      const msg = document.getElementById("msg");
      msg.innerHTML = "";

      try {
        await AuthApi.login(data);
        window.location.hash = "#/";
        Header.render();
      } catch (err) {
        msg.innerHTML = `<div class="alert alert-error">${err.message}</div>`;
      }
    });
  }
};
