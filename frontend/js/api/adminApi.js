const AdminApi = {
  // Quản lý user
  getAllUsers() {
    return Api.request("/admin/users", "GET");
  },
  createUser(data) {
    return Api.request("/admin/users", "POST", data);
  },
  updateUser(id, data) {
    return Api.request("/admin/users/" + id, "PUT", data);
  },
  blockUser(id) {
    return Api.request("/admin/users/" + id + "/block", "PUT");
  },
  unblockUser(id) {
    return Api.request("/admin/users/" + id + "/unblock", "PUT");
  },

  // Quản lý sản phẩm
  createProduct(data) {
    return Api.request("/admin/products", "POST", data);
  },
  updateProduct(id, data) {
    return Api.request("/admin/products/" + id, "PUT", data);
  },
  deleteProduct(id) {
    return Api.request("/admin/products/" + id, "DELETE");
  },

    // Quản lý tin tức
  getAllNewsAdmin() {
    return Api.request("/admin/news", "GET");
  },
  createNews(data) {
    return Api.request("/admin/news", "POST", data);
  },
  updateNews(id, data) {
    return Api.request("/admin/news/" + id, "PUT", data);
  },
  deleteNews(id) {
    return Api.request("/admin/news/" + id, "DELETE");
  },

   // Quản lý tin tức
  getAllNews() {
    return Api.request("/admin/news", "GET");
  },
  createNews(data) {
    return Api.request("/admin/news", "POST", data);
  },
  updateNews(id, data) {
    return Api.request("/admin/news/" + id, "PUT", data);
  },
  deleteNews(id) {
    return Api.request("/admin/news/" + id, "DELETE");
  }  ,

  // Quản lý banner
  getAllBanners() {
    return Api.request("/admin/banners", "GET");
  },
  createBanner(data) {
    return Api.request("/admin/banners", "POST", data);
  },
  updateBanner(id, data) {
    return Api.request("/admin/banners/" + id, "PUT", data);
  },
  deleteBanner(id) {
    return Api.request("/admin/banners/" + id, "DELETE");
  },

  // Quản lý khuyến mại
    getAllPromotions() {
    return Api.request("/admin/promotions", "GET");
  },
  createPromotion(data) {
    return Api.request("/admin/promotions", "POST", data);
  },
  updatePromotion(id, data) {
    return Api.request("/admin/promotions/" + id, "PUT", data);
  },
  deletePromotion(id) {
    return Api.request("/admin/promotions/" + id, "DELETE");
  }
};
