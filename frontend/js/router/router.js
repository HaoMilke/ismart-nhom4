const Router = {
  routes: [],

  // Đăng ký 1 route: pattern có thể chứa tham số động dạng ":id"
  register(pattern, handler, opts = {}) {
    this.routes.push({ pattern, handler, opts });
  },

  init() {
    window.addEventListener("hashchange", () => this.resolve());
    this.resolve();
  },

  // Parse query string (VD: "?keyword=dien+thoai") thành object { keyword: "..." }
  parseQuery(queryString) {
    const query = {};
    if (!queryString) return query;

    queryString.split("&").forEach(pair => {
      if (!pair) return;
      const eqIndex = pair.indexOf("=");
      const rawKey = eqIndex === -1 ? pair : pair.slice(0, eqIndex);
      const rawVal = eqIndex === -1 ? "" : pair.slice(eqIndex + 1);

      try {
        const key = decodeURIComponent(rawKey);
        const val = decodeURIComponent(rawVal || "");
        query[key] = val;
      } catch (e) {
        // Chuỗi encode không hợp lệ -> bỏ qua tham số này, không làm sập cả router
        console.warn("Bỏ qua query param lỗi encode:", pair);
      }
    });

    return query;
  },

  resolve() {
    const hash = window.location.hash.slice(1) || "/";
    const path = hash.split("?")[0];
    const segments = path.split("/").filter(Boolean);
    const query = this.parseQuery(hash.split("?")[1] || "");

    for (const route of this.routes) {
      const routeSegments = route.pattern.split("/").filter(Boolean);
      if (routeSegments.length !== segments.length) continue;

      const params = {};
      let matched = true;

      for (let i = 0; i < routeSegments.length; i++) {
        if (routeSegments[i].startsWith(":")) {
          try {
            params[routeSegments[i].slice(1)] = decodeURIComponent(segments[i]);
          } catch (e) {
            params[routeSegments[i].slice(1)] = segments[i]; // fallback nếu decode lỗi
          }
        } else if (routeSegments[i] !== segments[i]) {
          matched = false;
          break;
        }
      }

      if (matched) {
        // Bảo vệ route: chưa đăng nhập -> về trang login
        if (route.opts.requireAuth && !AuthApi.isLoggedIn()) {
          window.location.hash = "#/login";
          return;
        }
        // Bảo vệ route: không phải admin -> về trang chủ
        if (route.opts.requireAdmin && !AuthApi.isAdmin()) {
          window.location.hash = "#/";
          return;
        }

        const app = document.getElementById("app");
        app.innerHTML = "";
        route.handler(app, params, query);
        Header.render(); // render lại header mỗi lần chuyển trang (VD cập nhật trạng thái đăng nhập)
        window.scrollTo(0, 0);
        return;
      }
    }

    document.getElementById("app").innerHTML =
      `<div class="container page"><p class="empty-state">Không tìm thấy trang bạn yêu cầu.</p></div>`;
  }
};