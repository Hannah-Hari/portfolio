/**
 * Portfolio Website - Snap Scrolling Implementation
 * Handles smooth section navigation with keyboard, scroll events and indicators
 */

document.addEventListener('DOMContentLoaded', () => {
    // Elements
    const sections = document.querySelectorAll('.snap-section');
    const container = document.querySelector('.snap-container');
    let scrollIndicatorsContainer = document.querySelector('.scroll-indicators');
    
    // If no sections, don't proceed
    if (!sections.length) return;

    // Create scroll indicators if they don't exist
    if (!scrollIndicatorsContainer) {
        const indicatorsHTML = `
            <div class="scroll-indicators">
                ${Array.from(sections).map((_, index) => 
                    `<div class="scroll-indicator" data-index="${index}"></div>`
                ).join('')}
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', indicatorsHTML);
        scrollIndicatorsContainer = document.querySelector('.scroll-indicators');
    }
    
    // Get indicators after creation
    const indicators = document.querySelectorAll('.scroll-indicator');
    
    // Set active section
    let activeIndex = 0;
    
    // Calculate header height dynamically
    const headerHeight = document.querySelector('.header').offsetHeight;
    document.documentElement.style.setProperty('--header-height', `${headerHeight}px`);
    
    // Update active section and indicators
    const updateActiveSection = (index) => {
        // Ensure index is within bounds
        if (index < 0) index = 0;
        if (index >= sections.length) index = sections.length - 1;
        
        // Update active index
        activeIndex = index;
        
        // Get section's position
        const section = sections[index];
        const sectionRect = section.getBoundingClientRect();
        const offsetTop = window.pageYOffset + sectionRect.top - headerHeight;
        
        // Scroll to section with precise offset
        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
        });
        
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
                // If section has content class, make it visible too
                const content = section.querySelector('.content');
                if (content) {
                    content.classList.add('visible');
                }
            } else {
                section.classList.remove('visible');
                // If section has content class, hide it
                const content = section.querySelector('.content');
                if (content) {
                    content.classList.remove('visible');
                }
            }
        });
    };
    
    // Initialize first section
    updateActiveSection(0);
    sections[0].classList.add('visible');
    const firstContent = sections[0].querySelector('.content');
    if (firstContent) {
        firstContent.classList.add('visible');
    }
    
    // Track last scroll time to prevent overlapping animations
    let lastScrollTime = 0;
    
    // More precise scroll detection for snapping
    const handleScroll = () => {
        // If we've recently updated, wait before handling another scroll
        const now = Date.now();
        if (now - lastScrollTime < 800) return;
        
        // If we've scrolled past the last section to the footer, don't update
        const lastSectionBottom = sections[sections.length - 1].getBoundingClientRect().bottom;
        if (lastSectionBottom < 0) return;
        
        // Find which section is most visible
        let mostVisibleIndex = 0;
        let maxVisibility = 0;
        
        sections.forEach((section, index) => {
            const rect = section.getBoundingClientRect();
            const windowHeight = window.innerHeight;
            
            // Calculate how much of the section is visible
            const visibleTop = Math.max(0, rect.top);
            const visibleBottom = Math.min(windowHeight, rect.bottom);
            const visibleHeight = Math.max(0, visibleBottom - visibleTop);
            
            // Calculate percentage of section visible
            const visibility = visibleHeight / rect.height;
            
            // Give preference to sections that are near the center of the viewport
            const centerPosition = (rect.top + rect.bottom) / 2;
            const distanceFromCenter = Math.abs(centerPosition - (windowHeight / 2));
            const centerBonus = 1 - (distanceFromCenter / (windowHeight / 2)) * 0.3;
            
            const adjustedVisibility = visibility * centerBonus;
            
            if (adjustedVisibility > maxVisibility) {
                maxVisibility = adjustedVisibility;
                mostVisibleIndex = index;
            }
        });
        
        // Update if changed
        if (mostVisibleIndex !== activeIndex) {
            activeIndex = mostVisibleIndex;
            updateActiveSection(activeIndex);
            lastScrollTime = now;
        }
    };
    
    // Use both scroll and intersection observer for better precision
    window.addEventListener('scroll', () => {
        // Use requestAnimationFrame for better performance
        requestAnimationFrame(handleScroll);
    });
    
    // Set up intersection observer for backup detection
    const observerOptions = {
        threshold: 0.5,
        rootMargin: `-${headerHeight}px 0px 0px 0px`
    };
    
    const sectionObserver = new IntersectionObserver((entries) => {
        // Only process if we haven't recently handled a scroll
        const now = Date.now();
        if (now - lastScrollTime < 800) return;
        
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const sectionIndex = Array.from(sections).indexOf(entry.target);
                if (sectionIndex !== activeIndex) {
                    activeIndex = sectionIndex;
                    updateActiveSection(activeIndex);
                    lastScrollTime = now;
                }
            }
        });
    }, observerOptions);
    
    sections.forEach(section => {
        sectionObserver.observe(section);
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
        // If we've scrolled past the last section to the footer, don't prevent scrolling
        const lastSectionBottom = sections[sections.length - 1].getBoundingClientRect().bottom;
        if (lastSectionBottom < 0 && e.deltaY > 0) return;
        
        // Prevent default only when we're handling the scroll
        if (isScrolling) {
            e.preventDefault();
            return;
        }
        
        clearTimeout(wheelTimeout);
        
        // Determine scroll direction
        const direction = e.deltaY > 0 ? 1 : -1;
        
        // If scrolling down on the last section, allow normal scrolling to the footer
        if (direction > 0 && activeIndex === sections.length - 1) {
            const lastSection = sections[sections.length - 1];
            const rect = lastSection.getBoundingClientRect();
            
            // If we're at the bottom of the last section, allow scrolling to the footer
            if (rect.bottom <= window.innerHeight + 10) return;
        }
        
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
    
    // Handle touch events for mobile
    let touchStartY = 0;
    let touchEndY = 0;
    const minSwipeDistance = 50; // Minimum distance required for swipe
    
    document.addEventListener('touchstart', (e) => {
        touchStartY = e.touches[0].clientY;
    }, { passive: true });
    
    document.addEventListener('touchend', (e) => {
        touchEndY = e.changedTouches[0].clientY;
        handleSwipe();
    }, { passive: true });
    
    function handleSwipe() {
        const diffY = touchStartY - touchEndY;
        
        // Only respond to significant swipes
        if (Math.abs(diffY) < minSwipeDistance) return;
        
        // If we've scrolled past the last section to the footer, don't prevent scrolling
        const lastSectionBottom = sections[sections.length - 1].getBoundingClientRect().bottom;
        if (lastSectionBottom < 0 && diffY > 0) return;
        
        // Swipe up (negative diff) moves to next section
        if (diffY > 0) {
            updateActiveSection(activeIndex + 1);
        } 
        // Swipe down (positive diff) moves to previous section
        else {
            updateActiveSection(activeIndex - 1);
        }
    }
    
    // Update on resize for responsive adjustments
    window.addEventListener('resize', () => {
        // Recalculate header height
        const newHeaderHeight = document.querySelector('.header').offsetHeight;
        document.documentElement.style.setProperty('--header-height', `${newHeaderHeight}px`);
        
        // Update current section position
        updateActiveSection(activeIndex);
    });
}); 