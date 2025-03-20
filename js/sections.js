/**
 * Portfolio Website - Sections Functionality
 * Handles specific interactive elements for each section
 */

document.addEventListener('DOMContentLoaded', () => {
    initServiceItems();
    initClientLogos();
    initTestimonialSlider();
    initPortfolioItems();
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
    const cardWidth = cards[0].offsetWidth;
    const cardMargin = 24; // margin between cards
    const totalCards = cards.length;
    
    // Initialize buttons state
    updateButtonState();
    
    // Add click events to buttons
    nextBtn.addEventListener('click', () => {
        if (currentIndex < totalCards - 1) {
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
        const offset = (cardWidth + cardMargin) * currentIndex * -1;
        track.style.transform = `translateX(${offset}px)`;
        updateButtonState();
    }
    
    // Update button states (disabled/enabled)
    function updateButtonState() {
        prevBtn.disabled = currentIndex === 0;
        nextBtn.disabled = currentIndex === totalCards - 1;
        
        prevBtn.style.opacity = prevBtn.disabled ? 0.5 : 1;
        nextBtn.style.opacity = nextBtn.disabled ? 0.5 : 1;
    }
    
    // Handle window resize
    window.addEventListener('resize', () => {
        // Reset position on resize
        track.style.transform = 'translateX(0)';
        currentIndex = 0;
        updateButtonState();
    });
}

// Add hover effects to portfolio items
function initPortfolioItems() {
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    
    portfolioItems.forEach(item => {
        // Remove hidden class if it exists
        if (item.classList.contains('hidden')) {
            item.classList.remove('hidden');
        }
        
        // Add hover effects
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
    
    // Handle "Load More" button
    const loadMoreBtn = document.querySelector('.btn-load-more .circular-btn');
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', () => {
            portfolioItems.forEach(item => {
                item.classList.remove('hidden');
            });
            loadMoreBtn.parentElement.style.display = 'none';
        });
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
    `;
    document.head.appendChild(style);
}); 