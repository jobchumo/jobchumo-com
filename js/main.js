document.addEventListener('DOMContentLoaded', function() {
    const timelineItems = document.querySelectorAll('.timeline-item');
    let delay = 0;
    
    timelineItems.forEach(item => {
        setTimeout(() => {
            item.style.animationDelay = `${delay}ms`;
            item.style.animationPlayState = 'running';
        }, delay);
        delay += 300;
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
});