document.addEventListener('DOMContentLoaded', function() {
    const networkBg = document.getElementById('networkBackground');
    const nodeCount = 60;
    const connectionLimit = 5;
    const nodes = [];

    // Create nodes
    for (let i = 0; i < nodeCount; i++) {
        const node = document.createElement('div');
        node.className = 'node';

        // Random position
        const x = Math.random() * window.innerWidth;
        const y = Math.random() * window.innerHeight;

        node.style.left = `${x}px`;
        node.style.top = `${y}px`;

        // Random speed
        const vx = (Math.random() - 0.5) * 0.5;
        const vy = (Math.random() - 0.5) * 0.5;

        nodes.push({
            element: node,
            x,
            y,
            vx,
            vy
        });

        networkBg.appendChild(node);
    }

    // Create connections between nodes
    const connections = [];

    function updateConnections() {
        // Remove all existing connections
        connections.forEach(conn => conn.element.remove());
        connections.length = 0;

        // Create new connections based on proximity
        for (let i = 0; i < nodes.length; i++) {
            const nodeA = nodes[i];
            let connectedCount = 0;

            for (let j = i + 1; j < nodes.length; j++) {
                if (connectedCount >= connectionLimit) break;

                const nodeB = nodes[j];
                const dx = nodeB.x - nodeA.x;
                const dy = nodeB.y - nodeA.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 200) {
                    const connection = document.createElement('div');
                    connection.className = 'connection';

                    const angle = Math.atan2(dy, dx) * 180 / Math.PI;

                    connection.style.width = `${distance}px`;
                    connection.style.left = `${nodeA.x}px`;
                    connection.style.top = `${nodeA.y}px`;
                    connection.style.transform = `rotate(${angle}deg)`;

                    // Opacity based on distance
                    connection.style.opacity = (1 - distance / 200) * 0.5;

                    connections.push({
                        element: connection,
                        nodeA: i,
                        nodeB: j
                    });

                    networkBg.appendChild(connection);
                    connectedCount++;
                }
            }
        }
    }

    // Animation loop
    function animate() {
        // Update node positions
        nodes.forEach(node => {
            node.x += node.vx;
            node.y += node.vy;

            // Bounce off walls
            if (node.x < 0 || node.x > window.innerWidth) node.vx *= -1;
            if (node.y < 0 || node.y > window.innerHeight) node.vy *= -1;

            // Update DOM element
            node.element.style.left = `${node.x}px`;
            node.element.style.top = `${node.y}px`;
        });

        // Update connections periodically
        if (Math.random() < 0.05) {
            updateConnections();
        }

        requestAnimationFrame(animate);
    }

    // Initial connections
    updateConnections();

    // Start animation
    animate();

    // Handle window resize
    window.addEventListener('resize', function() {
        // Reposition nodes within new window bounds
        nodes.forEach(node => {
            if (node.x > window.innerWidth) node.x = window.innerWidth - 10;
            if (node.y > window.innerHeight) node.y = window.innerHeight - 10;
        });

        updateConnections();
    });
});

// Scroll animation for timeline items
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