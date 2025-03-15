// main.js
import { initThemeToggle } from './themeToggle.js';

document.addEventListener('DOMContentLoaded', function() {
    // Initialize theme toggle functionality
    initThemeToggle();
    // ===== Timeline Animation =====
    initTimelineAnimation();

    // ===== Scroll Animations =====
    initScrollAnimations();
});
/**
 * Initializes timeline animation
 * Adds fade-in effect to timeline items
 */
function initTimelineAnimation() {
    const timelineItems = document.querySelectorAll('.timeline-item');

    timelineItems.forEach((item, index) => {
        // Add staggered animation delay
        item.style.animationDelay = `${index * 0.2}s`;

        // Add animation class
        item.classList.add('fade-in');
    });
}

/**
 * Initializes scroll animations
 * Adds fade-in effect to elements as they enter the viewport
 */
function initScrollAnimations() {
    const fadeElements = document.querySelectorAll('.fade-in');

    // Initial check for elements in viewport
    checkFadeElements();

    // Check elements on scroll
    window.addEventListener('scroll', checkFadeElements);

    /**
     * Checks if fade elements are in viewport and adds visible class
     */
    function checkFadeElements() {
        const triggerBottom = window.innerHeight * 0.8;

        fadeElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;

            if (elementTop < triggerBottom) {
                element.classList.add('visible');
            }
        });
    }
}