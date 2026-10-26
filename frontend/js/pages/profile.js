const PageProfile = {
  async render(container) {
    container.innerHTML = `<div class="container page"><p>Đang tải...</p></div>`;

    try {
      const user = await UserApi.getProfile();

      container.innerHTML = `
        <div class="container page">
          <h1 class="page-title">Thông tin cá nhân</h1>

          <div style="display:flex; gap:24px; flex-wrap:wrap;">
            <div class="form-box" style="flex:1; min-width:300px;">
              <h2>Cập nhật hồ sơ</h2>
              <div id="profileMsg"></div>
              <form id="profileForm">
                <div class="form-group"><label>Username</label><input value="${user.username}" disabled></div>
                <div class="form-group"><label>Email</label><input value="${user.email}" disabled></div>
                <div class="form-group"><label>Họ tên</label><input name="fullName" value="${user.fullName || ""}"></div>
                <div class="form-group"><label>Số điện thoại</label><input name="phone" value="${user.phone || ""}"></div>
                <div class="form-group"><label>Địa chỉ</label><input name="address" value="${user.address || ""}"></div>
                <button class="btn" type="submit">Lưu thay đổi</button>
              </form>
            </div>

            <div class="form-box" style="flex:1; min-width:300px;">
              <h2>Đổi mật khẩu</h2>
              <div id="passwordMsg"></div>
              <form id="passwordForm">
                <div class="form-group"><label>Mật khẩu cũ</label><input type="password" name="oldPassword" required></div>
                <div class="form-group"><label>Mật khẩu mới</label><input type="password" name="newPassword" required></div>
                <button class="btn" type="submit">Đổi mật khẩu</button>
              </form>

              <h2 style="margin-top:28px; color:var(--danger);">Vùng nguy hiểm</h2>
              <p style="font-size:13px; color:var(--text-muted); margin-bottom:10px;">
                Xóa tài khoản sẽ không thể hoàn tác.
              </p>
              <button class="btn btn-danger" id="deleteAccountBtn">Xóa tài khoản</button>
            </div>
          </div>
        </div>
      `;

      document.getElementById("profileForm").addEventListener("submit", async (e) => {
        e.preventDefault();
        const data = Object.fromEntries(new FormData(e.target));
        const msg = document.getElementById("profileMsg");
        try {
          await UserApi.updateProfile(data);
          msg.innerHTML = `<div class="alert alert-success">Cập nhật thành công!</div>`;
        } catch (err) {
          msg.innerHTML = `<div class="alert alert-error">${err.message}</div>`;
        }
      });

      document.getElementById("passwordForm").addEventListener("submit", async (e) => {
        e.preventDefault();
        const data = Object.fromEntries(new FormData(e.target));
        const msg = document.getElementById("passwordMsg");
        try {
          await UserApi.changePassword(data);
          msg.innerHTML = `<div class="alert alert-success">Đổi mật khẩu thành công!</div>`;
          e.target.reset();
        } catch (err) {
          msg.innerHTML = `<div class="alert alert-error">${err.message}</div>`;
        }
      });

      document.getElementById("deleteAccountBtn").addEventListener("click", async () => {
        if (!confirm("Bạn chắc chắn muốn xóa tài khoản? Hành động này không thể hoàn tác.")) return;
        try {
          await UserApi.deleteAccount();
          AuthApi.logout();
          window.location.hash = "#/";
          Header.render();
        } catch (err) {
          document.getElementById("passwordMsg").innerHTML = `<div class="alert alert-error">${err.message}</div>`;
        }
      });

    } catch (err) {
      container.innerHTML = `<div class="container page"><div class="alert alert-error">${err.message}</div></div>`;
    }
  }
};
