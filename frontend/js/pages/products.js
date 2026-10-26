const PageProducts = {
  allProducts: [],
  filtered: [],
  currentPage: 1,
  pageSize: 8,

  async render(container, params, query) {
    container.innerHTML = `
      <div class="container page">
        <h1 class="page-title" id="productsTitle">Tất cả sản phẩm</h1>
        <div class="search-bar">
          <div class="search-input-wrap">
            <input id="searchInput" type="text" placeholder="Tìm kiếm... (VD: dien thoai, laptop, smart watch)">
            <div class="search-suggestion-dropdown" id="searchDropdown"></div>
          </div>
          <button class="btn" id="searchBtn">Tìm kiếm</button>
          <button class="btn btn-outline" id="clearFilterBtn" style="display:none;">Xóa bộ lọc</button>
        </div>
        <div id="productGrid" class="product-grid"><p>Đang tải...</p></div>
        <div id="pagination" class="pagination"></div>
      </div>
    `;

    const grid = document.getElementById("productGrid");
    const input = document.getElementById("searchInput");
    const dropdown = document.getElementById("searchDropdown");
    const title = document.getElementById("productsTitle");
    const clearBtn = document.getElementById("clearFilterBtn");

    try {
      this.allProducts = await ProductApi.getAll();

      SearchUtil.attachAutocomplete(input, dropdown, {
        onSelect: (product) => { window.location.hash = `#/product/${product.id}`; },
        onSubmit: (keyword) => this.applyKeyword(keyword)
      });

      document.getElementById("searchBtn").addEventListener("click", () => this.applyKeyword(input.value));
      clearBtn.addEventListener("click", () => { window.location.hash = "#/products"; });

      if (query && query.category) {
        title.textContent = `Danh mục: ${query.category}`;
        clearBtn.style.display = "inline-block";
        this.filtered = this.allProducts.filter(p =>
          SearchUtil.normalize(p.category || "") === SearchUtil.normalize(query.category)
        );
      } else if (query && query.keyword) {
        title.textContent = "Tất cả sản phẩm";
        clearBtn.style.display = "inline-block";
        input.value = query.keyword;
        this.filtered = SearchUtil.filterProducts(this.allProducts, query.keyword);
      } else {
        title.textContent = "Tất cả sản phẩm";
        this.filtered = this.allProducts;
      }

      this.currentPage = 1;
      this.renderPage(grid);

    } catch (err) {
      grid.innerHTML = `<div class="alert alert-error">${err.message}</div>`;
    }
  },

  applyKeyword(keyword) {
    document.getElementById("productsTitle").textContent = "Tất cả sản phẩm";
    document.getElementById("clearFilterBtn").style.display = keyword.trim() ? "inline-block" : "none";
    this.filtered = SearchUtil.filterProducts(this.allProducts, keyword);
    this.currentPage = 1;
    this.renderPage(document.getElementById("productGrid"));
  },

  renderPage(grid) {
    const pagBox = document.getElementById("pagination");
    const totalPages = Math.max(1, Math.ceil(this.filtered.length / this.pageSize));
    if (this.currentPage > totalPages) this.currentPage = totalPages;

    if (this.filtered.length === 0) {
      grid.innerHTML = `<p class="empty-state">Không tìm thấy sản phẩm nào phù hợp.</p>`;
      pagBox.innerHTML = "";
      return;
    }

    const start = (this.currentPage - 1) * this.pageSize;
    grid.innerHTML = this.filtered.slice(start, start + this.pageSize).map(ProductCard.render).join("");

    pagBox.innerHTML = this.renderPaginationHtml(totalPages);
    this.attachPaginationEvents(grid, totalPages);
  },

  renderPaginationHtml(totalPages) {
    if (totalPages <= 1) return "";
    let html = `<button class="page-btn" data-page="prev" ${this.currentPage === 1 ? "disabled" : ""}>‹</button>`;
    for (let i = 1; i <= totalPages; i++) {
      html += `<button class="page-btn ${i === this.currentPage ? "active" : ""}" data-page="${i}">${i}</button>`;
    }
    html += `<button class="page-btn" data-page="next" ${this.currentPage === totalPages ? "disabled" : ""}>›</button>`;
    return html;
  },

  attachPaginationEvents(grid, totalPages) {
    document.querySelectorAll(".page-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const page = btn.dataset.page;
        if (page === "prev") this.currentPage = Math.max(1, this.currentPage - 1);
        else if (page === "next") this.currentPage = Math.min(totalPages, this.currentPage + 1);
        else this.currentPage = parseInt(page, 10);

        this.renderPage(grid);
        window.scrollTo({ top: grid.offsetTop - 90, behavior: "smooth" });
      });
    });
  }
};