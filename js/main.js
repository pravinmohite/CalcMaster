// Main JavaScript file
document.addEventListener('DOMContentLoaded', () => {
  // Initialize animations for page elements
  initAnimations();
  
  // Set up any global event listeners
  setupGlobalListeners();
});

// Initialize animations for various page elements
function initAnimations() {
  // Animate elements when they come into view
  const animatedElements = document.querySelectorAll('.calculator-card, .benefit-card');
  
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    
    animatedElements.forEach(el => {
      observer.observe(el);
    });
  } else {
    // Fallback for browsers that don't support IntersectionObserver
    animatedElements.forEach(el => {
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    });
  }
}

// Set up global event listeners
function setupGlobalListeners() {
  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      
      if (href !== '#') {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      }
    });
  });
}

// Utility function to format numbers with commas
function formatNumber(num) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// Utility function to show success message
function showSuccess(message, elementId) {
  const element = document.getElementById(elementId);
  if (element) {
    element.innerHTML = `<div class="success-message">${message}</div>`;
    setTimeout(() => {
      element.innerHTML = '';
    }, 3000);
  }
}

// Utility function to show error message
function showError(message, elementId) {
  const element = document.getElementById(elementId);
  if (element) {
    element.innerHTML = `<div class="error-message">${message}</div>`;
    setTimeout(() => {
      element.innerHTML = '';
    }, 3000);
  }
}

// Utility function to save calculation to local storage
function saveCalculation(calculatorType, inputData, result) {
  try {
    // Get existing calculations or initialize empty array
    let calculations = JSON.parse(localStorage.getItem('recent_calculations')) || [];
    
    // Add new calculation
    calculations.unshift({
      type: calculatorType,
      date: new Date().toISOString(),
      inputData: inputData,
      result: result
    });
    
    // Keep only the most recent 10 calculations
    calculations = calculations.slice(0, 10);
    
    // Save back to localStorage
    localStorage.setItem('recent_calculations', JSON.stringify(calculations));
    
    return true;
  } catch (error) {
    console.error('Error saving calculation:', error);
    return false;
  }
}