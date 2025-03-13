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
            updateNetworkAnimationTheme(true);
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
        
        // Update network animation theme
        updateNetworkAnimationTheme(isLightMode);
        
        // Force repaint on iOS devices to ensure all elements update
        forceRepaint();
        
        // Save preference to localStorage
        localStorage.setItem('theme', isLightMode ? 'light' : 'dark');
        
        // Dispatch custom event for theme change
        document.dispatchEvent(new CustomEvent('themeChanged', {
            detail: { isLightMode: isLightMode }
        }));
    }
    
    /**
     * Updates the network animation elements to match the current theme
     * @param {boolean} isLightMode - Whether light mode is active
     */
    function updateNetworkAnimationTheme(isLightMode) {
        // Update network nodes
        const nodes = document.querySelectorAll('.node');
        nodes.forEach(node => {
            if (isLightMode) {
                node.style.backgroundColor = 'var(--light-node-color)';
            } else {
                node.style.backgroundColor = '#ffffff';
            }
        });
        
        // Update network connections
        const connections = document.querySelectorAll('.connection');
        connections.forEach(connection => {
            if (isLightMode) {
                connection.style.backgroundColor = 'var(--light-connection-color)';
            } else {
                connection.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
            }
        });
    }
    
    /**
     * Forces a repaint on iOS devices to ensure theme changes apply uniformly
     */
    function forceRepaint() {
        // This technique forces a repaint by temporarily modifying a property
        const sections = document.querySelectorAll('section');
        sections.forEach(section => {
            const originalDisplay = section.style.display;
            section.style.display = 'none';
            // Force reflow
            void section.offsetHeight;
            section.style.display = originalDisplay;
        });
        
        // Also force repaint on the network background
        const networkBg = document.getElementById('networkBackground');
        if (networkBg) {
            const originalDisplay = networkBg.style.display;
            networkBg.style.display = 'none';
            void networkBg.offsetHeight;
            networkBg.style.display = originalDisplay;
        }
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