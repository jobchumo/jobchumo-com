document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const desktopThemeToggle = document.getElementById('themeToggleCheckbox');
    const mobileThemeToggle = document.getElementById('mobileThemeToggleCheckbox');
    const body = document.body;
    
    // Initialize theme based on saved preference or system preference
    initTheme();
    
    // Add event listeners
    setupEventListeners();
    
    // Handle responsive design
    setupResponsiveToggle();
    
    /**
     * Initializes theme based on user's saved preference or system preference
     */
    function initTheme() {
        // Check if user has previously set a theme preference
        const savedTheme = localStorage.getItem('theme');
        
        // Check system preference if no saved theme
        if (!savedTheme) {
            const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
            if (!prefersDarkMode) {
                body.classList.add('light-mode');
                desktopThemeToggle.checked = true;
                mobileThemeToggle.checked = true;
                updateNetworkAnimationTheme(true);
                localStorage.setItem('theme', 'light');
            } else {
                localStorage.setItem('theme', 'dark');
            }
        } 
        // Set initial theme based on saved preference
        else if (savedTheme === 'light') {
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
        
        // Listen for system preference changes
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function(e) {
            // Only apply if user hasn't set a preference
            if (!localStorage.getItem('theme')) {
                const isLightMode = !e.matches;
                body.classList.toggle('light-mode', isLightMode);
                desktopThemeToggle.checked = isLightMode;
                mobileThemeToggle.checked = isLightMode;
                updateNetworkAnimationTheme(isLightMode);
            }
        });
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
        
        // Force repaint on devices to ensure all elements update
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
                node.style.backgroundColor = 'var(--node-color)';
            }
        });
        
        // Update network connections
        const connections = document.querySelectorAll('.connection');
        connections.forEach(connection => {
            if (isLightMode) {
                connection.style.backgroundColor = 'var(--light-connection-color)';
            } else {
                connection.style.backgroundColor = 'var(--connection-color)';
            }
        });
        
        // Update particle network animation background
        const particleNetwork = document.querySelector('.particle-network-animation');
        if (particleNetwork) {
            particleNetwork.style.backgroundColor = isLightMode ? 
                'var(--light-bg-color)' : 'var(--bg-color)';
        }
    }
    
    /**
     * Forces a repaint on devices to ensure theme changes apply uniformly
     */
    function forceRepaint() {
        // Elements that need repainting
        const elements = [
            document.querySelectorAll('section'),
            document.querySelectorAll('nav'),
            document.querySelectorAll('.nav-links'),
            document.querySelectorAll('.button'),
            document.querySelectorAll('.theme-toggle'),
            document.querySelectorAll('.theme-toggle-slider'),
            document.querySelectorAll('.hamburger-menu'),
            document.querySelectorAll('.hamburger-menu span'),
            document.querySelectorAll('.timeline-item'),
            document.querySelectorAll('.skill-tag'),
            document.querySelectorAll('.particle-network-animation'),
            document.querySelectorAll('.glow')
        ];
        
        // Flatten array and remove duplicates
        const allElements = [...new Set(elements.flat())];
        
        // Force repaint by temporarily modifying a property
        allElements.forEach(element => {
            if (element) {
                const originalDisplay = element.style.display;
                element.style.display = 'none';
                // Force reflow
                void element.offsetHeight;
                element.style.display = originalDisplay;
            }
        });
        
        // Special handling for mobile navigation
        const navLinks = document.getElementById('navLinks');
        if (navLinks) {
            // Preserve active state
            const wasActive = navLinks.classList.contains('active');
            
            // Force repaint
            navLinks.style.transition = 'none';
            void navLinks.offsetHeight;
            navLinks.style.transition = 'right 0.3s var(--menu-transition-timing)';
            
            // Ensure proper styling based on active state
            if (wasActive) {
                navLinks.style.right = '0';
                navLinks.style.display = 'flex';
            }
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
        const mobileToggleContainer = document.querySelector('.mobile-theme-toggle');
        
        if (e.matches) {
            // On mobile, hide desktop toggle and show mobile toggle
            if (desktopToggleContainer) desktopToggleContainer.style.display = 'none';
            if (mobileToggleContainer) {
                mobileToggleContainer.style.display = 'block';
                // Only show if menu is active
                if (document.getElementById('navLinks').classList.contains('active')) {
                    mobileToggleContainer.style.display = 'block';
                } else {
                    mobileToggleContainer.style.display = 'none';
                }
            }
        } else {
            // On desktop, show desktop toggle and hide mobile toggle
            if (desktopToggleContainer) desktopToggleContainer.style.display = 'block';
            if (mobileToggleContainer) mobileToggleContainer.style.display = 'none';
        }
    }
});