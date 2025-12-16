// banner轮播功能
const bannerCarousel = {
  bannerList: document.querySelector(".banner-list"),
  bannerItems: document.querySelectorAll(".banner-item"),
  dots: document.querySelectorAll(".dot"),
  prevBtn: document.querySelector(".banner-btn .prev-btn"), // 明确指向banner的按钮
  nextBtn: document.querySelector(".banner-btn .next-btn"),
  currentIndex: 0,
  interval: null,

  get itemWidth() {
    return this.bannerList.parentElement.offsetWidth;
  },

  init() {
    if (!this.bannerList || this.bannerItems.length === 0) return;

    this.bindEvents();
    this.startAutoPlay();
    this.switchTo(0);

    window.addEventListener("resize", () => {
      this.switchTo(this.currentIndex);
    });
  },

  switchTo(index) {
    if (index < 0) index = 0;
    if (index >= this.bannerItems.length) index = this.bannerItems.length - 1;

    this.currentIndex = index;
    this.bannerList.style.transform = `translateX(-${
      this.currentIndex * this.itemWidth
    }px)`;

    this.dots.forEach((dot, i) => {
      dot.classList.toggle("active", i === this.currentIndex);
    });
  },

  // 下一张
  next() {
    const nextIndex = (this.currentIndex + 1) % this.bannerItems.length;
    this.switchTo(nextIndex);
  },

  // 上一张
  prev() {
    const prevIndex =
      (this.currentIndex - 1 + this.bannerItems.length) %
      this.bannerItems.length;
    this.switchTo(prevIndex);
  },

  bindEvents() {
    this.nextBtn?.addEventListener("click", () => {
      this.pauseAutoPlay();
      this.next();
      this.startAutoPlay();
    });

    this.prevBtn?.addEventListener("click", () => {
      this.pauseAutoPlay();
      this.prev();
      this.startAutoPlay();
    });

    this.dots.forEach((dot, i) => {
      dot.addEventListener("click", () => {
        this.pauseAutoPlay();
        this.switchTo(i);
        this.startAutoPlay();
      });
    });

    this.bannerList.parentElement.addEventListener("mouseenter", () => {
      this.pauseAutoPlay();
    });

    this.bannerList.parentElement.addEventListener("mouseleave", () => {
      this.startAutoPlay();
    });
  },

  startAutoPlay() {
    this.pauseAutoPlay();
    this.interval = setInterval(() => {
      this.next();
    }, 3000);
  },

  pauseAutoPlay() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
  },
};

// 师生祝福
const blessingCarousel = {
  track: document.querySelector(".blessing-box"),
  items: document.querySelectorAll(".blessing-item"),
  prevBtn: document.querySelector(".blessing-controls .prev-btn"),
  nextBtn: document.querySelector(".blessing-controls .next-btn"),
  currentIndex: 0,
  visibleCount: 3,
  interval: null,

  init() {
    this.bindEvents();

    if (this.items.length <= this.visibleCount) {
      if (this.items.length >= 3) {
        this.items[1].classList.add("center");
      }
      return;
    }
    this.items[1].classList.add("center");
    this.updatePosition();
    this.startAutoPlay();
  },

  bindEvents() {
    if (this.prevBtn) {
      this.prevBtn.addEventListener("click", () => {
        this.pauseAutoPlay();
        this.prevSlide();
        this.startAutoPlay();
      });
    }
    if (this.nextBtn) {
      this.nextBtn.addEventListener("click", () => {
        this.pauseAutoPlay();
        this.nextSlide();
        this.startAutoPlay();
      });
    }
    this.track.parentElement.addEventListener("mouseenter", () =>
      this.pauseAutoPlay()
    );
    this.track.parentElement.addEventListener("mouseleave", () =>
      this.startAutoPlay()
    );
  },

  prevSlide() {
    const maxIndex = this.items.length - this.visibleCount;
    this.items.forEach((item) => item.classList.remove("center"));
    this.currentIndex =
      this.currentIndex <= 0 ? maxIndex : this.currentIndex - 1;
    const activeIndex = this.currentIndex + 1;
    this.items[activeIndex].classList.add("center");
    this.updatePosition();
  },

  nextSlide() {
    const maxIndex = this.items.length - this.visibleCount;
    this.items.forEach((item) => item.classList.remove("center"));
    this.currentIndex =
      this.currentIndex >= maxIndex ? 0 : this.currentIndex + 1;
    const activeIndex = this.currentIndex + 1;
    this.items[activeIndex].classList.add("center");
    this.updatePosition();
  },

  updatePosition() {
    const containerWidth = this.track.parentElement.offsetWidth;
    const itemWidth = this.items[0].offsetWidth;
    const gap = parseInt(getComputedStyle(this.track).gap) || 0;
    const activeIndex = this.currentIndex + 1;
    const activeItemCenter = activeIndex * (itemWidth + gap) + itemWidth / 2;
    const scrollDistance = containerWidth / 2 - activeItemCenter;
    this.track.style.transform = `translateX(${scrollDistance}px)`;
  },

  startAutoPlay() {
    this.interval = setInterval(() => {
      this.nextSlide();
    }, 3000);
  },

  pauseAutoPlay() {
    clearInterval(this.interval);
  },
};

