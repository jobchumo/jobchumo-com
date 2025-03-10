document.addEventListener('DOMContentLoaded', function() {
    const desktopThemeToggle = document.getElementById('themeToggleCheckbox');
    const mobileThemeToggle = document.getElementById('mobileThemeToggleCheckbox');
    const body = document.body;
    
    // Check if user has previously set a theme preference
    const savedTheme = localStorage.getItem('theme');
    
    // Set initial theme based on saved preference
    if (savedTheme === 'light') {
        body.classList.add('light-mode');
        desktopThemeToggle.checked = true;
        mobileThemeToggle.checked = true;
    }
    
    // Function to toggle theme
    function toggleTheme() {
        body.classList.toggle('light-mode');
        
        // Sync both toggle switches
        const isLightMode = body.classList.contains('light-mode');
        desktopThemeToggle.checked = isLightMode;
        mobileThemeToggle.checked = isLightMode;
        
        // Save preference to localStorage
        localStorage.setItem('theme', isLightMode ? 'light' : 'dark');
    }
    
    // Add event listeners to both toggle switches
    desktopThemeToggle.addEventListener('change', toggleTheme);
    mobileThemeToggle.addEventListener('change', toggleTheme);
    
    // Add media query for responsive design
    const mediaQuery = window.matchMedia('(max-width: 768px)');
    
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
    
    // Initial call
    handleScreenSizeChange(mediaQuery);
    
    // Add listener for screen size changes
    mediaQuery.addEventListener('change', handleScreenSizeChange);
});