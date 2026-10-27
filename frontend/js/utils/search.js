const SearchUtil = {
  // Từ đồng nghĩa cho từng danh mục — thêm/sửa tùy dữ liệu sản phẩm thật của bạn
  CATEGORY_ALIASES: {
    "Điện thoại": ["dien thoai", "smartphone", "smart phone", "phone", "mobile", "iphone", "dtdd"],
    "Laptop": ["laptop", "may tinh xach tay", "notebook", "macbook", "computer", "pc"],
    "Phụ kiện": ["phu kien", "accessory", "accessories", "phukien"],
    "Đồng hồ": ["dong ho", "watch", "smart watch", "smartwatch"],
    "Màn hình": ["man hinh", "monitor", "screen", "display"],
    "Gaming": ["gaming", "game", "gear", "choi game"]
  },

  _cache: null,
  _cacheTime: 0,

  // Bỏ dấu tiếng Việt + viết thường + gộp khoảng trắng thừa
  normalize(str) {
    if (!str) return "";
    return str.toString()
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .trim()
      .replace(/\s+/g, " ");
  },

  // Bản "viết liền" — bỏ luôn khoảng trắng, dùng để so khớp "smartphone" với "smart phone"
  compact(str) {
    return this.normalize(str).replace(/\s+/g, "");
  },

  matchProduct(product, rawKeyword) {
    const kw = this.normalize(rawKeyword);
    if (!kw) return true;
    const kwCompact = kw.replace(/\s+/g, "");

    // 1. So khớp trực tiếp trong tên / danh mục / mô tả
    const fields = [product.name, product.category, product.description].filter(Boolean);
    for (const field of fields) {
      const nf = this.normalize(field);
      if (nf.includes(kw) || nf.replace(/\s+/g, "").includes(kwCompact)) return true;
    }

    // 2. So khớp qua từ đồng nghĩa danh mục (VD gõ "smartphone" -> khớp category "Điện thoại")
    if (product.category) {
      const productCatNorm = this.normalize(product.category);
      for (const [category, aliases] of Object.entries(this.CATEGORY_ALIASES)) {
        if (this.normalize(category) !== productCatNorm) continue;
        for (const alias of aliases) {
          const na = this.normalize(alias);
          const naCompact = na.replace(/\s+/g, "");
          if (na.includes(kw) || kw.includes(na) || naCompact.includes(kwCompact) || kwCompact.includes(naCompact)) {
            return true;
          }
        }
      }
    }
    return false;
  },

  filterProducts(products, keyword) {
    if (!keyword || !keyword.trim()) return products;
    return products.filter(p => this.matchProduct(p, keyword));
  },

  // Lấy danh sách sản phẩm để gợi ý, có cache 15s để đỡ gọi API liên tục khi gõ
  async getCachedProducts() {
    const now = Date.now();
    if (this._cache && (now - this._cacheTime) < 15000) return this._cache;
    const products = await ProductApi.getAll();
    this._cache = products;
    this._cacheTime = now;
    return products;
  },

  // Gắn tính năng autocomplete cho 1 ô input + 1 div dropdown
  attachAutocomplete(inputEl, dropdownEl, { onSelect, onSubmit } = {}) {
    let debounceTimer = null;

    const close = () => {
      dropdownEl.innerHTML = "";
      dropdownEl.classList.remove("open");
    };

    const showSuggestions = async (keyword) => {
      if (!keyword.trim()) { close(); return; }
      try {
        const products = await this.getCachedProducts();
        const suggestions = this.filterProducts(products, keyword).slice(0, 6);

        if (suggestions.length === 0) {
          dropdownEl.innerHTML = `<div class="search-suggestion-empty">Không tìm thấy sản phẩm phù hợp</div>`;
          dropdownEl.classList.add("open");
          return;
        }

        dropdownEl.innerHTML = suggestions.map(p => `
          <div class="search-suggestion-item" data-id="${p.id}">
            <img src="${p.imageUrl || 'https://via.placeholder.com/40'}" alt="">
            <div>
              <div class="s-name">${p.name}</div>
              <div class="s-cat">${p.category || ""} · ${ProductCard.formatPrice(p.price)}</div>
            </div>
          </div>
        `).join("");
        dropdownEl.classList.add("open");

        dropdownEl.querySelectorAll(".search-suggestion-item").forEach(item => {
          item.addEventListener("click", () => {
            const product = suggestions.find(p => String(p.id) === item.dataset.id);
            close();
            if (onSelect) onSelect(product);
          });
        });
      } catch (err) {
        close();
      }
    };

    inputEl.addEventListener("input", () => {
      clearTimeout(debounceTimer);
      const keyword = inputEl.value;
      debounceTimer = setTimeout(() => showSuggestions(keyword), 200);
    });

    inputEl.addEventListener("focus", () => {
      if (inputEl.value.trim()) showSuggestions(inputEl.value);
    });

    document.addEventListener("click", (e) => {
      if (e.target !== inputEl && !dropdownEl.contains(e.target)) close();
    });

    inputEl.addEventListener("keydown", (e) => {
      if (e.key === "Escape") close();
      if (e.key === "Enter") {
        e.preventDefault();
        close();
        if (onSubmit) onSubmit(inputEl.value);
      }
    });
  }
};