const PageProductDetail = {
  async render(container, params) {
    container.innerHTML = `<div class="container page"><p>Đang tải...</p></div>`;

    try {
      const p = await ProductApi.getById(params.id);

      container.innerHTML = `
        <div class="container page">
          <div style="display:flex; gap:32px; flex-wrap:wrap;">
            <img src="${p.imageUrl || 'https://via.placeholder.com/400'}"
                 style="width:320px; border-radius:8px; background:#f1f5f9;">
            <div style="flex:1; min-width:260px;">
              <h1 class="page-title">${p.name}</h1>
              <p style="font-size:20px; color:var(--primary); font-weight:700; margin-bottom:12px;">
                ${ProductCard.formatPrice(p.price)}
              </p>
              <p style="color:var(--text-muted); margin-bottom:16px;">${p.description || "Chưa có mô tả."}</p>
              <p style="margin-bottom:16px;">Còn lại: <strong>${p.quantity}</strong> sản phẩm</p>
              <div id="msg"></div>
              <div class="form-group" style="max-width:120px;">
                <label>Số lượng</label>
                <input type="number" id="qty" value="1" min="1" max="${p.quantity}">
              </div>
              <button class="btn" id="addBtn" ${p.quantity === 0 ? "disabled" : ""}>
                ${p.quantity === 0 ? "Hết hàng" : "Thêm vào giỏ hàng"}
              </button>
            </div>
          </div>

          <h2 class="section-title">Sản phẩm liên quan</h2>
          <div id="relatedProducts" class="product-grid"><p>Đang tải...</p></div>
        </div>
      `;

      const addBtn = document.getElementById("addBtn");
      if (addBtn && p.quantity > 0) {
        addBtn.addEventListener("click", async () => {
          if (!AuthApi.isLoggedIn()) {
            window.location.hash = "#/login";
            return;
          }
          const qty = parseInt(document.getElementById("qty").value, 10) || 1;
          try {
            await CartApi.addToCart(p.id, qty);
            document.getElementById("msg").innerHTML =
              `<div class="alert alert-success">Đã thêm vào giỏ hàng!</div>`;
          } catch (err) {
            document.getElementById("msg").innerHTML =
              `<div class="alert alert-error">${err.message}</div>`;
          }
        });
      }

      this.loadRelated(p);

    } catch (err) {
      container.innerHTML = `<div class="container page"><div class="alert alert-error">${err.message}</div></div>`;
    }
  },

  async loadRelated(currentProduct) {
    const box = document.getElementById("relatedProducts");
    try {
      const all = await ProductApi.getAll();
      const others = all.filter(item => item.id !== currentProduct.id);

      // Ưu tiên sản phẩm cùng danh mục, nếu không đủ 4 thì lấy thêm sản phẩm khác
      const sameCategory = others.filter(item =>
        currentProduct.category && item.category === currentProduct.category
      );
      const rest = others.filter(item => !sameCategory.includes(item));
      const related = [...sameCategory, ...rest].slice(0, 4);

      box.innerHTML = related.length
        ? related.map(ProductCard.render).join("")
        : `<p class="empty-state">Chưa có sản phẩm liên quan.</p>`;

    } catch (err) {
      box.innerHTML = `<div class="alert alert-error">${err.message}</div>`;
    }
  }
};