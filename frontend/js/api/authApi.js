const AuthApi = {
  register(data) {
    return Api.request("/auth/register", "POST", data, false);
  },

  async login(data) {
    const res = await Api.request("/auth/login", "POST", data, false);
    localStorage.setItem("token", res.token);
    localStorage.setItem("user", JSON.stringify({
      id: res.userId,
      username: res.username,
      role: res.role
    }));
    return res;
  },

  logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },

  getCurrentUser() {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  },

  isLoggedIn() {
    return !!localStorage.getItem("token");
  },

  isAdmin() {
    const user = this.getCurrentUser();
    return !!user && user.role === "ADMIN";
  }
};
