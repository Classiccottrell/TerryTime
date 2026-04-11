// Micro-animations & Scroll Reveal logic

document.addEventListener('DOMContentLoaded', () => {
  // Intersection Observer for scroll reveal animations
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.15
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target); // Reveal only once
      }
    });
  }, observerOptions);

  // Grab all elements with .scroll-reveal class
  const revealElements = document.querySelectorAll('.scroll-reveal');
  revealElements.forEach(el => observer.observe(el));

  // Handle Free SVG Download
  const freeBtn = document.getElementById('btn-download-free');
  if (freeBtn) {
    freeBtn.addEventListener('click', () => {
      // Mocked download action
      const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="45" fill="black" stroke="white" stroke-width="5"/>
        <text x="50" y="55" font-family="'Bebas Neue', sans-serif" font-size="20" fill="#FFE135" text-anchor="middle">TERRY TIME</text>
      </svg>`;
      
      const blob = new Blob([svgContent], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'ttlb-free-sticker.svg';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    });
  }
});