// donation
const donationCarousel = {
  bodies: document.querySelectorAll(".table-body"),
  tableContainer: document.querySelector(".donation-table"),

  rowHeight: 36,
  currentIndex: 0,
  visibleRows: 0,
  totalRows: 0,
  maxIndex: 0,
  interval: null,
  animationDuration: 500,
  scrollStep: 8,

  // 初始化方法
  init() {
    // 计算总数据行数
    this.totalRows = this.bodies[0]?.querySelectorAll(".table-row").length || 0;
    if (this.totalRows === 0) return;

    // 动态获取实际行高
    this.rowHeight = this.bodies[0].querySelector(".table-row").offsetHeight;

    // 动态计算可见行数
    this.visibleRows = Math.floor(this.bodies[0].offsetHeight / this.rowHeight);

    // 计算最大滚动索引（确保不会滚出边界）
    this.maxIndex = Math.max(0, this.totalRows - this.visibleRows);

    if (this.totalRows <= this.visibleRows) return;

    this.startAutoPlay();
  },

  // 滚动到指定行
  scrollToRow(index) {
    const scrollTop = index * this.rowHeight;
    this.bodies.forEach((body) => {
      body.style.transform = `translateY(-${scrollTop}px)`;
      body.style.transition = `transform ${this.animationDuration}ms ease`;
    });
  },

  nextRow() {
    this.currentIndex =
      this.currentIndex >= this.maxIndex ? 0 : this.currentIndex + 1;
    this.scrollToRow(this.currentIndex);
  },

  nextRows() {
    let nextIndex = this.currentIndex + this.scrollStep;
    // 超过最大索引时回到初始位置
    this.currentIndex = nextIndex > this.maxIndex ? 0 : nextIndex;
    this.scrollToRow(this.currentIndex);
  },

  // 上滚指定行数
  prevRows() {
    let prevIndex = this.currentIndex - this.scrollStep;
    this.currentIndex = prevIndex < 0 ? 0 : prevIndex;
    this.scrollToRow(this.currentIndex);
  },

  // 启动自动轮播（自动滚动多行）
  startAutoPlay() {
    this.interval = setInterval(() => this.nextRows(), 2000);
  },

  // 暂停自动轮播
  pauseAutoPlay() {
    clearInterval(this.interval);
  },
};

class MemoryCarousel {
  static CAROUSEL_HEIGHT = 430;
  static AUTO_PLAY_INTERVAL = 3000;

  constructor() {
    this.currentTabId = "tab1";
    this.currentIndex = 0; // 当前轮播索引
    this.timer = null; // 自动轮播定时器
    // DOM 元素缓存
    this.tabItems = document.querySelectorAll(".tab-item");
    this.tabContents = document.querySelectorAll(".tab-content");
    this.memorySection = document.querySelector(".memory-section");

    // 初始化
    this.init();
  }

  init() {
    this.bindEvents();
    this.resetCarousel();
    this.startAutoPlay();
  }

  bindEvents() {
    this.tabItems.forEach((item) => {
      item.addEventListener("mouseenter", (e) => this.handleTabChange(e));
    });

    this.memorySection?.addEventListener("mouseenter", () =>
      this.stopAutoPlay()
    );
    this.memorySection?.addEventListener("mouseleave", () =>
      this.startAutoPlay()
    );
  }

  handleTabChange(e) {
    const targetItem = e.target;
    this.tabItems.forEach((tab) => tab.classList.remove("active"));
    targetItem.classList.add("active");

    this.currentTabId = targetItem.getAttribute("data-target");

    this.tabContents.forEach((content) => {
      content.classList.remove("active");
      if (content.id === this.currentTabId) content.classList.add("active");
    });

    this.resetCarousel();
    this.startAutoPlay();
  }

  startAutoPlay() {
    this.stopAutoPlay();

    if (this.getTotalGroups() > 1) {
      this.timer = setInterval(() => {
        this.moveCarousel("next");
      }, MemoryCarousel.AUTO_PLAY_INTERVAL);
    }
  }

  stopAutoPlay() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  moveCarousel(direction) {
    const carouselWrap = this.getCurrentCarouselWrap();
    if (!carouselWrap || this.getTotalGroups() <= 1) return;

    const totalGroups = this.getTotalGroups();
    if (direction === "next") {
      this.currentIndex = (this.currentIndex + 1) % totalGroups;
    } else {
      this.currentIndex = (this.currentIndex - 1 + totalGroups) % totalGroups;
    }

    const translateY = -this.currentIndex * MemoryCarousel.CAROUSEL_HEIGHT;
    carouselWrap.style.transform = `translateY(${translateY}px)`;
  }

