// Mobile Navigation Menu Functionality

document.addEventListener('DOMContentLoaded', function() {
    const hamburgerCheckbox = document.getElementById('hamburgerToggle');
    const overlay = document.getElementById('mobileNav');
    
    // Toggle the navigation menu when the hamburger is clicked
    hamburgerCheckbox.addEventListener('change', function() {
        if (this.checked) {
            openNav();
        } else {
            closeNav();
        }
    });
    
    // Close the navigation menu when a link is clicked
    const navLinks = document.querySelectorAll('.overlay-content a');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            closeNav();
            hamburgerCheckbox.checked = false;
        });
    });
    
    // Function to open the navigation menu
    function openNav() {
        overlay.style.width = "100%";
        overlay.classList.add('open');
        document.body.classList.add('menu-open');
    }
    
    // Function to close the navigation menu
    function closeNav() {
        overlay.style.width = "0%";
        overlay.classList.remove('open');
        document.body.classList.remove('menu-open');
    }
    
    // Sync theme toggle between desktop and mobile
    const desktopThemeToggle = document.getElementById('themeToggle');
    const mobileThemeToggle = document.getElementById('mobileThemeToggle');
    
    if (desktopThemeToggle && mobileThemeToggle) {
        // Sync initial state
        mobileThemeToggle.checked = desktopThemeToggle.checked;
        
        // Sync when desktop toggle changes
        desktopThemeToggle.addEventListener('change', function() {
            mobileThemeToggle.checked = this.checked;
        });
        
        // Sync when mobile toggle changes
        mobileThemeToggle.addEventListener('change', function() {
            desktopThemeToggle.checked = this.checked;
            // Trigger the theme change event
            const event = new Event('change');
            desktopThemeToggle.dispatchEvent(event);
        });
    }
}); 