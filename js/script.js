// Scroll-reveal: fade+slide sections into view as visitor scrolls
const revealEls = document.querySelectorAll(".reveal");

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in-view");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
);

revealEls.forEach((el, i) => {
  el.style.setProperty("--i", i % 6);
  revealObserver.observe(el);
});

// Animated stat counters
const counters = document.querySelectorAll("[data-count]");

function animateCounter(el) {
  const target = parseInt(el.dataset.count, 10);
  const suffix = el.dataset.suffix || "";
  const duration = 1400;
  const start = performance.now();

  function tick(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(eased * target) + suffix;
    if (progress < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

const counterObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.5 }
);

counters.forEach((el) => counterObserver.observe(el));

// ===== Portfolio page: filter tabs =====
const filterTabs = document.querySelectorAll(".filter-tab");
const portfolioCards = document.querySelectorAll(".portfolio-grid .work-card");

if (filterTabs.length) {
  // initial staggered reveal
  portfolioCards.forEach((card, i) => {
    setTimeout(() => card.classList.add("shown"), i * 70);
  });

  filterTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      filterTabs.forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");
      const filter = tab.dataset.filter;

      portfolioCards.forEach((card, i) => {
        const matches = filter === "all" || card.dataset.category === filter;
        if (matches) {
          card.classList.remove("hidden-card");
          card.classList.remove("shown");
          setTimeout(() => card.classList.add("shown"), i * 50);
        } else {
          card.classList.remove("shown");
          card.classList.add("hidden-card");
        }
      });
    });
  });
}

// ===== Lightbox (supports single images and multi-image galleries) =====
const lightbox = document.querySelector(".lightbox");

if (lightbox) {
  const lightboxImgWrap = lightbox.querySelector(".lightbox-img-wrap");
  const lightboxTitle = lightbox.querySelector(".lightbox-title");
  const lightboxDesc = lightbox.querySelector(".lightbox-desc");
  const lightboxClose = lightbox.querySelector(".lightbox-close");
  const lightboxPrev = lightbox.querySelector(".lightbox-prev");
  const lightboxNext = lightbox.querySelector(".lightbox-next");
  const lightboxDots = lightbox.querySelector(".lightbox-dots");

  let galleryImages = [];
  let galleryIndex = 0;

  function renderGalleryImage() {
    const src = galleryImages[galleryIndex];
    lightboxImgWrap.innerHTML = `<img src="${src}" alt="">`;
    const multi = galleryImages.length > 1;
    lightboxPrev.style.display = multi ? "flex" : "none";
    lightboxNext.style.display = multi ? "flex" : "none";
    lightboxDots.style.display = multi ? "flex" : "none";
    if (multi) {
      lightboxDots.innerHTML = galleryImages
        .map((_, i) => `<span class="dot${i === galleryIndex ? " active" : ""}"></span>`)
        .join("");
    }
  }

  document.querySelectorAll(".portfolio-grid .work-card[data-lightbox='true']").forEach((card) => {
    card.addEventListener("click", () => {
      const galleryAttr = card.dataset.gallery;
      const title = card.querySelector("h4")?.textContent || "";
      const desc = card.querySelector("p")?.textContent || "";

      galleryImages = galleryAttr
        ? galleryAttr.split(",").map((s) => s.trim())
        : [card.querySelector("img")?.getAttribute("src")].filter(Boolean);

      galleryIndex = 0;
      renderGalleryImage();
      lightboxTitle.textContent = title;
      lightboxDesc.textContent = desc;
      lightbox.classList.add("open");
    });
  });

  lightboxPrev.addEventListener("click", (e) => {
    e.stopPropagation();
    galleryIndex = (galleryIndex - 1 + galleryImages.length) % galleryImages.length;
    renderGalleryImage();
  });
  lightboxNext.addEventListener("click", (e) => {
    e.stopPropagation();
    galleryIndex = (galleryIndex + 1) % galleryImages.length;
    renderGalleryImage();
  });

  function closeLightbox() { lightbox.classList.remove("open"); }
  lightboxClose.addEventListener("click", closeLightbox);
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) closeLightbox();
  });
  document.addEventListener("keydown", (e) => {
    if (!lightbox.classList.contains("open")) return;
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowLeft") lightboxPrev.click();
    if (e.key === "ArrowRight") lightboxNext.click();
  });
}

// ===== Skill meter fill animation (About page) =====
const meterFills = document.querySelectorAll(".meter-fill");

const meterObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("filled");
        meterObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.4 }
);

meterFills.forEach((el) => meterObserver.observe(el));

// ===== Only one video plays at a time (mobile + desktop) =====
const allVideos = document.querySelectorAll("video");
allVideos.forEach((vid) => {
  vid.addEventListener("play", () => {
    allVideos.forEach((other) => {
      if (other !== vid && !other.paused) other.pause();
    });
  });
});
