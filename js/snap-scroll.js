/**
 * Snap Scroll Implementation
 * Modern 2025 Portfolio Enhancement
 */

document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const snapContainer = document.querySelector('.snap-container');
  const snapSections = document.querySelectorAll('.snap-section');
  const scrollIndicatorsContainer = document.querySelector('.scroll-indicators');
  
  if (!snapContainer || !snapSections.length) return;
  
  // Create scroll indicators if container exists
  if (scrollIndicatorsContainer) {
    // Clear any existing indicators
    scrollIndicatorsContainer.innerHTML = '';
    
    // Create indicators for each section
    snapSections.forEach((section, index) => {
      const indicator = document.createElement('div');
      indicator.classList.add('scroll-indicator');
      indicator.dataset.index = index;
      
      // Set first indicator as active
      if (index === 0) {
        indicator.classList.add('active');
      }
      
      // Click handler for indicators
      indicator.addEventListener('click', () => {
        section.scrollIntoView({ behavior: 'smooth' });
      });
      
      scrollIndicatorsContainer.appendChild(indicator);
    });
  }
  
  // Create scroll indicators container if it doesn't exist
  if (!scrollIndicatorsContainer) {
    const indicatorsContainer = document.createElement('div');
    indicatorsContainer.classList.add('scroll-indicators');
    
    snapSections.forEach((section, index) => {
      const indicator = document.createElement('div');
      indicator.classList.add('scroll-indicator');
      indicator.dataset.index = index;
      
      if (index === 0) {
        indicator.classList.add('active');
      }
      
      indicator.addEventListener('click', () => {
        section.scrollIntoView({ behavior: 'smooth' });
      });
      
      indicatorsContainer.appendChild(indicator);
    });
    
    document.body.appendChild(indicatorsContainer);
  }
  
  // Create scroll down indicator for the first section
  const firstSection = snapSections[0];
  if (firstSection) {
    const scrollDownIndicator = document.createElement('div');
    scrollDownIndicator.classList.add('scroll-down-indicator');
    
    const scrollDot = document.createElement('div');
    scrollDot.classList.add('scroll-down-dot');
    
    scrollDownIndicator.appendChild(scrollDot);
    
    scrollDownIndicator.addEventListener('click', () => {
      if (snapSections[1]) {
        snapSections[1].scrollIntoView({ behavior: 'smooth' });
      }
    });
    
    firstSection.appendChild(scrollDownIndicator);
  }
  
  // Set first section as active
  if (snapSections[0]) {
    snapSections[0].classList.add('active');
  }
  
  // Intersection Observer to track active section
  const observerOptions = {
    root: snapContainer,
    threshold: 0.5,
    rootMargin: '0px'
  };
  
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const targetIndex = Array.from(snapSections).indexOf(entry.target);
      const indicators = document.querySelectorAll('.scroll-indicator');
      
      if (entry.isIntersecting) {
        // Update active section
        snapSections.forEach(section => section.classList.remove('active'));
        entry.target.classList.add('active');
        
        // Update active indicator
        if (indicators.length) {
          indicators.forEach(indicator => indicator.classList.remove('active'));
          if (indicators[targetIndex]) {
            indicators[targetIndex].classList.add('active');
          }
        }
      }
    });
  }, observerOptions);
  
  // Observe all sections
  snapSections.forEach(section => {
    sectionObserver.observe(section);
  });
  
  // Handle keyboard navigation
  document.addEventListener('keydown', (e) => {
    const activeSection = document.querySelector('.snap-section.active');
    if (!activeSection) return;
    
    const currentIndex = Array.from(snapSections).indexOf(activeSection);
    let targetIndex;
    
    // Arrow up or Page up
    if (e.key === 'ArrowUp' || e.key === 'PageUp') {
      targetIndex = Math.max(0, currentIndex - 1);
      e.preventDefault();
    }
    // Arrow down or Page down
    else if (e.key === 'ArrowDown' || e.key === 'PageDown') {
      targetIndex = Math.min(snapSections.length - 1, currentIndex + 1);
      e.preventDefault();
    }
    // Home key
    else if (e.key === 'Home') {
      targetIndex = 0;
      e.preventDefault();
    }
    // End key
    else if (e.key === 'End') {
      targetIndex = snapSections.length - 1;
      e.preventDefault();
    }
    
    if (targetIndex !== undefined && snapSections[targetIndex]) {
      snapSections[targetIndex].scrollIntoView({ behavior: 'smooth' });
    }
  });
}); 