// themeToggle.js
export function initThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    const body = document.body;

    // Check for saved theme preference or use preferred color scheme
    const savedTheme = localStorage.getItem('theme');

    if (savedTheme === 'light') {
        body.classList.add('light-mode');
        themeToggle.checked = true;
    } else if (savedTheme === 'dark') {
        body.classList.remove('light-mode');
        themeToggle.checked = false;
    } else {
        // If no saved preference, check system preference
        const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
        if (!prefersDarkScheme.matches) {
            body.classList.add('light-mode');
            themeToggle.checked = true;
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
}