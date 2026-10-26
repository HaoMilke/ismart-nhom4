const PageOrders = {
  async render(container) {
    container.innerHTML = `
      <div class="container page">
        <h1 class="page-title">Lịch sử đơn hàng</h1>
        <div id="ordersBox"><p>Đang tải...</p></div>
      </div>
    `;

    const box = document.getElementById("ordersBox");
    const statusLabel = {
      PENDING: "Chờ xử lý", CONFIRMED: "Đã xác nhận", SHIPPING: "Đang giao",
      COMPLETED: "Hoàn thành", CANCELLED: "Đã hủy"
    };

    try {
      const orders = await OrderApi.getOrders();

      if (orders.length === 0) {
        box.innerHTML = `<p class="empty-state">Bạn chưa có đơn hàng nào.</p>`;
        return;
      }

      box.innerHTML = orders.map(order => `
        <div class="cart-item" style="flex-direction:column; align-items:stretch; gap:8px;">
          <div style="display:flex; justify-content:space-between;">
            <strong>Đơn hàng #${order.id}</strong>
            <span class="status-tag ACTIVE">${statusLabel[order.status] || order.status}</span>
          </div>
          <div style="font-size:13px; color:var(--text-muted);">
            Ngày đặt: ${new Date(order.createdAt).toLocaleString("vi-VN")}
          </div>
          <div style="font-size:13px; color:var(--text-muted);">Giao đến: ${order.shippingAddress}</div>
          <ul style="font-size:13px; margin-top:6px;">
            ${order.items.map(i => `<li>${i.productName} x${i.quantity} — ${ProductCard.formatPrice(i.priceAtOrder)}</li>`).join("")}
          </ul>
          <div style="text-align:right; font-weight:700;">Tổng: ${ProductCard.formatPrice(order.totalAmount)}</div>
        </div>
      `).join("");

    } catch (err) {
      box.innerHTML = `<div class="alert alert-error">${err.message}</div>`;
    }
  }
};
