// Navigation functionality
document.addEventListener('DOMContentLoaded', () => {
  const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
  const navMenu = document.querySelector('.nav-menu');
  const dropdowns = document.querySelectorAll('.dropdown');
  
  // Toggle mobile menu
  if (mobileMenuToggle) {
    mobileMenuToggle.addEventListener('click', () => {
      navMenu.classList.toggle('active');
      
      // Animate hamburger icon to X
      const spans = mobileMenuToggle.querySelectorAll('span');
      if (navMenu.classList.contains('active')) {
        spans[0].style.transform = 'translateY(9px) rotate(45deg)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'translateY(-9px) rotate(-45deg)';
      } else {
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
      }
    });
  }
  
  // Handle mobile dropdowns
  dropdowns.forEach(dropdown => {
    const link = dropdown.querySelector('.nav-link');
    if (window.innerWidth <= 768) {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        dropdown.classList.toggle('active');
      });
    }
  });
  
  // Close mobile menu when clicking outside
  document.addEventListener('click', (e) => {
    if (!e.target.closest('nav') && navMenu.classList.contains('active')) {
      navMenu.classList.remove('active');
      
      // Reset hamburger icon
      const spans = mobileMenuToggle.querySelectorAll('span');
      spans[0].style.transform = 'none';
      spans[1].style.opacity = '1';
      spans[2].style.transform = 'none';
    }
  });
  
  // Add active class to current page link
  const currentPage = window.location.pathname;
  const navLinks = document.querySelectorAll('.nav-link, .dropdown-menu a');
  
  navLinks.forEach(link => {
    if (link.getAttribute('href') === currentPage || link.getAttribute('href') === currentPage.substring(currentPage.lastIndexOf('/'))) {
      link.classList.add('active');
      // If it's in a dropdown, also highlight the parent
      const parentDropdown = link.closest('.dropdown');
      if (parentDropdown) {
        const parentLink = parentDropdown.querySelector('.nav-link');
        parentLink.classList.add('active');
      }
    }
  });
});