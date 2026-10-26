const PageHome = {
  slideIndex: 0,
  slideTimer: null,
  banners: [],
  slides: [
    {
      title: "Giảm giá tới 50% mùa hè này",
      desc: "Săn ngay hàng ngàn sản phẩm công nghệ với giá cực sốc, chỉ trong tuần này.",
      gradient: "linear-gradient(135deg, #2563eb, #1e3a8a)"
    },
    {
      title: "Miễn phí vận chuyển toàn quốc",
      desc: "Áp dụng cho mọi đơn hàng từ 300.000đ, giao nhanh trong 24h.",
      gradient: "linear-gradient(135deg, #7c3aed, #4c1d95)"
    },
    {
      title: "Hàng mới về mỗi ngày",
      desc: "Cập nhật liên tục các sản phẩm hot nhất thị trường.",
      gradient: "linear-gradient(135deg, #059669, #064e3b)"
    }
  ],

  categories: [
    { emoji: "📱", name: "Điện thoại" },
    { emoji: "💻", name: "Laptop" },
    { emoji: "🎧", name: "Phụ kiện" },
    { emoji: "⌚", name: "Đồng hồ" },
    { emoji: "🖥️", name: "Màn hình" },
    { emoji: "🎮", name: "Gaming" }
  ],

  categoryLink(name) {
    return `#/products?category=${encodeURIComponent(name)}`;
  },

  async render(container) {
    container.innerHTML = `
      <div class="container page">

        <div id="heroSliderBox"><div class="hero-slider" style="display:flex;align-items:center;justify-content:center;background:#e2e8f0;"><p>Đang tải banner...</p></div></div>

        <h2 class="section-title" style="margin-top:0;">Danh mục nổi bật</h2>
        <div class="category-strip">
          ${this.categories.map(c => `
            <a href="${this.categoryLink(c.name)}" class="category-chip">
              <span class="emoji">${c.emoji}</span>${c.name}
            </a>
          `).join("")}
        </div>

        <div id="categorySections"><p>Đang tải sản phẩm...</p></div>

        <h2 class="section-title">Vì sao chọn ShopDemo?</h2>
        <div class="feature-grid">
          <div class="feature-card">
            <div class="emoji">🚚</div>
            <h3>Giao hàng nhanh</h3>
            <p>Nhận hàng trong 24h tại khu vực nội thành.</p>
          </div>
          <div class="feature-card">
            <div class="emoji">🔒</div>
            <h3>Thanh toán an toàn</h3>
            <p>Bảo mật thông tin với công nghệ mã hóa hiện đại.</p>
          </div>
          <div class="feature-card">
            <div class="emoji">↩️</div>
            <h3>Đổi trả dễ dàng</h3>
            <p>Hỗ trợ đổi trả trong vòng 7 ngày nếu có lỗi.</p>
          </div>
          <div class="feature-card">
            <div class="emoji">💬</div>
            <h3>Hỗ trợ 24/7</h3>
            <p>Đội ngũ tư vấn luôn sẵn sàng giải đáp thắc mắc.</p>
          </div>
        </div>

      </div>
    `;

    this.loadBanners();
    this.loadCategorySections();
  },

  async loadBanners() {
    const box = document.getElementById("heroSliderBox");
    try {
      this.banners = await BannerApi.getActive();

      if (this.banners.length === 0) {
        box.innerHTML = "";
        return;
      }

      box.innerHTML = `
        <div class="hero-slider" id="heroSlider">
          ${this.banners.map((b, i) => `
            <div class="hero-slide ${i === 0 ? "active" : ""}"
                 style="${b.imageUrl
                    ? `background-image:linear-gradient(rgba(0,0,0,0.35),rgba(0,0,0,0.35)), url('${b.imageUrl}'); background-size:cover; background-position:center;`
                    : `background:linear-gradient(135deg, ${b.gradientFrom}, ${b.gradientTo});`}">
              <div class="hero-text">
                <h2>${b.title}</h2>
                <p>${b.description || ""}</p>
                ${b.buttonText ? `<a href="${b.buttonLink || '#/products'}" class="btn">${b.buttonText}</a>` : ""}
              </div>
            </div>
          `).join("")}
          ${this.banners.length > 1 ? `
            <button class="hero-arrow prev" id="heroPrev">‹</button>
            <button class="hero-arrow next" id="heroNext">›</button>
            <div class="hero-dots" id="heroDots">
              ${this.banners.map((_, i) => `<button class="${i === 0 ? "active" : ""}" data-i="${i}"></button>`).join("")}
            </div>
          ` : ""}
        </div>
      `;

      if (this.banners.length > 1) this.initSlider();

    } catch (err) {
      box.innerHTML = `<div class="alert alert-error">${err.message}</div>`;
    }
  },

  async loadCategorySections() {
    const box = document.getElementById("categorySections");
    try {
      const products = await ProductApi.getAll();

      if (products.length === 0) {
        box.innerHTML = `<h2 class="section-title" style="margin-top:0;">Sản phẩm nổi bật</h2><p class="empty-state">Chưa có sản phẩm nào.</p>`;
        return;
      }

      // Gom sản phẩm theo đúng danh mục thực tế đang có trong dữ liệu
      const groups = {};
      products.forEach(p => {
        const cat = (p.category && p.category.trim()) || "Khác";
        if (!groups[cat]) groups[cat] = [];
        groups[cat].push(p);
      });

      box.innerHTML = Object.keys(groups).map(cat => `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-top:32px;">
          <h2 class="section-title" style="margin:0;">${cat}</h2>
          <a href="${this.categoryLink(cat)}" style="font-size:13px; color:var(--primary); font-weight:600;">Xem tất cả →</a>
        </div>
        <div class="product-row" data-cat="${cat}">
          ${groups[cat].map(ProductCard.render).join("")}
        </div>
      `).join("");

      // Gắn tính năng kéo chuột cho từng dải sản phẩm vừa render
      document.querySelectorAll(".product-row").forEach(row => DragScroll.attach(row));

    } catch (err) {
      box.innerHTML = `<div class="alert alert-error">${err.message}</div>`;
    }
  },

  initSlider() {
    const slidesEl = document.querySelectorAll("#heroSlider .hero-slide");
    const dotsEl = document.querySelectorAll("#heroDots button");

    const goTo = (i) => {
      slidesEl[this.slideIndex].classList.remove("active");
      dotsEl[this.slideIndex].classList.remove("active");
      this.slideIndex = (i + this.slides.length) % this.slides.length;
      slidesEl[this.slideIndex].classList.add("active");
      dotsEl[this.slideIndex].classList.add("active");
    };

    document.getElementById("heroPrev").addEventListener("click", () => {
      goTo(this.slideIndex - 1);
      this.resetTimer(goTo);
    });
    document.getElementById("heroNext").addEventListener("click", () => {
      goTo(this.slideIndex + 1);
      this.resetTimer(goTo);
    });
    dotsEl.forEach(dot => {
      dot.addEventListener("click", () => {
        goTo(parseInt(dot.dataset.i, 10));
        this.resetTimer(goTo);
      });
    });

    this.resetTimer(goTo);
  },

  resetTimer(goTo) {
    clearInterval(this.slideTimer);
    this.slideTimer = setInterval(() => goTo(this.slideIndex + 1), 4000);
  }
};