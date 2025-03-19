// themeToggle.js
export function initThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    const mobileThemeToggle = document.getElementById('mobileThemeToggle');
    const body = document.body;

    // Check for saved theme preference or use preferred color scheme
    const savedTheme = localStorage.getItem('theme');

    if (savedTheme === 'light') {
        body.classList.add('light-mode');
        themeToggle.checked = true;
        mobileThemeToggle.checked = true;
    } else if (savedTheme === 'dark') {
        body.classList.remove('light-mode');
        themeToggle.checked = false;
        mobileThemeToggle.checked = false;
    } else {
        // If no saved preference, check system preference
        const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
        if (!prefersDarkScheme.matches) {
            body.classList.add('light-mode');
            themeToggle.checked = true;
            mobileThemeToggle.checked = true;
        }
    }

    // Toggle theme when the checkbox is clicked
    themeToggle.addEventListener('change', function() {
        if (this.checked) {
            body.classList.add('light-mode');
            localStorage.setItem('theme', 'light');
        } else {
            body.classList.remove('light-mode');
            localStorage.setItem('theme', 'dark');
        }
    });

    mobileThemeToggle.addEventListener('change', function() {
        if (this.checked) {
            body.classList.add('light-mode');
            localStorage.setItem('theme', 'light');
        } else {
            body.classList.remove('light-mode');
            localStorage.setItem('theme', 'dark');
        }
    });
}