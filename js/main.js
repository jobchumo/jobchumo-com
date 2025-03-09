document.addEventListener('DOMContentLoaded', function() {
    // Hamburger menu functionality
    const hamburgerMenu = document.getElementById('hamburgerMenu');
    const navLinks = document.getElementById('navLinks');
    const body = document.body;
    const mobileThemeToggle = document.querySelector('.mobile-theme-toggle');

    if (hamburgerMenu && navLinks) {
        // Toggle menu when hamburger is clicked
        hamburgerMenu.addEventListener('click', function(e) {
            e.stopPropagation();
            hamburgerMenu.classList.toggle('active');
            navLinks.classList.toggle('active');
            body.classList.toggle('menu-open');

            // Show/hide mobile theme toggle
            if (navLinks.classList.contains('active')) {
                mobileThemeToggle.style.display = 'block';
            } else {
                mobileThemeToggle.style.display = 'none';
            }
        });

        // Close menu when clicking on a nav link
        const links = navLinks.querySelectorAll('a');
        links.forEach(link => {
            link.addEventListener('click', function() {
                hamburgerMenu.classList.remove('active');
                navLinks.classList.remove('active');
                body.classList.remove('menu-open');
                mobileThemeToggle.style.display = 'none';
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            const isClickInsideNav = navLinks.contains(event.target);
            const isClickOnHamburger = hamburgerMenu.contains(event.target);
            const isClickOnMobileTheme = mobileThemeToggle.contains(event.target);

            if (!isClickInsideNav && !isClickOnHamburger && !isClickOnMobileTheme && navLinks.classList.contains('active')) {
                hamburgerMenu.classList.remove('active');
                navLinks.classList.remove('active');
                body.classList.remove('menu-open');
                mobileThemeToggle.style.display = 'none';
            }
        });
    }
});