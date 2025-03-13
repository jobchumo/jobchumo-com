/**
 * Theme Toggle Functionality
 * Handles switching between light and dark themes with user preference persistence
 */

document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const desktopThemeToggle = document.getElementById('themeToggleCheckbox');
    const mobileThemeToggle = document.getElementById('mobileThemeToggleCheckbox');
    const body = document.body;
    
    // Initialize theme based on saved preference
    initTheme();
    
    // Add event listeners
    setupEventListeners();
    
    // Handle responsive design
    setupResponsiveToggle();
    
    /**
     * Initializes theme based on user's saved preference
     */
    function initTheme() {
        // Check if user has previously set a theme preference
        const savedTheme = localStorage.getItem('theme');
        
        // Set initial theme based on saved preference
        if (savedTheme === 'light') {
            body.classList.add('light-mode');
            desktopThemeToggle.checked = true;
            mobileThemeToggle.checked = true;
        }
    }
    
    /**
     * Sets up event listeners for theme toggles
     */
    function setupEventListeners() {
        // Add event listeners to both toggle switches
        desktopThemeToggle.addEventListener('change', toggleTheme);
        mobileThemeToggle.addEventListener('change', toggleTheme);
    }
    
    /**
     * Toggles between light and dark themes
     * Updates UI and saves preference to localStorage
     */
    function toggleTheme() {
        // Toggle the light-mode class on the body
        body.classList.toggle('light-mode');
        
        // Sync both toggle switches
        const isLightMode = body.classList.contains('light-mode');
        desktopThemeToggle.checked = isLightMode;
        mobileThemeToggle.checked = isLightMode;
        
        // Save preference to localStorage
        localStorage.setItem('theme', isLightMode ? 'light' : 'dark');
    }
    
    /**
     * Sets up responsive behavior for theme toggles
     * Shows/hides appropriate toggle based on screen size
     */
    function setupResponsiveToggle() {
        const mediaQuery = window.matchMedia('(max-width: 768px)');
        
        // Initial call
        handleScreenSizeChange(mediaQuery);
        
        // Add listener for screen size changes
        mediaQuery.addEventListener('change', handleScreenSizeChange);
    }
    
    /**
     * Handles visibility of theme toggles based on screen size
     * @param {MediaQueryListEvent} e - Media query event
     */
    function handleScreenSizeChange(e) {
        const desktopToggleContainer = document.getElementById('desktopThemeToggle');
        
        if (e.matches) {
            // On mobile, hide desktop toggle
            desktopToggleContainer.style.display = 'none';
        } else {
            // On desktop, show desktop toggle and hide mobile toggle
            desktopToggleContainer.style.display = 'block';
            document.querySelector('.mobile-theme-toggle').style.display = 'none';
        }
    }
});