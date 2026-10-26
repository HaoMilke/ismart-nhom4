const CartApi = {
  getCart() {
    return Api.request("/cart", "GET");
  },
  addToCart(productId, quantity) {
    return Api.request("/cart", "POST", { productId, quantity });
  },
  updateItem(cartItemId, quantity) {
    return Api.request("/cart/" + cartItemId, "PUT", { quantity });
  },
  removeItem(cartItemId) {
    return Api.request("/cart/" + cartItemId, "DELETE");
  }
};
