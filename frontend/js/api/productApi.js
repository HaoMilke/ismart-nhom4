const ProductApi = {
  getAll() {
    return Api.request("/products", "GET", null, false);
  },
  getById(id) {
    return Api.request("/products/" + id, "GET", null, false);
  },
  search(keyword) {
    return Api.request("/products/search?keyword=" + encodeURIComponent(keyword), "GET", null, false);
  }
};
