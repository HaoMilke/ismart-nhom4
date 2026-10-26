const OrderApi = {
  createOrder(shippingAddress, promotionCode) {
    return Api.request("/orders", "POST", { shippingAddress, promotionCode: promotionCode || null });
  },
  getOrders() {
    return Api.request("/orders", "GET");
  }
};