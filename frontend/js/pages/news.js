const PageNews = {
  async render(container) {
    container.innerHTML = `
      <div class="container page">
        <h1 class="page-title">Tin tức</h1>

        <div class="tabs" id="newsCategoryTabs">
          <button class="active" data-category="">Tất cả</button>
          <button data-category="Khuyến mãi">Khuyến mãi</button>
          <button data-category="Hướng dẫn">Hướng dẫn</button>
          <button data-category="Thông báo">Thông báo</button>
        </div>

        <div id="newsList" class="news-grid"></div>
      </div>
    `;

    document.querySelectorAll("#newsCategoryTabs button").forEach(btn => {
      btn.addEventListener("click", () => {
        document.querySelectorAll("#newsCategoryTabs button").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        this.loadNews(btn.dataset.category);
      });
    });

    this.loadNews("");
  },

  async loadNews(category) {
    const listEl = document.getElementById("newsList");
    listEl.innerHTML = `<p>Đang tải...</p>`;
    try {
      const news = category ? await NewsApi.getByCategory(category) : await NewsApi.getAll();

      if (news.length === 0) {
        listEl.innerHTML = `<p class="empty-state">Chưa có tin tức nào.</p>`;
        return;
      }

      listEl.innerHTML = news.map(n => `
        <a href="#/news/${n.id}" class="news-card">
          ${n.imageUrl ? `<img src="${n.imageUrl}" alt="${n.title}">` : ""}
          <div class="news-card-body">
            <span class="news-category">${n.category || ""}</span>
            <h3>${n.title}</h3>
            <p>${n.summary || ""}</p>
          </div>
        </a>
      `).join("");
    } catch (err) {
      listEl.innerHTML = `<div class="alert alert-error">${err.message}</div>`;
    }
  }
};