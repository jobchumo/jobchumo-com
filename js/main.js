/**
 * Main JavaScript file for Job Chumo's portfolio website
 * Handles mobile navigation, animations, and UI interactions
 */

document.addEventListener('DOMContentLoaded', function() {
    // ===== Mobile Navigation Functionality =====
    initMobileNavigation();
    
    // ===== Timeline Animation =====
    initTimelineAnimation();
    
    // ===== Scroll Animations =====
    initScrollAnimations();
});

/**
 * Initializes mobile navigation functionality
 * Handles hamburger menu toggle, navigation links, and outside clicks
 */
function initMobileNavigation() {
    const hamburgerMenu = document.getElementById('hamburgerMenu');
    const navLinks = document.getElementById('navLinks');
    const body = document.body;
    const mobileThemeToggle = document.querySelector('.mobile-theme-toggle');

    if (!hamburgerMenu || !navLinks) return;

    // Toggle menu when hamburger is clicked
    hamburgerMenu.addEventListener('click', function(e) {
        e.stopPropagation();
        toggleMobileMenu();
    });

    // Close menu when clicking on a nav link
    const links = navLinks.querySelectorAll('a');
    links.forEach(link => {
        link.addEventListener('click', function() {
            closeMobileMenu();
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', function(event) {
        const isClickInsideNav = navLinks.contains(event.target);
        const isClickOnHamburger = hamburgerMenu.contains(event.target);
        const isClickOnMobileTheme = mobileThemeToggle.contains(event.target);

        if (!isClickInsideNav && !isClickOnHamburger && !isClickOnMobileTheme && navLinks.classList.contains('active')) {
            closeMobileMenu();
        }
    });

    /**
     * Toggles the mobile menu open/closed state
     */
    function toggleMobileMenu() {
        hamburgerMenu.classList.toggle('active');
        navLinks.classList.toggle('active');
        body.classList.toggle('menu-open');

        // Show/hide mobile theme toggle
        mobileThemeToggle.style.display = navLinks.classList.contains('active') ? 'block' : 'none';
    }

    /**
     * Closes the mobile menu
     */
    function closeMobileMenu() {
        hamburgerMenu.classList.remove('active');
        navLinks.classList.remove('active');
        body.classList.remove('menu-open');
        mobileThemeToggle.style.display = 'none';
    }
}

/**
 * Initializes timeline animation with sequential delays
 */
function initTimelineAnimation() {
    const timelineItems = document.querySelectorAll('.timeline-item');
    let delay = 0;
    
    timelineItems.forEach(item => {
        setTimeout(() => {
            item.style.animationDelay = `${delay}ms`;
            item.style.animationPlayState = 'running';
        }, delay);
        delay += 300; // Increment delay for each item
    });
}

/**
 * Initializes scroll-based animations using Intersection Observer
 */
function initScrollAnimations() {
    const fadeElements = document.querySelectorAll('.fade-in');
    
    // Create an observer instance
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1 // Trigger when at least 10% of the element is visible
    });
    
    // Start observing each fade element
    fadeElements.forEach(element => {
        observer.observe(element);
    });
}