const PageCheckout = {
  appliedPromo: null, // { code, discountAmount, finalAmount }

  async render(container) {
    container.innerHTML = `
      <div class="container page">
        <h1 class="page-title">Xác nhận đặt hàng</h1>
        <div id="checkoutBox"><p>Đang tải giỏ hàng...</p></div>
      </div>
    `;

    const box = document.getElementById("checkoutBox");

    try {
      this.cart = await CartApi.getCart();
      if (this.cart.items.length === 0) {
        box.innerHTML = `<p class="empty-state">Giỏ hàng đang trống, không thể đặt hàng.</p>`;
        return;
      }

      this.renderBox(box);
    } catch (err) {
      box.innerHTML = `<div class="alert alert-error">${err.message}</div>`;
    }
  },

  renderBox(box) {
    const cart = this.cart;

    box.innerHTML = `
      <div style="max-width:500px;">
        <div id="msg"></div>

        ${cart.items.map(i => `
          <div style="display:flex; justify-content:space-between; padding:8px 0; border-bottom:1px solid var(--border); font-size:14px;">
            <span>${i.productName} x${i.quantity}</span>
            <span>${ProductCard.formatPrice(i.subtotal)}</span>
          </div>
        `).join("")}

        <!-- ===== Ô nhập mã khuyến mại (Bootstrap 5) ===== -->
        <div class="input-group my-3">
          <input type="text" class="form-control" id="promoInput" placeholder="Nhập mã khuyến mại (nếu có)">
          <button class="btn btn-outline-primary" type="button" id="applyPromoBtn">Áp dụng</button>
        </div>
        <div id="promoResult" class="mb-3"></div>

        <div class="d-flex justify-content-between mb-1">
          <span>Tạm tính</span>
          <span>${ProductCard.formatPrice(cart.totalAmount)}</span>
        </div>
        <div class="d-flex justify-content-between mb-1" id="discountRow" style="display:none !important;">
          <span>Giảm giá</span>
          <span class="text-success" id="discountValue">-0đ</span>
        </div>
        <div class="cart-summary">
          <span>Tổng cộng</span>
          <span id="finalTotal">${ProductCard.formatPrice(cart.totalAmount)}</span>
        </div>

        <form id="checkoutForm" style="margin-top:20px;">
          <div class="form-group">
            <label>Địa chỉ giao hàng</label>
            <textarea name="shippingAddress" rows="3" required placeholder="Nhập địa chỉ nhận hàng..."></textarea>
          </div>
          <button class="btn" style="width:100%;" type="submit">Đặt hàng</button>
        </form>
      </div>
    `;

    document.getElementById("applyPromoBtn").addEventListener("click", () => this.applyPromo());

    document.getElementById("checkoutForm").addEventListener("submit", async (e) => {
      e.preventDefault();
      const shippingAddress = new FormData(e.target).get("shippingAddress");
      const msg = document.getElementById("msg");
      try {
        await OrderApi.createOrder(shippingAddress, this.appliedPromo ? this.appliedPromo.code : null);
        msg.innerHTML = `<div class="alert alert-success">Đặt hàng thành công! Đang chuyển tới lịch sử đơn hàng...</div>`;
        setTimeout(() => { window.location.hash = "#/orders"; }, 1200);
      } catch (err) {
        msg.innerHTML = `<div class="alert alert-error">${err.message}</div>`;
      }
    });
  },

  async applyPromo() {
    const code = document.getElementById("promoInput").value.trim();
    const resultBox = document.getElementById("promoResult");

    if (!code) {
      resultBox.innerHTML = `<div class="alert alert-warning py-2 mb-0">Vui lòng nhập mã khuyến mại.</div>`;
      return;
    }

    try {
      const res = await PromotionApi.check(code, this.cart.totalAmount);
      this.appliedPromo = res;

      resultBox.innerHTML = `
        <div class="alert alert-success py-2 mb-0 d-flex justify-content-between align-items-center">
          <span>🎉 Áp dụng mã <strong>${res.code}</strong> thành công!</span>
          <span class="badge bg-success">-${ProductCard.formatPrice(res.discountAmount)}</span>
        </div>
      `;

      document.getElementById("discountRow").style.setProperty("display", "flex", "important");
      document.getElementById("discountValue").textContent = "-" + ProductCard.formatPrice(res.discountAmount);
      document.getElementById("finalTotal").textContent = ProductCard.formatPrice(res.finalAmount);

    } catch (err) {
      this.appliedPromo = null;
      document.getElementById("discountRow").style.display = "none";
      document.getElementById("finalTotal").textContent = ProductCard.formatPrice(this.cart.totalAmount);
      resultBox.innerHTML = `<div class="alert alert-danger py-2 mb-0">${err.message}</div>`;
    }
  }
};