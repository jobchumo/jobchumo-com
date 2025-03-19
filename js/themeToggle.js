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
            if (isIphone()) {
                repaintAllElements();
            }
        } else {
            body.classList.remove('light-mode');
            localStorage.setItem('theme', 'dark');
            if (isIphone()) {
                repaintAllElements();
            }
        }
    });

    mobileThemeToggle.addEventListener('change', function() {
        if (this.checked) {
            body.classList.add('light-mode');
            localStorage.setItem('theme', 'light');
            if (isIphone()) {
                repaintAllElements();
            } else {
                forceRepaint();
            }
        } else {
            body.classList.remove('light-mode');
            localStorage.setItem('theme', 'dark');
            if (isIphone()) {
                repaintAllElements();
            }
        }
    });

    // Check if device is an iPhone
    function isIphone() {
        return /iPhone/i.test(navigator.userAgent);
    }

    // Force repaint for sections (existing function)
    function forceRepaint() {
        const sections = document.querySelectorAll('section');
        sections.forEach(section => {
            const originalDisplay = section.style.display;
            section.style.display = 'none';
            // Force reflow
            void section.offsetHeight;
            section.style.display = originalDisplay;
        });
    }

    // Comprehensive repaint for iPhones
    function repaintAllElements() {
        console.log("iPhone detected - performing comprehensive repaint");
        
        // Repaint all major components
        const elements = [
            ...document.querySelectorAll('section'),
            ...document.querySelectorAll('.timeline-item'),
            ...document.querySelectorAll('.skill-list'),
            ...document.querySelectorAll('.skill-tag'),
            ...document.querySelectorAll('.fade-in'),
            ...document.querySelectorAll('nav'),
            ...document.querySelectorAll('.form-group'),
            ...document.querySelectorAll('input'),
            ...document.querySelectorAll('textarea'),
            ...document.querySelectorAll('.button'),
            ...document.querySelectorAll('.social-link')
        ];
        
        // Force repaint by temporarily adjusting styles
        elements.forEach(element => {
            if (!element) return;
            
            const originalDisplay = element.style.display;
            const originalOpacity = element.style.opacity;
            
            // Force reflow with display change
            element.style.display = 'none';
            void element.offsetHeight;
            element.style.display = originalDisplay;
            
            // Additional opacity trick for smoother transitions
            element.style.opacity = '0.99';
            setTimeout(() => {
                element.style.opacity = originalOpacity || '';
            }, 10);
        });
        
        // Ensure animations restart properly
        const timelineItems = document.querySelectorAll('.timeline-item.visible');
        timelineItems.forEach(item => {
            item.classList.remove('visible');
            setTimeout(() => {
                item.classList.add('visible');
            }, 50);
        });
        
        // Update particle network colors if it exists
        const particleNetwork = document.querySelector('.particle-network-animation');
        if (particleNetwork) {
            const event = new Event('themeChanged');
            document.dispatchEvent(event);
        }
    }
}