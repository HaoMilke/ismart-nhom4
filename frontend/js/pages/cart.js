const PageCart = {
  async render(container) {
    container.innerHTML = `
      <div class="container page">
        <h1 class="page-title">Giỏ hàng của bạn</h1>
        <div id="cartBox"><p>Đang tải...</p></div>
      </div>
    `;
    await this.load();
  },

  async load() {
    const box = document.getElementById("cartBox");
    try {
      const cart = await CartApi.getCart();

      if (cart.items.length === 0) {
        box.innerHTML = `<p class="empty-state">Giỏ hàng đang trống. <a href="#/products" style="color:var(--primary); font-weight:600;">Mua sắm ngay</a></p>`;
        return;
      }

      box.innerHTML = `
        <div id="msg"></div>
        ${cart.items.map(item => `
          <div class="cart-item" data-id="${item.cartItemId}">
            <img src="${item.imageUrl || 'https://via.placeholder.com/64'}" alt="${item.productName}">
            <div class="info">
              <div style="font-weight:600;">${item.productName}</div>
              <div style="color:var(--text-muted); font-size:13px;">${ProductCard.formatPrice(item.price)} / sản phẩm</div>
            </div>
            <div class="qty-control">
              <input type="number" min="1" value="${item.quantity}" class="qtyInput" data-id="${item.cartItemId}">
              <button class="btn btn-sm btn-outline updateBtn" data-id="${item.cartItemId}">Cập nhật</button>
            </div>
            <div style="width:110px; text-align:right; font-weight:700;">${ProductCard.formatPrice(item.subtotal)}</div>
            <button class="btn btn-sm btn-danger removeBtn" data-id="${item.cartItemId}">Xóa</button>
          </div>
        `).join("")}
        <div class="cart-summary">
          <span>Tổng cộng</span>
          <span>${ProductCard.formatPrice(cart.totalAmount)}</span>
        </div>
        <div style="text-align:right; margin-top:16px;">
          <a href="#/checkout" class="btn">Tiến hành đặt hàng</a>
        </div>
      `;

      box.querySelectorAll(".updateBtn").forEach(btn => {
        btn.addEventListener("click", async () => {
          const id = btn.dataset.id;
          const qty = parseInt(box.querySelector(`.qtyInput[data-id="${id}"]`).value, 10);
          try {
            await CartApi.updateItem(id, qty);
            this.load();
          } catch (err) {
            document.getElementById("msg").innerHTML = `<div class="alert alert-error">${err.message}</div>`;
          }
        });
      });

      box.querySelectorAll(".removeBtn").forEach(btn => {
        btn.addEventListener("click", async () => {
          try {
            await CartApi.removeItem(btn.dataset.id);
            this.load();
          } catch (err) {
            document.getElementById("msg").innerHTML = `<div class="alert alert-error">${err.message}</div>`;
          }
        });
      });

    } catch (err) {
      box.innerHTML = `<div class="alert alert-error">${err.message}</div>`;
    }
  }
};
