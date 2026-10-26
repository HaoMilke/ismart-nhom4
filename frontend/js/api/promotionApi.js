const PromotionApi = {
  check(code, orderTotal) {
    return Api.request("/promotions/check", "POST", { code, orderTotal });
  }
};