const NewsApi = {
  getAll() {
    return Api.request("/news", "GET", null, false);
  },
  getById(id) {
    return Api.request("/news/" + id, "GET", null, false);
  },
  getByCategory(category) {
    return Api.request("/news/category/" + encodeURIComponent(category), "GET", null, false);
  },
  search(keyword) {
    return Api.request("/news/search?keyword=" + encodeURIComponent(keyword), "GET", null, false);
  }
};