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
});