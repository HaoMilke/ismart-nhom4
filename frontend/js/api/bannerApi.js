const BannerApi = {
  getActive() {
    return Api.request("/banners", "GET", null, false);
  }
};