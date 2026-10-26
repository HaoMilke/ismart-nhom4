const DragScroll = {
  /**
   * Gắn tính năng kéo chuột để cuộn ngang cho 1 phần tử.
   * @param {HTMLElement} el - phần tử có overflow-x: auto (VD .product-row)
   */
  attach(el) {
    let isDown = false;
    let startX = 0;
    let scrollLeftStart = 0;
    let moved = false;

    el.addEventListener("mousedown", (e) => {
      isDown = true;
      moved = false;
      el.classList.add("dragging");
      startX = e.pageX - el.offsetLeft;
      scrollLeftStart = el.scrollLeft;
    });

    window.addEventListener("mouseup", () => {
      isDown = false;
      el.classList.remove("dragging");
    });

    el.addEventListener("mouseleave", () => {
      isDown = false;
      el.classList.remove("dragging");
    });

    el.addEventListener("mousemove", (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - el.offsetLeft;
      const walk = x - startX;
      if (Math.abs(walk) > 5) moved = true;
      el.scrollLeft = scrollLeftStart - walk;
    });

    // Nếu người dùng chỉ kéo nhẹ (không thực sự rê chuột), vẫn cho phép click vào sản phẩm bình thường
    el.addEventListener("click", (e) => {
      if (moved) {
        e.preventDefault();
        e.stopPropagation();
      }
    }, true);

    // // Hỗ trợ cuộn ngang bằng bánh xe chuột (giữ Shift hoặc cuộn dọc bình thường đều đổi thành cuộn ngang)
    // el.addEventListener("wheel", (e) => {
    //   if (e.deltaY === 0) return;
    //   el.scrollLeft += e.deltaY;
    //   e.preventDefault();
    // }, { passive: false });
  }
};