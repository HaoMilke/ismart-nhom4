const ProductCard = {
  render(product) {
    const img = product.imageUrl || "https://via.placeholder.com/300x300?text=No+Image";
    return `
      <div class="product-card">

         <a href="#/product/${product.id}"><img class="thumb" src="${img}" alt="${product.name}"></a>
        <div class="info">
          <div class="name">${product.name}</div>
          <div class="price">${ProductCard.formatPrice(product.price)}</div>
          <a class="btn btn-outline btn-sm" href="#/product/${product.id}">Xem chi tiết</a>
        </div>
      </div>
    `;
  },

  formatPrice(price) {
    return Number(price).toLocaleString("vi-VN") + "đ";
  }
};
