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
    
    // ===== iOS Theme Fix =====
    initIOSThemeFix();
    
    // ===== Android Fix =====
    initAndroidFix();
    
    // ===== Force Mobile Nav Visibility =====
    forceMobileNavVisibility();
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
        const isClickOnMobileTheme = mobileThemeToggle && mobileThemeToggle.contains(event.target);

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

        // Ensure the nav links are visible
        if (navLinks.classList.contains('active')) {
            navLinks.style.display = 'flex';
            navLinks.style.opacity = '1';
            
            // Apply explicit styles to ensure visibility
            navLinks.style.backgroundColor = body.classList.contains('light-mode') ? 
                'var(--light-bg-color)' : 'var(--bg-color)';
                
            // Make links visible
            links.forEach(link => {
                link.style.color = body.classList.contains('light-mode') ? 
                    'var(--light-text-color)' : 'var(--text-color)';
                link.style.opacity = '1';
            });
        }

        // Show/hide mobile theme toggle
        if (mobileThemeToggle) {
            mobileThemeToggle.style.display = navLinks.classList.contains('active') ? 'block' : 'none';
        }
        
        // Force repaint on Android devices
        if (/Android/.test(navigator.userAgent)) {
            navLinks.style.display = 'none';
            void navLinks.offsetHeight;
            navLinks.style.display = 'flex';
        }
    }

    /**
     * Closes the mobile menu
     */
    function closeMobileMenu() {
        hamburgerMenu.classList.remove('active');
        navLinks.classList.remove('active');
        body.classList.remove('menu-open');
        if (mobileThemeToggle) {
            mobileThemeToggle.style.display = 'none';
        }
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

/**
 * Initializes fixes for iOS theme switching issues
 * Adds event listeners to handle iOS-specific theme rendering problems
 */
function initIOSThemeFix() {
    // Detect iOS device
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    
    if (isIOS) {
        // Add event listener for theme changes
        document.addEventListener('themeChanged', function() {
            // Force repaint on iOS by temporarily changing a CSS property
            document.body.style.display = 'none';
            // Force reflow
            void document.body.offsetHeight;
            document.body.style.display = '';
            
            // Force repaint on specific elements that might not update properly
            forceElementsRepaint();
        });
        
        // Also listen for class changes on body as a fallback
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.attributeName === 'class' && 
                    (mutation.target.classList.contains('light-mode') || 
                     !mutation.target.classList.contains('light-mode'))) {
                    forceElementsRepaint();
                }
            });
        });
        
        // Start observing the body for class changes
        observer.observe(document.body, { attributes: true });
    }
    
    /**
     * Forces a repaint on specific elements that might not update properly on iOS
     */
    function forceElementsRepaint() {
        const elementsToRepaint = [
            '.network-bg',
            '.node',
            '.connection',
            'section',
            '.timeline-item',
            '.skill-tag',
            '.contact-form',
            '.social-links',
            'nav'
        ];
        
        // First ensure network background is visible
        const networkBg = document.getElementById('networkBackground');
        if (networkBg) {
            networkBg.style.zIndex = '-1';
            
            // Force a more aggressive repaint on the network elements
            const nodes = document.querySelectorAll('.node');
            const connections = document.querySelectorAll('.connection');
            
            // Temporarily hide and show network elements
            [nodes, connections].forEach(elements => {
                elements.forEach(el => {
                    const originalOpacity = el.style.opacity || '';
                    el.style.opacity = '0';
                    void el.offsetHeight;
                    setTimeout(() => {
                        el.style.opacity = originalOpacity;
                    }, 50);
                });
            });
        }
        
        // Then repaint other elements
        elementsToRepaint.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(element => {
                // Save original display value
                const originalDisplay = window.getComputedStyle(element).display;
                // Force repaint by temporarily changing display
                element.style.display = 'none';
                // Force reflow
                void element.offsetHeight;
                // Restore original display
                element.style.display = originalDisplay;
            });
        });
    }
}

/**
 * Initializes fixes for Android devices
 */
function initAndroidFix() {
    // Detect Android device
    const isAndroid = /Android/.test(navigator.userAgent);
    
    if (isAndroid) {
        // Fix for navigation bar on Android
        const nav = document.querySelector('nav');
        const navLinks = document.getElementById('navLinks');
        
        if (nav) {
            // Ensure nav has proper background
            nav.style.backgroundColor = document.body.classList.contains('light-mode') ? 
                'var(--light-bg-color)' : 'var(--bg-color)';
        }
        
        if (navLinks) {
            // Ensure nav links have proper background
            navLinks.style.backgroundColor = document.body.classList.contains('light-mode') ? 
                'var(--light-bg-color)' : 'var(--bg-color)';
            
            // Ensure links are visible
            const links = navLinks.querySelectorAll('a');
            links.forEach(link => {
                link.style.color = document.body.classList.contains('light-mode') ? 
                    'var(--light-text-color)' : 'var(--text-color)';
            });
        }
        
        // Listen for theme changes
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.attributeName === 'class') {
                    const isLightMode = document.body.classList.contains('light-mode');
                    
                    if (nav) {
                        nav.style.backgroundColor = isLightMode ? 
                            'var(--light-bg-color)' : 'var(--bg-color)';
                    }
                    
                    if (navLinks) {
                        navLinks.style.backgroundColor = isLightMode ? 
                            'var(--light-bg-color)' : 'var(--bg-color)';
                        
                        const links = navLinks.querySelectorAll('a');
                        links.forEach(link => {
                            link.style.color = isLightMode ? 
                                'var(--light-text-color)' : 'var(--text-color)';
                        });
                    }
                }
            });
        });
        
        // Start observing the body for class changes
        observer.observe(document.body, { attributes: true });
    }
}

/**
 * Force mobile navigation visibility on problematic devices
 */
function forceMobileNavVisibility() {
    // Apply this fix for all mobile devices
    if (window.innerWidth <= 768) {
        const navLinks = document.getElementById('navLinks');
        const hamburgerMenu = document.getElementById('hamburgerMenu');
        
        if (navLinks && hamburgerMenu) {
            // Ensure hamburger menu is visible
            hamburgerMenu.style.display = 'flex';
            hamburgerMenu.style.opacity = '1';
            hamburgerMenu.style.zIndex = '101';
            
            // Ensure nav links are properly styled when inactive
            if (!navLinks.classList.contains('active')) {
                navLinks.style.right = '-100%';
                navLinks.style.display = 'flex';
                navLinks.style.flexDirection = 'column';
                navLinks.style.opacity = '1';
                navLinks.style.zIndex = '100';
            }
            
            // Add click event with timeout to ensure it works
            setTimeout(() => {
                hamburgerMenu.addEventListener('click', function forceToggle() {
                    // This is a backup in case the main toggle doesn't work
                    if (navLinks.classList.contains('active')) {
                        navLinks.style.right = '0';
                        navLinks.style.display = 'flex';
                    } else {
                        navLinks.style.right = '-100%';
                    }
                });
            }, 1000);
        }
    }
}