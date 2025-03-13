document.addEventListener('DOMContentLoaded', function() {
    // ===== Mobile Navigation Functionality =====
    initMobileNavigation();
    
    // ===== Timeline Animation =====
    initTimelineAnimation();
    
    // ===== Scroll Animations =====
    initScrollAnimations();
    
    // ===== Platform-specific Fixes =====
    initIOSThemeFix();
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
            
            // Smooth scroll to section
            const href = this.getAttribute('href');
            if (href.startsWith('#')) {
                e.preventDefault();
                const targetSection = document.querySelector(href);
                if (targetSection) {
                    targetSection.scrollIntoView({ behavior: 'smooth' });
                }
            }
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
            
            // Add animation to links
            links.forEach((link, index) => {
                link.style.animation = `fadeIn 0.3s ease forwards ${0.1 + index * 0.1}s`;
                link.style.opacity = '0';
                link.style.transform = 'translateY(10px)';
            });
        } else {
            // Reset animations when closing
            links.forEach(link => {
                link.style.animation = '';
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
        
        // Reset animations
        links.forEach(link => {
            link.style.animation = '';
        });
    }
}

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

/**
 * Initializes iOS-specific theme fixes
 * Addresses rendering issues on iOS devices
 */
function initIOSThemeFix() {
    // Check if device is iOS
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    
    if (isIOS) {
        // Listen for theme changes
        document.addEventListener('themeChanged', function(e) {
            // Force repaint of elements
            forceElementsRepaint();
        });
        
        // Initial repaint
        forceElementsRepaint();
    }
    
    /**
     * Forces a repaint of elements to fix iOS rendering issues
     */
    function forceElementsRepaint() {
        // Elements that need repainting
        const elements = [
            document.querySelectorAll('nav'),
            document.querySelectorAll('.nav-links'),
            document.querySelectorAll('.timeline-item'),
            document.querySelectorAll('.timeline-content'),
            document.querySelectorAll('.skill-tag'),
            document.querySelectorAll('.button'),
            document.querySelectorAll('.theme-toggle'),
            document.querySelectorAll('.theme-toggle-slider'),
            document.querySelectorAll('.hamburger-menu'),
            document.querySelectorAll('.hamburger-menu span')
        ];
        
        // Flatten array and remove duplicates
        const allElements = [...new Set(elements.flat())];
        
        // Force repaint by temporarily changing display
        allElements.forEach(el => {
            if (el) {
                const originalDisplay = el.style.display;
                el.style.display = 'none';
                void el.offsetHeight; // Force reflow
                el.style.display = originalDisplay;
            }
        });
        
        // Additional fix for nav links
        const navLinks = document.getElementById('navLinks');
        if (navLinks) {
            navLinks.style.transition = 'none';
            void navLinks.offsetHeight; // Force reflow
            navLinks.style.transition = '';
        }
    }
}

/**
 * Initializes Android-specific fixes
 * Addresses rendering issues on Android devices
 */
function initAndroidFix() {
    // Check if device is Android
    const isAndroid = /Android/.test(navigator.userAgent);
    
    if (isAndroid) {
        // Fix for hamburger menu
        const hamburgerMenu = document.getElementById('hamburgerMenu');
        const navLinks = document.getElementById('navLinks');
        
        if (hamburgerMenu && navLinks) {
            // Apply hardware acceleration
            hamburgerMenu.style.transform = 'translateZ(0)';
            navLinks.style.transform = 'translateZ(0)';
            
            // Fix for menu toggle
            hamburgerMenu.addEventListener('click', function() {
                // Force repaint
                navLinks.style.display = 'none';
                void navLinks.offsetHeight;
                navLinks.style.display = navLinks.classList.contains('active') ? 'flex' : 'none';
            });
        }
        
        // Fix for theme toggle
        const themeToggles = document.querySelectorAll('.theme-toggle');
        themeToggles.forEach(toggle => {
            toggle.style.transform = 'translateZ(0)';
        });
        
        // Listen for theme changes
        document.addEventListener('themeChanged', function() {
            // Force repaint
            document.body.style.display = 'none';
            void document.body.offsetHeight;
            document.body.style.display = '';
        });
    }
}

/**
 * Forces mobile navigation visibility
 * Ensures mobile menu is visible and properly styled
 */
function forceMobileNavVisibility() {
    const navLinks = document.getElementById('navLinks');
    const hamburgerMenu = document.getElementById('hamburgerMenu');
    
    if (!navLinks || !hamburgerMenu) return;
    
    // Check if mobile view
    const isMobile = window.matchMedia('(max-width: 768px)').matches;
    
    if (isMobile) {
        // Ensure hamburger is visible
        hamburgerMenu.style.display = 'flex';
        
        // Reset nav links styles
        navLinks.style.position = 'fixed';
        navLinks.style.top = '0';
        navLinks.style.right = navLinks.classList.contains('active') ? '0' : '-100%';
        navLinks.style.width = '100%';
        navLinks.style.height = '100vh';
        navLinks.style.backgroundColor = document.body.classList.contains('light-mode') ? 
            'var(--light-bg-color)' : 'var(--bg-color)';
        navLinks.style.flexDirection = 'column';
        navLinks.style.alignItems = 'flex-start';
        navLinks.style.padding = '5rem 2rem 2rem';
        navLinks.style.transition = 'right 0.3s var(--menu-transition-timing)';
        navLinks.style.zIndex = '99';
        
        // Style links
        const links = navLinks.querySelectorAll('a');
        links.forEach(link => {
            link.style.fontSize = '1.2rem';
            link.style.width = '100%';
            link.style.padding = '0.75rem 0';
            link.style.borderBottom = document.body.classList.contains('light-mode') ? 
                '1px solid rgba(0, 0, 0, 0.1)' : '1px solid rgba(255, 255, 255, 0.1)';
        });
        
        // Fix for hamburger menu
        hamburgerMenu.addEventListener('click', function forceToggle(e) {
            e.stopPropagation();
            
            // Toggle active class
            hamburgerMenu.classList.toggle('active');
            navLinks.classList.toggle('active');
            document.body.classList.toggle('menu-open');
            
            // Update styles
            navLinks.style.right = navLinks.classList.contains('active') ? '0' : '-100%';
            
            // Force visibility when active
            if (navLinks.classList.contains('active')) {
                navLinks.style.display = 'flex';
                
                // Ensure links are visible
                links.forEach(link => {
                    link.style.opacity = '1';
                    link.style.color = document.body.classList.contains('light-mode') ? 
                        'var(--light-text-color)' : 'var(--text-color)';
                });
            }
        }, { once: false });
    }
    
    // Listen for window resize
    window.addEventListener('resize', function() {
        const isMobileNow = window.matchMedia('(max-width: 768px)').matches;
        
        if (isMobileNow !== isMobile) {
            // Refresh page to reset styles
            location.reload();
        }
    });
}