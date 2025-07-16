document.addEventListener("DOMContentLoaded", () => {
    const sections = document.querySelectorAll(".scroll-section");
  
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = 1;
          entry.target.style.transform = "translateY(0)";
        }
      });
    }, {
      threshold: 0.2
    });
  
    sections.forEach(section => {
      section.style.opacity = 0;
      section.style.transform = "translateY(50px)";
      section.style.transition = "all 0.8s ease-out";
      observer.observe(section);
    });
  });
  