const PageNewsDetail = {
  async render(container, params) {
    container.innerHTML = `<div class="container page"><p>Đang tải...</p></div>`;
    try {
      const n = await NewsApi.getById(params.id);
      container.innerHTML = `
        <div class="container page news-detail">
          <a href="#/news" class="back-link">← Quay lại danh sách tin tức</a>
          <span class="news-category">${n.category || ""}</span>
          <h1 class="page-title">${n.title}</h1>
          <p class="news-meta">${n.author ? "Tác giả: " + n.author : ""}</p>
          ${n.imageUrl ? `<img src="${n.imageUrl}" alt="${n.title}" class="news-detail-img">` : ""}
          <div class="news-content">${n.content}</div>
        </div>
      `;
    } catch (err) {
      container.innerHTML = `<div class="container page"><div class="alert alert-error">${err.message}</div></div>`;
    }
  }
};