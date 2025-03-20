/**
 * Portfolio Website - Snap Scrolling Implementation
 * Handles smooth section navigation with keyboard, scroll events and indicators
 */

document.addEventListener('DOMContentLoaded', () => {
    // Elements
    const sections = document.querySelectorAll('.snap-section');
    const container = document.querySelector('.snap-container');
    const scrollIndicatorsContainer = document.querySelector('.scroll-indicators');
    
    // Create scroll indicators if they don't exist
    if (!scrollIndicatorsContainer && sections.length > 0) {
        const indicatorsHTML = `
            <div class="scroll-indicators">
                ${Array.from(sections).map((_, index) => 
                    `<div class="scroll-indicator" data-index="${index}"></div>`
                ).join('')}
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', indicatorsHTML);
    }
    
    // Get indicators after creation
    const indicators = document.querySelectorAll('.scroll-indicator');
    
    // Set active section
    let activeIndex = 0;
    
    // Update active section and indicators
    const updateActiveSection = (index) => {
        // Ensure index is within bounds
        if (index < 0) index = 0;
        if (index >= sections.length) index = sections.length - 1;
        
        // Update active index
        activeIndex = index;
        
        // Scroll to section
        sections[index].scrollIntoView({ behavior: 'smooth' });
        
        // Update indicators
        indicators.forEach((indicator, i) => {
            if (i === index) {
                indicator.classList.add('active');
            } else {
                indicator.classList.remove('active');
            }
        });
        
        // Add visible class to current section for animations
        sections.forEach((section, i) => {
            if (i === index) {
                section.classList.add('visible');
            } else {
                section.classList.remove('visible');
            }
        });
    };
    
    // Initialize first section
    updateActiveSection(0);
    
    // Scroll event handling with debounce
    let scrollTimeout;
    window.addEventListener('scroll', () => {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            // Find which section is most visible
            let mostVisibleIndex = 0;
            let maxVisibility = 0;
            
            sections.forEach((section, index) => {
                const rect = section.getBoundingClientRect();
                const windowHeight = window.innerHeight;
                
                // Calculate how much of the section is visible
                const visibleHeight = Math.min(rect.bottom, windowHeight) - Math.max(rect.top, 0);
                const visibility = visibleHeight / section.offsetHeight;
                
                if (visibility > maxVisibility) {
                    maxVisibility = visibility;
                    mostVisibleIndex = index;
                }
            });
            
            // Update if changed
            if (mostVisibleIndex !== activeIndex) {
                activeIndex = mostVisibleIndex;
                updateActiveSection(activeIndex);
            }
        }, 100);
    });
    
    // Click on indicators
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            updateActiveSection(index);
        });
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowDown' || e.key === 'PageDown') {
            updateActiveSection(activeIndex + 1);
            e.preventDefault();
        } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
            updateActiveSection(activeIndex - 1);
            e.preventDefault();
        } else if (e.key === 'Home') {
            updateActiveSection(0);
            e.preventDefault();
        } else if (e.key === 'End') {
            updateActiveSection(sections.length - 1);
            e.preventDefault();
        }
    });
    
    // Handle wheel events for more control
    let wheelTimeout;
    let isScrolling = false;
    
    window.addEventListener('wheel', (e) => {
        // Prevent default only when we're handling the scroll
        if (isScrolling) {
            e.preventDefault();
            return;
        }
        
        clearTimeout(wheelTimeout);
        
        // Determine scroll direction
        const direction = e.deltaY > 0 ? 1 : -1;
        
        // Set scrolling flag
        isScrolling = true;
        
        // Update section
        updateActiveSection(activeIndex + direction);
        
        // Prevent multiple scrolls
        wheelTimeout = setTimeout(() => {
            isScrolling = false;
        }, 800); // Adjust timing based on your scroll animation duration
        
        e.preventDefault();
    }, { passive: false });
}); 