  resetCarousel() {
    this.currentIndex = 0; // 重置索引为0
    const carouselWrap = this.getCurrentCarouselWrap();
    if (carouselWrap) {
      carouselWrap.style.transform = `translateY(0)`; // 重置位移
    }
    this.stopAutoPlay();
  }

  getCurrentCarouselWrap() {
    return document.querySelector(`#${this.currentTabId} .carousel-wrap`);
  }

  getTotalGroups() {
    const wrap = this.getCurrentCarouselWrap();
    return wrap ? wrap.querySelectorAll("ul").length : 0;
  }
}

// animation
document.addEventListener("DOMContentLoaded", function () {
  const firstRow = document.querySelector(".history-timeline-box.first-row");
  const secondRow = document.querySelector(".history-timeline-box.second-row");
  const thirdRow = document.querySelector(".history-timeline-box.third-row");

  const firstCurveArrows = document.querySelectorAll(
    ".counterclockwise_arrow1, .clockwise-arrow1"
  );
  const secondCurveArrows = document.querySelectorAll(
    ".counterclockwise_arrow2, .clockwise-arrow2"
  );

  const firstRowTrigger = firstRow?.querySelector(".first-arrow");
  const secondRowTrigger = secondRow?.querySelector(".first-arrow");
  const thirdRowTrigger = thirdRow?.querySelector(".first-arrow");

  function isElementInViewport(el) {
    if (!el) return false;
    const rect = el.getBoundingClientRect();
    return (
      rect.bottom >= window.innerHeight / 3 && rect.top <= window.innerHeight
    );
  }

  function checkScrollTrigger() {
    if (firstRow && firstRowTrigger && isElementInViewport(firstRowTrigger)) {
      firstRow.classList.add("visible");
      const triggerRect = firstRowTrigger.getBoundingClientRect();
      if (triggerRect.bottom <= window.innerHeight - 80) {
        firstCurveArrows.forEach((arrow) =>
          arrow.classList.add("arrow-visible")
        );
      }
    }

    if (
      secondRow &&
      secondRowTrigger &&
      isElementInViewport(secondRowTrigger)
    ) {
      secondRow.classList.add("visible");
      const triggerRect = secondRowTrigger.getBoundingClientRect();
      if (triggerRect.bottom <= window.innerHeight - 80) {
        secondCurveArrows.forEach((arrow) =>
          arrow.classList.add("arrow-visible")
        );
      }
    }

    if (thirdRow && thirdRowTrigger && isElementInViewport(thirdRowTrigger)) {
      thirdRow.classList.add("visible");
    }
  }

  const thirdCurveArrows = document.querySelectorAll(
    ".clockwise-arrow3, .counterclockwise_arrow3"
  );

  function checkScrollTrigger() {
    if (firstRow && firstRowTrigger && isElementInViewport(firstRowTrigger)) {
      firstRow.classList.add("visible");
      const triggerRect = firstRowTrigger.getBoundingClientRect();
      if (triggerRect.bottom <= window.innerHeight - 80) {
        firstCurveArrows.forEach((arrow) =>
          arrow.classList.add("arrow-visible")
        );
      }
    }

    if (
      secondRow &&
      secondRowTrigger &&
      isElementInViewport(secondRowTrigger)
    ) {
      secondRow.classList.add("visible");
      const triggerRect = secondRowTrigger.getBoundingClientRect();
      if (triggerRect.bottom <= window.innerHeight - 80) {
        secondCurveArrows.forEach((arrow) =>
          arrow.classList.add("arrow-visible")
        );
      }
    }

    if (thirdRow && thirdRowTrigger && isElementInViewport(thirdRowTrigger)) {
      thirdRow.classList.add("visible");
      const triggerRect = thirdRowTrigger.getBoundingClientRect();
      if (triggerRect.bottom <= window.innerHeight - 80) {
        thirdCurveArrows.forEach((arrow) =>
          arrow.classList.add("arrow-visible")
        );
      }
    }
  }

  // 确保滚动事件监听已正确绑定（如果之前未绑定需要添加）
  window.addEventListener("scroll", throttle(checkScrollTrigger));
  // 4. 节流优化（避免滚动时频繁执行，提升性能）
  function throttle(func, delay = 16) {
    let timer = null;
    return function () {
      if (!timer) {
        timer = setTimeout(() => {
          func.apply(this, arguments);
          timer = null;
        }, delay);
      }
    };
  }

  window.addEventListener("scroll", throttle(checkScrollTrigger));
});
// 页面加载完成后实例化类
document.addEventListener("DOMContentLoaded", () => {
  new MemoryCarousel();
});
// 页面DOM加载完成后初始化
document.addEventListener("DOMContentLoaded", () => {
  bannerCarousel.init();
  blessingCarousel.init();
  donationCarousel.init();
});
