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
});