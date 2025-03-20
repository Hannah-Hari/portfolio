/**
 * Portfolio Website - Sections Functionality
 * Handles specific interactive elements for each section
 */

// Initialize all section-specific functionality
document.addEventListener('DOMContentLoaded', () => {
    initServiceItems();
    initClientLogos();
});

// Handle service items hover effects and animations
function initServiceItems() {
    const serviceItems = document.querySelectorAll('.service-item');
    
    serviceItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            const icon = item.querySelector('.service-icon i');
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

// Add a pulse animation to CSS
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
    `;
    document.head.appendChild(style);
}); 