/**
 * Portfolio Website - Sections Functionality
 * Handles specific interactive elements for each section
 */

document.addEventListener('DOMContentLoaded', () => {
    initServiceItems();
    initClientLogos();
    initTestimonialSlider();
    initPortfolioItems();
    initAnchorLinks();
});

// Handle service items hover effects and animations
function initServiceItems() {
    const serviceItems = document.querySelectorAll('.service-item');
    
    serviceItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            const icon = item.querySelector('.service-icon svg');
            if (icon) {
                icon.classList.add('pulse');
                
                // Remove class after animation completes
                setTimeout(() => {
                    icon.classList.remove('pulse');
                }, 1000);
            }
        });
    });
}

// Handle client logos animation and duplication for infinite scroll
function initClientLogos() {
    const logoTrack = document.querySelector('.logos-track');
    
    if (logoTrack) {
        // Clone logos to create infinite scroll effect
        const logoItems = logoTrack.querySelectorAll('.logo-item');
        
        if (logoItems.length > 0) {
            // Clone all logo items and append to track
            logoItems.forEach(item => {
                const clone = item.cloneNode(true);
                logoTrack.appendChild(clone);
            });
        }
    }
}

// Initialize testimonial slider functionality
function initTestimonialSlider() {
    const track = document.querySelector('.testimonials-track');
    const cards = document.querySelectorAll('.testimonial-card');
    const prevBtn = document.querySelector('.testimonial-button.prev');
    const nextBtn = document.querySelector('.testimonial-button.next');
    
    if (!track || !cards.length || !prevBtn || !nextBtn) return;
    
    let currentIndex = 0;
    const visibleSlides = getVisibleSlides();
    const maxIndex = Math.max(0, cards.length - visibleSlides);
    
    // Initialize buttons state
    updateButtonState();
    
    // Add click events to buttons
    nextBtn.addEventListener('click', () => {
        if (currentIndex < maxIndex) {
            currentIndex++;
            updateSliderPosition();
        }
    });
    
    prevBtn.addEventListener('click', () => {
        if (currentIndex > 0) {
            currentIndex--;
            updateSliderPosition();
        }
    });
    
    // Update slider position
    function updateSliderPosition() {
        const cardWidth = cards[0].offsetWidth;
        const cardMargin = parseInt(window.getComputedStyle(cards[0]).marginRight) || 24;
        const offset = -(currentIndex * (cardWidth + cardMargin));
        track.style.transform = `translateX(${offset}px)`;
        updateButtonState();
    }
    
    // Update button states (disabled/enabled)
    function updateButtonState() {
        prevBtn.disabled = currentIndex === 0;
        nextBtn.disabled = currentIndex >= maxIndex;
        
        prevBtn.style.opacity = prevBtn.disabled ? 0.5 : 1;
        nextBtn.style.opacity = nextBtn.disabled ? 0.5 : 1;
    }
    
    // Get number of visible slides based on viewport width
    function getVisibleSlides() {
        const viewportWidth = window.innerWidth;
        if (viewportWidth >= 1200) return 3;
        if (viewportWidth >= 768) return 2;
        return 1;
    }
    
    // Handle window resize
    window.addEventListener('resize', () => {
        // Recalculate visible slides
        const newVisibleSlides = getVisibleSlides();
        const newMaxIndex = Math.max(0, cards.length - newVisibleSlides);
        
        // Adjust current index if needed
        if (currentIndex > newMaxIndex) {
            currentIndex = newMaxIndex;
        }
        
        // Update slider
        updateSliderPosition();
    });
}

// Add hover effects to portfolio items and handle "Load More" functionality
function initPortfolioItems() {
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    const loadMoreBtn = document.querySelector('.btn-load-more .circular-btn');
    
    // Only show first 6 items initially, hide the rest
    if (portfolioItems.length > 6) {
        // First ensure none have hidden class
        portfolioItems.forEach(item => {
            item.classList.remove('hidden');
        });
        
        // Then hide items beyond the first 6
        for (let i = 6; i < portfolioItems.length; i++) {
            portfolioItems[i].classList.add('hidden');
        }
    } else {
        // If we have 6 or fewer items, hide the load more button
        if (loadMoreBtn) {
            loadMoreBtn.parentElement.style.display = 'none';
        }
    }
    
    // Add hover effects to portfolio items
    portfolioItems.forEach(item => {
        const image = item.querySelector('.portfolio-image img');
        if (image) {
            item.addEventListener('mouseenter', () => {
                image.style.transform = 'scale(1.05)';
            });
            
            item.addEventListener('mouseleave', () => {
                image.style.transform = 'scale(1)';
            });
        }
    });
    
    // Handle "Load More" button click
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', () => {
            portfolioItems.forEach(item => {
                item.classList.remove('hidden');
            });
            loadMoreBtn.parentElement.style.display = 'none';
        });
    }
}

// Fix anchor links with smooth scrolling
function initAnchorLinks() {
    const navLinks = document.querySelectorAll('.nav-links a, .footer-nav a');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            const targetId = link.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                // Find the index of this section
                const sections = document.querySelectorAll('.snap-section');
                const sectionIndex = Array.from(sections).indexOf(targetSection);
                
                if (sectionIndex >= 0) {
                    // Use our scroll functionality
                    scrollToSection(sectionIndex);
                } else {
                    // Fallback to default behavior
                    targetSection.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    });
    
    // Scroll to section function
    function scrollToSection(index) {
        const sections = document.querySelectorAll('.snap-section');
        if (index >= 0 && index < sections.length) {
            sections[index].scrollIntoView({ behavior: 'smooth' });
            
            // Update active indicators
            const indicators = document.querySelectorAll('.scroll-indicator');
            indicators.forEach((indicator, i) => {
                if (i === index) {
                    indicator.classList.add('active');
                } else {
                    indicator.classList.remove('active');
                }
            });
            
            // Update visible classes
            sections.forEach((section, i) => {
                if (i === index) {
                    section.classList.add('visible');
                    const content = section.querySelector('.content');
                    if (content) content.classList.add('visible');
                } else {
                    section.classList.remove('visible');
                    const content = section.querySelector('.content');
                    if (content) content.classList.remove('visible');
                }
            });
        }
    }
}

// Add animations to CSS
document.addEventListener('DOMContentLoaded', () => {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.2); }
            100% { transform: scale(1); }
        }
        
        .pulse {
            animation: pulse 1s ease-in-out;
        }
        
        .testimonials-track {
            transition: transform 0.5s ease;
        }
        
        .portfolio-image img {
            transition: transform 0.4s ease;
        }
        
        .portfolio-item {
            transition: opacity 0.4s ease, transform 0.4s ease;
        }
        
        .portfolio-item.hidden {
            display: none;
        }
    `;
    document.head.appendChild(style);
}); 