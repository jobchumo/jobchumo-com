document.addEventListener('DOMContentLoaded', function() {
    // Theme switching functionality
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
    
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    // Create intersection observer for timeline items
    const timelineObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const item = entry.target;
                const index = parseInt(item.dataset.index);
                
                // Add a delay based on the item's position
                requestAnimationFrame(() => {
                    setTimeout(() => {
                        item.classList.add('visible');
                    }, index * 100); // Reduced delay to 100ms
                });
                
                // Unobserve after animation starts
                timelineObserver.unobserve(item);
            }
        });
    }, {
        threshold: 0.1, // Reduced threshold to trigger earlier
        rootMargin: '100px' // Increased margin to start animation earlier
    });
    
    // Add data-index and observe each timeline item
    timelineItems.forEach((item, index) => {
        item.dataset.index = index;
        timelineObserver.observe(item);
    });
    
    // Fade-in animation for sections
    const fadeElements = document.querySelectorAll('.fade-in');
    
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1
    });
    
    fadeElements.forEach(element => {
        observer.observe(element);
    });

    // Skill lists animation
    const skillLists = document.querySelectorAll('.skill-list');
    
    const skillObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const skillList = entry.target;
                const skillTags = skillList.querySelectorAll('.skill-tag');
                
                // Animate the skill list container
                skillList.style.animationPlayState = 'running';
                
                // Animate each skill tag with a staggered delay
                skillTags.forEach((tag, index) => {
                    tag.style.animationDelay = `${index * 50}ms`;
                    tag.style.animationPlayState = 'running';
                });
                
                // Unobserve after animation starts
                skillObserver.unobserve(skillList);
            }
        });
    }, {
        threshold: 0.2,
        rootMargin: '0px'
    });
    
    // Observe each skill list
    skillLists.forEach(skillList => {
        skillObserver.observe(skillList);
    });
});