function scrollToSection(id) {
  const element = document.getElementById(id);
  if (element) {
    element.scrollIntoView({
      behavior: "smooth"
    });
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const menuToggle = document.getElementById("menuToggle");
  const navMenu = document.getElementById("navMenu");
  const navLinks = document.querySelectorAll(".nav-link");

  if (menuToggle && navMenu) {
    // Toggle Menu
    menuToggle.addEventListener("click", () => {
      menuToggle.classList.toggle("active");
      navMenu.classList.toggle("active");
    });

    // Navigation Link handling
    navLinks.forEach(link => {
      link.addEventListener("click", (e) => {
        const href = link.getAttribute("href");
        
        // Check if the link is a local anchor (starts with #)
        if (href.startsWith("#")) {
          const targetId = href.substring(1);
          const element = document.getElementById(targetId);
          
          if (element) {
            e.preventDefault();
            scrollToSection(targetId);
            menuToggle.classList.remove("active");
            navMenu.classList.remove("active");
          }
        }
      });
    });
  }

  // ================== VIDEO TEASER CONTROL (YOUTUBE) ==================
  const openTeaserBtn = document.getElementById("openTeaserBtn");
  const videoModal = document.getElementById("videoModal");
  const closeTeaserBtn = document.getElementById("closeTeaserBtn");
  const closeTeaserOverlay = document.getElementById("closeTeaserOverlay");
  const teaserIframe = document.getElementById("teaserVideo");

  if (openTeaserBtn && videoModal && teaserIframe) {
    const youtubeUrl = teaserIframe.getAttribute("data-src");

    // Open Modal & Load + Autoplay YouTube video
    openTeaserBtn.addEventListener("click", () => {
      videoModal.classList.add("active");
      videoModal.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden"; // Prevent scrolling main page

      // Load YouTube video with autoplay
      teaserIframe.setAttribute("src", youtubeUrl + "&autoplay=1");
    });

    // Close Modal & Stop YouTube video
    const closeModal = () => {
      videoModal.classList.remove("active");
      videoModal.setAttribute("aria-hidden", "true");
      document.body.style.overflow = ""; // Restore scrolling

      // Remove src to stop video and reset — cleanest way to stop YouTube
      teaserIframe.setAttribute("src", "");
    };

    // Close events
    if (closeTeaserBtn) {
      closeTeaserBtn.addEventListener("click", closeModal);
    }
    if (closeTeaserOverlay) {
      closeTeaserOverlay.addEventListener("click", closeModal);
    }

    // Close on Escape key press
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && videoModal.classList.contains("active")) {
        closeModal();
      }
    });
  }

  // ================== 3D ALBUM CAROUSEL CONTROLLER ==================
  function initAlbumCarousel(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const cards = Array.from(container.querySelectorAll(".album-card"));
    const prevBtn = container.querySelector(".prev-btn");
    const nextBtn = container.querySelector(".next-btn");
    const dotsContainer = container.querySelector(".carousel-dots");
    
    if (cards.length === 0) return;

    let currentIndex = 0;
    let autoSlideTimer = null;
    let isHovered = false;

    // Build indicator dots
    dotsContainer.innerHTML = "";
    cards.forEach((_, idx) => {
      const dot = document.createElement("div");
      dot.classList.add("carousel-dot");
      if (idx === 0) dot.classList.add("active");
      dot.addEventListener("click", () => {
        currentIndex = idx;
        updateCarousel();
        resetAutoSlide();
      });
      dotsContainer.appendChild(dot);
    });

    const dots = Array.from(dotsContainer.querySelectorAll(".carousel-dot"));

    function updateCarousel() {
      const total = cards.length;

      cards.forEach((card, idx) => {
        // Reset 3D positioning classes
        card.classList.remove(
          "active-card",
          "prev-card",
          "next-card",
          "far-prev-card",
          "far-next-card"
        );

        // Calculate cyclic distance from currentIndex
        let diff = idx - currentIndex;
        if (diff > total / 2) diff -= total;
        if (diff < -total / 2) diff += total;

        if (diff === 0) {
          card.classList.add("active-card");
        } else if (diff === -1) {
          card.classList.add("prev-card");
        } else if (diff === 1) {
          card.classList.add("next-card");
        } else if (diff < -1) {
          card.classList.add("far-prev-card");
        } else if (diff > 1) {
          card.classList.add("far-next-card");
        }
      });

      // Update dots
      dots.forEach((dot, idx) => {
        if (idx === currentIndex) {
          dot.classList.add("active");
        } else {
          dot.classList.remove("active");
        }
      });
    }

    // Card Click Handler: if side card is clicked, bring to center; if active, allow normal actions
    cards.forEach((card, idx) => {
      card.addEventListener("click", (e) => {
        if (idx !== currentIndex) {
          e.stopPropagation(); // prevent triggering active modal if clicking a side card
          currentIndex = idx;
          updateCarousel();
          resetAutoSlide();
        }
      });
    });

    // Navigation buttons
    if (prevBtn) {
      prevBtn.addEventListener("click", () => {
        currentIndex = (currentIndex - 1 + cards.length) % cards.length;
        updateCarousel();
        resetAutoSlide();
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener("click", () => {
        currentIndex = (currentIndex + 1) % cards.length;
        updateCarousel();
        resetAutoSlide();
      });
    }

    // Touch / Swipe support for mobile & tablet
    let touchStartX = 0;
    let touchEndX = 0;
    const stage = container.querySelector(".album-carousel-stage");

    if (stage) {
      stage.addEventListener("touchstart", (e) => {
        touchStartX = e.changedTouches[0].screenX;
      }, { passive: true });

      stage.addEventListener("touchend", (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
      }, { passive: true });
    }

    function handleSwipe() {
      const threshold = 40;
      if (touchEndX < touchStartX - threshold) {
        // Swipe Left -> Next
        currentIndex = (currentIndex + 1) % cards.length;
        updateCarousel();
        resetAutoSlide();
      } else if (touchEndX > touchStartX + threshold) {
        // Swipe Right -> Prev
        currentIndex = (currentIndex - 1 + cards.length) % cards.length;
        updateCarousel();
        resetAutoSlide();
      }
    }

    // Auto-slide Timer
    function startAutoSlide() {
      stopAutoSlide();
      autoSlideTimer = setInterval(() => {
        if (!isHovered) {
          currentIndex = (currentIndex + 1) % cards.length;
          updateCarousel();
        }
      }, 4500);
    }

    function stopAutoSlide() {
      if (autoSlideTimer) {
        clearInterval(autoSlideTimer);
        autoSlideTimer = null;
      }
    }

    function resetAutoSlide() {
      startAutoSlide();
    }

    container.addEventListener("mouseenter", () => {
      isHovered = true;
    });

    container.addEventListener("mouseleave", () => {
      isHovered = false;
    });

    // Initialize state
    updateCarousel();
    startAutoSlide();
  }

  // Initialize both Game & Website Carousels
  initAlbumCarousel("gameCarousel");
  initAlbumCarousel("webCarousel");

  // ================== TYPEWRITER ANIMATION (HERO NAME) ==================
  const typewriterText = document.getElementById("typewriterText");
  if (typewriterText) {
    const fullName = "Shafira Ardaneza Azahrah";
    typewriterText.textContent = "";
    let charIndex = 0;

    function typeCharacter() {
      if (charIndex < fullName.length) {
        typewriterText.textContent += fullName.charAt(charIndex);
        charIndex++;
        setTimeout(typeCharacter, 70); // 70ms typing delay per character
      }
    }

    // Start typewriter effect automatically on page load
    setTimeout(typeCharacter, 350);
  }

  // ================== SCROLL REVEAL PER SECTION ==================
  const revealTargets = document.querySelectorAll(".hero, .section-about, .section-skills, .section-portfolio, .section-contact");
  
  const revealObserverOptions = {
    root: null,
    threshold: 0.12
  };

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-revealed");
        observer.unobserve(entry.target); // Trigger only once when entering viewport
      }
    });
  }, revealObserverOptions);

  revealTargets.forEach(target => {
    target.classList.add("reveal-section");
    revealObserver.observe(target);
  });

  // ================== STAGGER ANIMATION FOR SKILLS ==================
  const skillItems = document.querySelectorAll(".skill");
  skillItems.forEach((skill, idx) => {
    skill.style.transitionDelay = `${idx * 0.08}s`;
  });

  // ================== ACTIVE SECTION NAVIGATION HIGHLIGHT ==================
  const sections = document.querySelectorAll("section[id], div[id]");
  const navLinksList = document.querySelectorAll(".nav-link");

  const observerOptions = {
    root: null,
    rootMargin: "-20% 0px -60% 0px",
    threshold: 0
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute("id");
        navLinksList.forEach(link => {
          if (link.getAttribute("href") === `#${id}`) {
            link.classList.add("active");
          } else {
            link.classList.remove("active");
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach(section => {
    observer.observe(section);
  });
});