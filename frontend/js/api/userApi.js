const UserApi = {
  getProfile() {
    return Api.request("/users/me", "GET");
  },
  updateProfile(data) {
    return Api.request("/users/me", "PUT", data);
  },
  changePassword(data) {
    return Api.request("/users/me/password", "PUT", data);
  },
  deleteAccount() {
    return Api.request("/users/me", "DELETE");
  }
};
