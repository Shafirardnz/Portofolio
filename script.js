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

  // ================== VIDEO TEASER CONTROL ==================
  const openTeaserBtn = document.getElementById("openTeaserBtn");
  const videoModal = document.getElementById("videoModal");
  const closeTeaserBtn = document.getElementById("closeTeaserBtn");
  const closeTeaserOverlay = document.getElementById("closeTeaserOverlay");
  const teaserVideo = document.getElementById("teaserVideo");

  if (openTeaserBtn && videoModal) {
    // Open Modal & Play Video
    openTeaserBtn.addEventListener("click", () => {
      videoModal.classList.add("active");
      videoModal.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden"; // Prevent scrolling main page

      if (teaserVideo) {
        teaserVideo.play().catch(err => {
          console.log("Autoplay was prevented by browser security:", err);
        });
      }
    });

    // Close Modal & Reset Video Function
    const closeModal = () => {
      videoModal.classList.remove("active");
      videoModal.setAttribute("aria-hidden", "true");
      document.body.style.overflow = ""; // Restore scrolling

      if (teaserVideo) {
        teaserVideo.pause();
        teaserVideo.currentTime = 0; // Rewind video to beginning
      }
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