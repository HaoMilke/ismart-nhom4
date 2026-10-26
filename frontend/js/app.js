document.addEventListener("DOMContentLoaded", () => {
  Footer.render();

  // Route công khai
  Router.register("/", PageHome.render.bind(PageHome));
  Router.register("/products", PageProducts.render.bind(PageProducts));
  Router.register("/product/:id", PageProductDetail.render.bind(PageProductDetail));
  Router.register("/news", PageNews.render.bind(PageNews));                 // <-- thêm
  Router.register("/news/:id", PageNewsDetail.render.bind(PageNewsDetail)); // <--
  Router.register("/login", PageLogin.render.bind(PageLogin));
  Router.register("/register", PageRegister.render.bind(PageRegister));

  // Route cần đăng nhập
  Router.register("/cart", PageCart.render.bind(PageCart), { requireAuth: true });
  Router.register("/checkout", PageCheckout.render.bind(PageCheckout), { requireAuth: true });
  Router.register("/profile", PageProfile.render.bind(PageProfile), { requireAuth: true });
  Router.register("/orders", PageOrders.render.bind(PageOrders), { requireAuth: true });

  // Route chỉ dành cho Admin
  Router.register("/admin", PageAdmin.render.bind(PageAdmin), { requireAuth: true, requireAdmin: true });

  Router.init();
});
