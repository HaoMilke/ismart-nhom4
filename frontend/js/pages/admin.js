const PageAdmin = {
  currentTab: "users",

  async render(container) {
    container.innerHTML = `
      <div class="container page">
        <h1 class="page-title">Trang quản trị</h1>
        <div class="tabs">
          <button id="tabUsers" class="active">Quản lý người dùng</button>
          <button id="tabProducts">Quản lý sản phẩm</button>
          <button id="tabNews">Quản lý tin tức</button>
          <button id="tabBanners">Quản lý banner</button>
          <button id="tabPromotions">Quản lý khuyến mại</button>
        </div>
        <div id="adminContent"></div>
      </div>
    `;

    document.getElementById("tabUsers").addEventListener("click", () => this.showUsers());
    document.getElementById("tabProducts").addEventListener("click", () => this.showProducts());
    document.getElementById("tabNews").addEventListener("click", () => this.showNews());
    document.getElementById("tabBanners").addEventListener("click", () => this.showBanners());
    document.getElementById("tabPromotions").addEventListener("click", () => this.showPromotions());
    this.showUsers();
  },

  setActiveTab(id) {
    document.getElementById("tabUsers").classList.toggle("active", id === "tabUsers");
    document.getElementById("tabProducts").classList.toggle("active", id === "tabProducts");
    document.getElementById("tabNews").classList.toggle("active", id === "tabNews");
    document.getElementById("tabBanners").classList.toggle("active", id === "tabBanners");
    document.getElementById("tabPromotions").classList.toggle("active", id === "tabPromotions");
  },

  // ===================== QUẢN LÝ NGƯỜI DÙNG =====================
  async showUsers() {
    this.setActiveTab("tabUsers");
    const content = document.getElementById("adminContent");
    content.innerHTML = `<p>Đang tải...</p>`;

    try {
      const users = await AdminApi.getAllUsers();

      content.innerHTML = `
        <div id="msg"></div>

        <h2 class="section-title" style="margin-top:0;">Thêm người dùng mới</h2>
        <form id="createUserForm" style="display:flex; gap:8px; flex-wrap:wrap; margin-bottom:20px;">
          <input name="username" placeholder="Username" required style="flex:1; min-width:120px; padding:8px; border:1px solid var(--border); border-radius:6px;">
          <input name="password" type="password" placeholder="Mật khẩu" required style="flex:1; min-width:120px; padding:8px; border:1px solid var(--border); border-radius:6px;">
          <input name="email" type="email" placeholder="Email" required style="flex:1; min-width:150px; padding:8px; border:1px solid var(--border); border-radius:6px;">
          <input name="fullName" placeholder="Họ tên" style="flex:1; min-width:120px; padding:8px; border:1px solid var(--border); border-radius:6px;">
          <select name="role" style="padding:8px; border:1px solid var(--border); border-radius:6px;">
            <option value="USER">USER</option>
            <option value="ADMIN">ADMIN</option>
          </select>
          <button class="btn" type="submit">Thêm</button>
        </form>

        <table class="data-table">
          <thead>
            <tr><th>ID</th><th>Username</th><th>Email</th><th>Họ tên</th><th>Role</th><th>Trạng thái</th><th>Hành động</th></tr>
          </thead>
          <tbody>
            ${users.map(u => `
              <tr>
                <td>${u.id}</td>
                <td>${u.username}</td>
                <td>${u.email}</td>
                <td>${u.fullName || ""}</td>
                <td>${u.role}</td>
                <td><span class="status-tag ${u.status}">${u.status}</span></td>
                <td>
                  ${u.status === "ACTIVE"
                    ? `<button class="btn btn-sm btn-danger blockBtn" data-id="${u.id}">Chặn</button>`
                    : `<button class="btn btn-sm btn-outline unblockBtn" data-id="${u.id}">Gỡ chặn</button>`}
                </td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      `;

      document.getElementById("createUserForm").addEventListener("submit", async (e) => {
        e.preventDefault();
        const data = Object.fromEntries(new FormData(e.target));
        try {
          await AdminApi.createUser(data);
          this.showUsers();
        } catch (err) {
          document.getElementById("msg").innerHTML = `<div class="alert alert-error">${err.message}</div>`;
        }
      });

      content.querySelectorAll(".blockBtn").forEach(btn => {
        btn.addEventListener("click", async () => {
          try { await AdminApi.blockUser(btn.dataset.id); this.showUsers(); }
          catch (err) { document.getElementById("msg").innerHTML = `<div class="alert alert-error">${err.message}</div>`; }
        });
      });

      content.querySelectorAll(".unblockBtn").forEach(btn => {
        btn.addEventListener("click", async () => {
          try { await AdminApi.unblockUser(btn.dataset.id); this.showUsers(); }
          catch (err) { document.getElementById("msg").innerHTML = `<div class="alert alert-error">${err.message}</div>`; }
        });
      });

    } catch (err) {
      content.innerHTML = `<div class="alert alert-error">${err.message}</div>`;
    }
  },

  // ===================== QUẢN LÝ SẢN PHẨM =====================
  async showProducts() {
    this.setActiveTab("tabProducts");
    const content = document.getElementById("adminContent");
    content.innerHTML = `<p>Đang tải...</p>`;

    try {
      const products = await ProductApi.getAll();
      content.innerHTML = this.renderProductsView(products);
      this.attachProductEvents();
    } catch (err) {
      content.innerHTML = `<div class="alert alert-error">${err.message}</div>`;
    }
  },

  renderProductsView(products, editingProduct = null) {
    return `
      <div id="msg"></div>

      <h2 class="section-title" style="margin-top:0;">${editingProduct ? "Cập nhật sản phẩm" : "Thêm sản phẩm mới"}</h2>
      <form id="productForm" style="display:flex; gap:8px; flex-wrap:wrap; margin-bottom:20px;">
        <input type="hidden" name="id" value="${editingProduct ? editingProduct.id : ""}">
        <input name="name" placeholder="Tên sản phẩm" required value="${editingProduct ? editingProduct.name : ""}"
               style="flex:2; min-width:150px; padding:8px; border:1px solid var(--border); border-radius:6px;">
        <input name="price" type="number" step="0.01" placeholder="Giá" required value="${editingProduct ? editingProduct.price : ""}"
               style="flex:1; min-width:100px; padding:8px; border:1px solid var(--border); border-radius:6px;">
        <input name="quantity" type="number" placeholder="Tồn kho" required value="${editingProduct ? editingProduct.quantity : ""}"
               style="flex:1; min-width:100px; padding:8px; border:1px solid var(--border); border-radius:6px;">
        <input name="imageUrl" placeholder="URL ảnh" value="${editingProduct ? (editingProduct.imageUrl || "") : ""}"
               style="flex:2; min-width:150px; padding:8px; border:1px solid var(--border); border-radius:6px;">
        <input name="category" placeholder="Danh mục" value="${editingProduct ? (editingProduct.category || "") : ""}"
               style="flex:1; min-width:100px; padding:8px; border:1px solid var(--border); border-radius:6px;">
        <input name="description" placeholder="Mô tả" value="${editingProduct ? (editingProduct.description || "") : ""}"
               style="flex:3; min-width:200px; padding:8px; border:1px solid var(--border); border-radius:6px;">
        <button class="btn" type="submit">${editingProduct ? "Lưu thay đổi" : "Thêm"}</button>
        ${editingProduct ? `<button class="btn btn-outline" type="button" id="cancelEditProductBtn">Hủy</button>` : ""}
      </form>

      <table class="data-table">
        <thead>
          <tr><th>ID</th><th>Tên</th><th>Giá</th><th>Tồn kho</th><th>Danh mục</th><th>Hành động</th></tr>
        </thead>
        <tbody>
          ${products.map(p => `
            <tr>
              <td>${p.id}</td>
              <td>${p.name}</td>
              <td>${ProductCard.formatPrice(p.price)}</td>
              <td>${p.quantity}</td>
              <td>${p.category || ""}</td>
              <td>
                <button class="btn btn-sm btn-outline editProductBtn" data-id="${p.id}">Sửa</button>
                <button class="btn btn-sm btn-danger deleteProductBtn" data-id="${p.id}">Xóa</button>
              </td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    `;
  },

  attachProductEvents() {
    const content = document.getElementById("adminContent");
    const msg = document.getElementById("msg");

    document.getElementById("productForm").addEventListener("submit", async (e) => {
      e.preventDefault();
      const formData = new FormData(e.target);
      const id = formData.get("id");
      const data = {
        name: formData.get("name"),
        price: parseFloat(formData.get("price")),
        quantity: parseInt(formData.get("quantity"), 10),
        imageUrl: formData.get("imageUrl"),
        category: formData.get("category"),
        description: formData.get("description")
      };

      try {
        if (id) {
          await AdminApi.updateProduct(id, data);
        } else {
          await AdminApi.createProduct(data);
        }
        this.showProducts();
      } catch (err) {
        msg.innerHTML = `<div class="alert alert-error">${err.message}</div>`;
      }
    });

    const cancelBtn = document.getElementById("cancelEditProductBtn");
    if (cancelBtn) cancelBtn.addEventListener("click", () => this.showProducts());

    content.querySelectorAll(".editProductBtn").forEach(btn => {
      btn.addEventListener("click", async () => {
        try {
          const product = await ProductApi.getById(btn.dataset.id);
          const allProducts = await ProductApi.getAll();
          content.innerHTML = this.renderProductsView(allProducts, product);
          this.attachProductEvents();
          window.scrollTo(0, 0);
        } catch (err) {
          msg.innerHTML = `<div class="alert alert-error">${err.message}</div>`;
        }
      });
    });

    content.querySelectorAll(".deleteProductBtn").forEach(btn => {
      btn.addEventListener("click", async () => {
        if (!confirm("Xóa sản phẩm này?")) return;
        try { await AdminApi.deleteProduct(btn.dataset.id); this.showProducts(); }
        catch (err) { msg.innerHTML = `<div class="alert alert-error">${err.message}</div>`; }
      });
    });
  },

  // ===================== QUẢN LÝ TIN TỨC =====================
  async showNews() {
    this.setActiveTab("tabNews");
    const content = document.getElementById("adminContent");
    content.innerHTML = `<p>Đang tải...</p>`;

    try {
      const newsList = await AdminApi.getAllNews();
      content.innerHTML = this.renderNewsView(newsList);
      this.attachNewsEvents();
    } catch (err) {
      content.innerHTML = `<div class="alert alert-error">${err.message}</div>`;
    }
  },

  renderNewsView(newsList, editingId = null) {
    return `
      <div id="msg"></div>

      <h2 class="section-title" style="margin-top:0;">${editingId ? "Cập nhật bài viết" : "Thêm bài viết mới"}</h2>
      <form id="newsForm" style="display:flex; gap:8px; flex-wrap:wrap; margin-bottom:20px;">
        <input type="hidden" name="id" value="${editingId || ""}">
        <input name="title" placeholder="Tiêu đề" required style="flex:2; min-width:200px; padding:8px; border:1px solid var(--border); border-radius:6px;">
        <input name="category" placeholder="Danh mục (VD: Khuyến mãi)" style="flex:1; min-width:150px; padding:8px; border:1px solid var(--border); border-radius:6px;">
        <input name="author" placeholder="Tác giả" style="flex:1; min-width:120px; padding:8px; border:1px solid var(--border); border-radius:6px;">
        <input name="imageUrl" placeholder="URL ảnh" style="flex:2; min-width:150px; padding:8px; border:1px solid var(--border); border-radius:6px;">
        <input name="summary" placeholder="Mô tả ngắn" style="flex:3; min-width:200px; padding:8px; border:1px solid var(--border); border-radius:6px;">
        <textarea name="content" placeholder="Nội dung đầy đủ" required rows="4" style="flex:1 0 100%; padding:8px; border:1px solid var(--border); border-radius:6px;"></textarea>
        <label style="display:flex; align-items:center; gap:6px; font-size:13px;">
          <input type="checkbox" name="published" checked> Đăng ngay
        </label>
        <button class="btn" type="submit">${editingId ? "Lưu thay đổi" : "Thêm bài viết"}</button>
        ${editingId ? `<button class="btn btn-outline" type="button" id="cancelEditBtn">Hủy</button>` : ""}
      </form>

      <table class="data-table">
        <thead>
          <tr><th>ID</th><th>Tiêu đề</th><th>Danh mục</th><th>Tác giả</th><th>Trạng thái</th><th>Hành động</th></tr>
        </thead>
        <tbody>
          ${newsList.map(n => `
            <tr>
              <td>${n.id}</td>
              <td>${n.title}</td>
              <td>${n.category || ""}</td>
              <td>${n.author || ""}</td>
              <td><span class="status-tag ${n.published ? "ACTIVE" : "BLOCKED"}">${n.published ? "Đã đăng" : "Đã ẩn"}</span></td>
              <td>
                <button class="btn btn-sm btn-outline editNewsBtn" data-id="${n.id}">Sửa</button>
                <button class="btn btn-sm btn-danger deleteNewsBtn" data-id="${n.id}">Xóa</button>
              </td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    `;
  },

  async attachNewsEvents(editingNews = null) {
    const content = document.getElementById("adminContent");
    const msg = document.getElementById("msg");

    if (editingNews) {
      const form = document.getElementById("newsForm");
      form.title.value = editingNews.title || "";
      form.category.value = editingNews.category || "";
      form.author.value = editingNews.author || "";
      form.imageUrl.value = editingNews.imageUrl || "";
      form.summary.value = editingNews.summary || "";
      form.content.value = editingNews.content || "";
      form.published.checked = !!editingNews.published;

      document.getElementById("cancelEditBtn").addEventListener("click", () => this.showNews());
    }

    document.getElementById("newsForm").addEventListener("submit", async (e) => {
      e.preventDefault();
      const formData = new FormData(e.target);
      const id = formData.get("id");
      const data = {
        title: formData.get("title"),
        category: formData.get("category"),
        author: formData.get("author"),
        imageUrl: formData.get("imageUrl"),
        summary: formData.get("summary"),
        content: formData.get("content"),
        published: formData.get("published") === "on"
      };

      try {
        if (id) {
          await AdminApi.updateNews(id, data);
        } else {
          await AdminApi.createNews(data);
        }
        this.showNews();
      } catch (err) {
        msg.innerHTML = `<div class="alert alert-error">${err.message}</div>`;
      }
    });

    content.querySelectorAll(".editNewsBtn").forEach(btn => {
      btn.addEventListener("click", async () => {
        try {
          const newsList = await AdminApi.getAllNews();
          const target = newsList.find(n => String(n.id) === btn.dataset.id);
          content.innerHTML = this.renderNewsView(newsList, target.id);
          this.attachNewsEvents(target);
          window.scrollTo(0, 0);
        } catch (err) {
          msg.innerHTML = `<div class="alert alert-error">${err.message}</div>`;
        }
      });
    });

    content.querySelectorAll(".deleteNewsBtn").forEach(btn => {
      btn.addEventListener("click", async () => {
        if (!confirm("Xóa bài viết này?")) return;
        try { await AdminApi.deleteNews(btn.dataset.id); this.showNews(); }
        catch (err) { msg.innerHTML = `<div class="alert alert-error">${err.message}</div>`; }
      });
    });
  },

  // ===================== QUẢN LÝ BANNER =====================
  async showBanners() {
    this.setActiveTab("tabBanners");
    const content = document.getElementById("adminContent");
    content.innerHTML = `<p>Đang tải...</p>`;

    try {
      const banners = await AdminApi.getAllBanners();
      content.innerHTML = this.renderBannersView(banners);
      this.attachBannerEvents();
    } catch (err) {
      content.innerHTML = `<div class="alert alert-error">${err.message}</div>`;
    }
  },

  renderBannersView(banners, editingId = null) {
    const editing = editingId ? banners.find(b => b.id === editingId) : null;
    return `
      <div id="msg"></div>

      <h2 class="section-title" style="margin-top:0;">${editing ? "Cập nhật banner" : "Thêm banner mới"}</h2>
      <form id="bannerForm" style="display:flex; gap:8px; flex-wrap:wrap; margin-bottom:20px;">
        <input type="hidden" name="id" value="${editing ? editing.id : ""}">
        <input name="title" placeholder="Tiêu đề" required value="${editing ? editing.title : ""}"
               style="flex:2; min-width:200px; padding:8px; border:1px solid var(--border); border-radius:6px;">
        <input name="description" placeholder="Mô tả ngắn" value="${editing ? (editing.description || "") : ""}"
               style="flex:3; min-width:200px; padding:8px; border:1px solid var(--border); border-radius:6px;">
        <input name="buttonText" placeholder="Chữ nút bấm (VD: Mua ngay)" value="${editing ? (editing.buttonText || "") : ""}"
               style="flex:1; min-width:150px; padding:8px; border:1px solid var(--border); border-radius:6px;">
        <input name="buttonLink" placeholder="Link nút bấm (VD: #/products)" value="${editing ? (editing.buttonLink || "") : ""}"
               style="flex:1; min-width:150px; padding:8px; border:1px solid var(--border); border-radius:6px;">
        <input name="imageUrl" placeholder="URL ảnh nền (bỏ trống để dùng màu gradient)" value="${editing ? (editing.imageUrl || "") : ""}"
               style="flex:1 0 100%; padding:8px; border:1px solid var(--border); border-radius:6px;">
        <div style="display:flex; align-items:center; gap:6px;">
          <label style="font-size:12px;">Màu 1</label>
          <input name="gradientFrom" type="color" value="${editing ? editing.gradientFrom : "#2563eb"}" style="width:40px; height:34px; padding:2px; border:1px solid var(--border); border-radius:6px;">
          <label style="font-size:12px;">Màu 2</label>
          <input name="gradientTo" type="color" value="${editing ? editing.gradientTo : "#1e3a8a"}" style="width:40px; height:34px; padding:2px; border:1px solid var(--border); border-radius:6px;">
        </div>
        <input name="displayOrder" type="number" placeholder="Thứ tự" value="${editing ? editing.displayOrder : "0"}"
               style="width:90px; padding:8px; border:1px solid var(--border); border-radius:6px;">
        <label style="display:flex; align-items:center; gap:6px; font-size:13px;">
          <input type="checkbox" name="active" ${!editing || editing.active ? "checked" : ""}> Hiển thị
        </label>
        <button class="btn" type="submit">${editing ? "Lưu thay đổi" : "Thêm banner"}</button>
        ${editing ? `<button class="btn btn-outline" type="button" id="cancelEditBannerBtn">Hủy</button>` : ""}
      </form>

      <table class="data-table">
        <thead>
          <tr><th>Thứ tự</th><th>Tiêu đề</th><th>Xem trước</th><th>Trạng thái</th><th>Hành động</th></tr>
        </thead>
        <tbody>
          ${banners.map(b => `
            <tr>
              <td>${b.displayOrder}</td>
              <td>${b.title}</td>
              <td>
                <div style="width:90px; height:36px; border-radius:6px; ${b.imageUrl
                  ? `background-image:url('${b.imageUrl}'); background-size:cover; background-position:center;`
                  : `background:linear-gradient(135deg, ${b.gradientFrom}, ${b.gradientTo});`}"></div>
              </td>
              <td><span class="status-tag ${b.active ? "ACTIVE" : "BLOCKED"}">${b.active ? "Đang hiện" : "Đã ẩn"}</span></td>
              <td>
                <button class="btn btn-sm btn-outline editBannerBtn" data-id="${b.id}">Sửa</button>
                <button class="btn btn-sm btn-danger deleteBannerBtn" data-id="${b.id}">Xóa</button>
              </td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    `;
  },

  attachBannerEvents() {
    const content = document.getElementById("adminContent");
    const msg = document.getElementById("msg");

    document.getElementById("bannerForm").addEventListener("submit", async (e) => {
      e.preventDefault();
      const formData = new FormData(e.target);
      const id = formData.get("id");
      const data = {
        title: formData.get("title"),
        description: formData.get("description"),
        buttonText: formData.get("buttonText"),
        buttonLink: formData.get("buttonLink"),
        imageUrl: formData.get("imageUrl"),
        gradientFrom: formData.get("gradientFrom"),
        gradientTo: formData.get("gradientTo"),
        displayOrder: parseInt(formData.get("displayOrder"), 10) || 0,
        active: formData.get("active") === "on"
      };

      try {
        if (id) {
          await AdminApi.updateBanner(id, data);
        } else {
          await AdminApi.createBanner(data);
        }
        this.showBanners();
      } catch (err) {
        msg.innerHTML = `<div class="alert alert-error">${err.message}</div>`;
      }
    });

    const cancelBtn = document.getElementById("cancelEditBannerBtn");
    if (cancelBtn) cancelBtn.addEventListener("click", () => this.showBanners());

    content.querySelectorAll(".editBannerBtn").forEach(btn => {
      btn.addEventListener("click", async () => {
        try {
          const banners = await AdminApi.getAllBanners();
          content.innerHTML = this.renderBannersView(banners, parseInt(btn.dataset.id, 10));
          this.attachBannerEvents();
          window.scrollTo(0, 0);
        } catch (err) {
          msg.innerHTML = `<div class="alert alert-error">${err.message}</div>`;
        }
      });
    });

    content.querySelectorAll(".deleteBannerBtn").forEach(btn => {
      btn.addEventListener("click", async () => {
        if (!confirm("Xóa banner này?")) return;
        try { await AdminApi.deleteBanner(btn.dataset.id); this.showBanners(); }
        catch (err) { msg.innerHTML = `<div class="alert alert-error">${err.message}</div>`; }
      });
    });
  },

  // ===================== QUẢN LÝ KHUYẾN MẠI =====================
  async showPromotions() {
    this.setActiveTab("tabPromotions");
    const content = document.getElementById("adminContent");
    content.innerHTML = `<p>Đang tải...</p>`;

    try {
      const promotions = await AdminApi.getAllPromotions();
      content.innerHTML = this.renderPromotionsView(promotions);
      this.attachPromotionEvents();
    } catch (err) {
      content.innerHTML = `<div class="alert alert-error">${err.message}</div>`;
    }
  },

  // Cắt chuỗi ISO "2026-09-16T10:00:00" về đúng định dạng input datetime-local "2026-09-16T10:00"
  toDatetimeLocalValue(isoString) {
    return isoString ? isoString.slice(0, 16) : "";
  },

  renderPromotionsView(promotions, editingId = null) {
    const editing = editingId ? promotions.find(p => p.id === editingId) : null;
    return `
      <div id="msg"></div>

      <h2 class="section-title" style="margin-top:0;">${editing ? "Cập nhật mã khuyến mại" : "Thêm mã khuyến mại mới"}</h2>
      <form id="promotionForm" style="display:flex; gap:8px; flex-wrap:wrap; margin-bottom:20px;">
        <input type="hidden" name="id" value="${editing ? editing.id : ""}">
        <input name="code" placeholder="Mã (VD: SALE50)" required value="${editing ? editing.code : ""}"
               style="flex:1; min-width:140px; padding:8px; border:1px solid var(--border); border-radius:6px; text-transform:uppercase;">
        <input name="description" placeholder="Mô tả" value="${editing ? (editing.description || "") : ""}"
               style="flex:2; min-width:180px; padding:8px; border:1px solid var(--border); border-radius:6px;">
        <select name="discountType" style="padding:8px; border:1px solid var(--border); border-radius:6px;">
          <option value="PERCENT" ${editing && editing.discountType === "PERCENT" ? "selected" : ""}>Giảm theo %</option>
          <option value="FIXED" ${editing && editing.discountType === "FIXED" ? "selected" : ""}>Giảm số tiền cố định</option>
        </select>
        <input name="discountValue" type="number" step="0.01" placeholder="Giá trị giảm" required value="${editing ? editing.discountValue : ""}"
               style="flex:1; min-width:120px; padding:8px; border:1px solid var(--border); border-radius:6px;">
        <input name="maxDiscountAmount" type="number" step="0.01" placeholder="Giảm tối đa (nếu %)" value="${editing && editing.maxDiscountAmount != null ? editing.maxDiscountAmount : ""}"
               style="flex:1; min-width:150px; padding:8px; border:1px solid var(--border); border-radius:6px;">
        <input name="minOrderAmount" type="number" step="0.01" placeholder="Đơn tối thiểu" value="${editing ? editing.minOrderAmount : "0"}"
               style="flex:1; min-width:130px; padding:8px; border:1px solid var(--border); border-radius:6px;">
        <input name="usageLimit" type="number" placeholder="Giới hạn lượt dùng" value="${editing && editing.usageLimit != null ? editing.usageLimit : ""}"
               style="flex:1; min-width:150px; padding:8px; border:1px solid var(--border); border-radius:6px;">
        <div style="display:flex; align-items:center; gap:6px;">
          <label style="font-size:12px;">Bắt đầu</label>
          <input name="startDate" type="datetime-local" value="${editing ? this.toDatetimeLocalValue(editing.startDate) : ""}"
                 style="padding:8px; border:1px solid var(--border); border-radius:6px;">
        </div>
        <div style="display:flex; align-items:center; gap:6px;">
          <label style="font-size:12px;">Kết thúc</label>
          <input name="endDate" type="datetime-local" value="${editing ? this.toDatetimeLocalValue(editing.endDate) : ""}"
                 style="padding:8px; border:1px solid var(--border); border-radius:6px;">
        </div>
        <label style="display:flex; align-items:center; gap:6px; font-size:13px;">
          <input type="checkbox" name="active" ${!editing || editing.active ? "checked" : ""}> Kích hoạt
        </label>
        <button class="btn" type="submit">${editing ? "Lưu thay đổi" : "Thêm mã"}</button>
        ${editing ? `<button class="btn btn-outline" type="button" id="cancelEditPromotionBtn">Hủy</button>` : ""}
      </form>

      <table class="data-table">
        <thead>
          <tr><th>Mã</th><th>Mô tả</th><th>Loại</th><th>Giá trị</th><th>Đã dùng</th><th>Hạn dùng</th><th>Trạng thái</th><th>Hành động</th></tr>
        </thead>
        <tbody>
          ${promotions.map(p => `
            <tr>
              <td><strong>${p.code}</strong></td>
              <td>${p.description || ""}</td>
              <td>${p.discountType === "PERCENT" ? "Phần trăm" : "Cố định"}</td>
              <td>${p.discountType === "PERCENT" ? p.discountValue + "%" : ProductCard.formatPrice(p.discountValue)}</td>
              <td>${p.usedCount}${p.usageLimit != null ? "/" + p.usageLimit : ""}</td>
              <td>${p.endDate ? new Date(p.endDate).toLocaleDateString("vi-VN") : "Không giới hạn"}</td>
              <td><span class="status-tag ${p.active ? "ACTIVE" : "BLOCKED"}">${p.active ? "Đang bật" : "Đã tắt"}</span></td>
              <td>
                <button class="btn btn-sm btn-outline editPromotionBtn" data-id="${p.id}">Sửa</button>
                <button class="btn btn-sm btn-danger deletePromotionBtn" data-id="${p.id}">Xóa</button>
              </td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    `;
  },

  attachPromotionEvents() {
    const content = document.getElementById("adminContent");
    const msg = document.getElementById("msg");

    document.getElementById("promotionForm").addEventListener("submit", async (e) => {
      e.preventDefault();
      const formData = new FormData(e.target);
      const id = formData.get("id");
      const data = {
        code: formData.get("code").toUpperCase(),
        description: formData.get("description"),
        discountType: formData.get("discountType"),
        discountValue: parseFloat(formData.get("discountValue")),
        maxDiscountAmount: formData.get("maxDiscountAmount") ? parseFloat(formData.get("maxDiscountAmount")) : null,
        minOrderAmount: formData.get("minOrderAmount") ? parseFloat(formData.get("minOrderAmount")) : 0,
        usageLimit: formData.get("usageLimit") ? parseInt(formData.get("usageLimit"), 10) : null,
        startDate: formData.get("startDate") || null,
        endDate: formData.get("endDate") || null,
        active: formData.get("active") === "on"
      };

      try {
        if (id) {
          await AdminApi.updatePromotion(id, data);
        } else {
          await AdminApi.createPromotion(data);
        }
        this.showPromotions();
      } catch (err) {
        msg.innerHTML = `<div class="alert alert-error">${err.message}</div>`;
      }
    });

    const cancelBtn = document.getElementById("cancelEditPromotionBtn");
    if (cancelBtn) cancelBtn.addEventListener("click", () => this.showPromotions());

    content.querySelectorAll(".editPromotionBtn").forEach(btn => {
      btn.addEventListener("click", async () => {
        try {
          const promotions = await AdminApi.getAllPromotions();
          content.innerHTML = this.renderPromotionsView(promotions, parseInt(btn.dataset.id, 10));
          this.attachPromotionEvents();
          window.scrollTo(0, 0);
        } catch (err) {
          msg.innerHTML = `<div class="alert alert-error">${err.message}</div>`;
        }
      });
    });

    content.querySelectorAll(".deletePromotionBtn").forEach(btn => {
      btn.addEventListener("click", async () => {
        if (!confirm("Xóa mã khuyến mại này?")) return;
        try { await AdminApi.deletePromotion(btn.dataset.id); this.showPromotions(); }
        catch (err) { msg.innerHTML = `<div class="alert alert-error">${err.message}</div>`; }
      });
    });
  }
};