const Header = {
  categories: [
    { emoji: "📱", name: "Điện thoại" },
    { emoji: "💻", name: "Laptop" },
    { emoji: "🎧", name: "Phụ kiện" },
    { emoji: "⌚", name: "Đồng hồ" },
    { emoji: "🖥️", name: "Màn hình" },
    { emoji: "🎮", name: "Gaming" }
  ],

  render() {
    const el = document.getElementById("header");
    const user = AuthApi.getCurrentUser();
    const initial = user ? user.username.charAt(0).toUpperCase() : "";

    el.innerHTML = `
      <div class="site-header">
        <div class="container">
          <a href="#/" class="logo"><span class="logo-icon">🛍️</span>ShopDemo</a>

          <div class="header-search">
            <div class="search-input-wrap" style="display:flex;">
              <input type="text" id="headerSearchInput" placeholder="Tìm kiếm... (dien thoai, laptop, smart watch)"
                     style="border-radius:999px 0 0 999px; border-right:none; padding:9px 14px; border:1px solid var(--border); font-size:13px; width:100%;">
              <div class="search-suggestion-dropdown" id="headerSearchDropdown"></div>
            </div>
            <button type="button" id="headerSearchBtn"
                    style="border:1px solid var(--primary); background:var(--primary); color:#fff; padding:0 16px; border-radius:0 999px 999px 0; cursor:pointer; font-size:14px;">🔍</button>
          </div>

          <nav class="nav-links">
            <div class="nav-item-dropdown">
              <a href="#/products" class="nav-dropdown-trigger">Sản phẩm <span class="caret">▾</span></a>
              <div class="nav-dropdown-menu">
                ${this.categories.map(c => `
                  <a href="#/products?category=${encodeURIComponent(c.name)}">
                    <span class="emoji">${c.emoji}</span>${c.name}
                  </a>
                `).join("")}
                <hr>
                <a href="#/products" class="view-all-link">Xem tất cả sản phẩm →</a>
              </div>
            </div>

            <a href="#/news">Tin tức</a>

            ${user ? `
              <a href="#/cart" class="icon-link" title="Giỏ hàng">
                🛒<span id="cartBadge" class="cart-badge" style="display:none;">0</span>
              </a>

              <div class="user-menu">
                <div class="user-trigger" id="userTrigger">
                  <span class="avatar">${initial}</span>
                  <span>${user.username}</span>
                </div>
                <div class="user-dropdown" id="userDropdown">
                  <a href="#/profile">👤 Hồ sơ cá nhân</a>
                  <a href="#/orders">📦 Đơn hàng của tôi</a>
                  ${user.role === "ADMIN" ? `<a href="#/admin">⚙️ Trang quản trị</a>` : ""}
                  <hr>
                  <button id="logoutBtn" class="logout-item">🚪 Đăng xuất</button>
                </div>
              </div>
            ` : `
              <a href="#/login" class="btn-nav outline">Đăng nhập</a>
              <a href="#/register" class="btn-nav filled">Đăng ký</a>
            `}
          </nav>
        </div>
      </div>
    `;

    const headerInput = document.getElementById("headerSearchInput");
    const headerDropdown = document.getElementById("headerSearchDropdown");

    const goSearch = (keyword) => {
      window.location.hash = (keyword && keyword.trim())
        ? `#/products?keyword=${encodeURIComponent(keyword.trim())}`
        : "#/products";
    };

    SearchUtil.attachAutocomplete(headerInput, headerDropdown, {
      onSelect: (product) => { window.location.hash = `#/product/${product.id}`; },
      onSubmit: (keyword) => goSearch(keyword)
    });

    document.getElementById("headerSearchBtn").addEventListener("click", () => goSearch(headerInput.value));

    if (user) {
      CartApi.getCart().then(cart => {
        const badge = document.getElementById("cartBadge");
        const count = cart.items.reduce((sum, i) => sum + i.quantity, 0);
        if (count > 0) {
          badge.textContent = count > 99 ? "99+" : count;
          badge.style.display = "flex";
        }
      }).catch(() => {});

      const trigger = document.getElementById("userTrigger");
      const dropdown = document.getElementById("userDropdown");
      trigger.addEventListener("click", (e) => {
        e.stopPropagation();
        dropdown.classList.toggle("open");
      });
      document.addEventListener("click", () => dropdown.classList.remove("open"));

      document.getElementById("logoutBtn").addEventListener("click", () => {
        AuthApi.logout();
        window.location.hash = "#/";
        Header.render();
      });
    }
  }
};