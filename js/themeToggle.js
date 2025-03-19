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
            if (isIOS()) {
                forceIOSRepaint();
            }
        } else {
            body.classList.remove('light-mode');
            localStorage.setItem('theme', 'dark');
            if (isIOS()) {
                forceIOSRepaint();
            }
        }
    });

    mobileThemeToggle.addEventListener('change', function() {
        if (this.checked) {
            body.classList.add('light-mode');
            localStorage.setItem('theme', 'light');
            if (isIOS()) {
                forceIOSRepaint();
            } else {
                forceRepaint();
            }
        } else {
            body.classList.remove('light-mode');
            localStorage.setItem('theme', 'dark');
            if (isIOS()) {
                forceIOSRepaint();
            }
        }
    });

    // Check if device is running iOS (iPhone, iPad, iPod)
    function isIOS() {
        return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    }

    // Force repaint for sections
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

    // Specific fixes for iOS Safari rendering issues
    function forceIOSRepaint() {
        console.log("iOS device detected - fixing Safari rendering");
        
        // Fix for the particle network background
        const particleNetwork = document.querySelector('.particle-network-animation');
        if (particleNetwork) {
            if (body.classList.contains('light-mode')) {
                particleNetwork.style.opacity = '0.5';
                particleNetwork.style.backgroundColor = 'transparent';
            } else {
                particleNetwork.style.opacity = '0.3';
                particleNetwork.style.backgroundColor = 'var(--bg-color)';
            }
        }
        
        // Fix layering issues by forcing all elements to repaint
        const elementsToFix = [
            ...document.querySelectorAll('section'),
            ...document.querySelectorAll('.timeline-item'),
            ...document.querySelectorAll('.timeline-content'),
            ...document.querySelectorAll('.skill-tag'),
            ...document.querySelectorAll('.contact-form input'),
            ...document.querySelectorAll('.contact-form textarea'),
            ...document.querySelectorAll('.timeline-subtitle'),
            ...document.querySelectorAll('.timeline-description')
        ];
        
        // Force background color repainting for light mode elements
        if (body.classList.contains('light-mode')) {
            elementsToFix.forEach(element => {
                if (element.classList.contains('timeline-content') || 
                    element.classList.contains('skill-tag')) {
                    element.style.backgroundColor = 'var(--light-secondary-color)';
                    element.style.color = 'var(--light-text-color)';
                }
                
                if (element.classList.contains('timeline-subtitle') || 
                    element.classList.contains('timeline-description')) {
                    element.style.color = 'var(--light-text-color)';
                }
                
                // Trigger repaint with slight opacity change
                element.style.opacity = '0.99';
                setTimeout(() => {
                    element.style.opacity = '';
                }, 10);
            });
        }
        
        // Add a temporary overlay and remove it to force composition update
        const overlay = document.createElement('div');
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100%';
        overlay.style.height = '100%';
        overlay.style.backgroundColor = body.classList.contains('light-mode') ? 
                                        'rgba(245, 245, 245, 0.01)' : 
                                        'rgba(10, 10, 10, 0.01)';
        overlay.style.zIndex = '9999';
        overlay.style.pointerEvents = 'none';
        
        document.body.appendChild(overlay);
        setTimeout(() => {
            document.body.removeChild(overlay);
        }, 100);
        
        // Force window redraw
        window.scrollBy(0, 1);
        window.scrollBy(0, -1);
    }
}