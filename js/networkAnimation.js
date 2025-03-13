/**
 * Network Animation Background
 * Creates an interactive network visualization with nodes and connections
 * that move and respond to window size changes
 */

document.addEventListener('DOMContentLoaded', function() {
    // Configuration
    const CONFIG = {
        nodeCount: 60,         // Total number of nodes to create
        connectionLimit: 5,    // Maximum connections per node
        connectionDistance: 200, // Maximum distance for connections
        nodeSpeed: 0.5,        // Base speed for node movement
        connectionUpdateProbability: 0.05 // Probability of updating connections each frame
    };
    
    // DOM Elements
    const networkBg = document.getElementById('networkBackground');
    if (!networkBg) return; // Exit if container doesn't exist
    
    // State
    const nodes = [];
    const connections = [];
    
    // Initialize the animation
    initNodes();
    updateConnections();
    animate();
    setupResizeHandler();
    
    /**
     * Creates and initializes all nodes with random positions and velocities
     */
    function initNodes() {
        for (let i = 0; i < CONFIG.nodeCount; i++) {
            // Create DOM element
            const node = document.createElement('div');
            node.className = 'node';
            
            // Random position within viewport
            const x = Math.random() * window.innerWidth;
            const y = Math.random() * window.innerHeight;
            
            node.style.left = `${x}px`;
            node.style.top = `${y}px`;
            
            // Random velocity (direction and speed)
            const vx = (Math.random() - 0.5) * CONFIG.nodeSpeed;
            const vy = (Math.random() - 0.5) * CONFIG.nodeSpeed;
            
            // Store node data
            nodes.push({
                element: node,
                x,
                y,
                vx,
                vy
            });
            
            // Add to DOM
            networkBg.appendChild(node);
        }
    }
    
    /**
     * Updates connections between nodes based on proximity
     * Removes old connections and creates new ones
     */
    function updateConnections() {
        // Remove all existing connections
        connections.forEach(conn => conn.element.remove());
        connections.length = 0;
        
        // Create new connections based on proximity
        for (let i = 0; i < nodes.length; i++) {
            const nodeA = nodes[i];
            let connectedCount = 0;
            
            for (let j = i + 1; j < nodes.length; j++) {
                // Limit connections per node for performance
                if (connectedCount >= CONFIG.connectionLimit) break;
                
                const nodeB = nodes[j];
                const dx = nodeB.x - nodeA.x;
                const dy = nodeB.y - nodeA.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                // Only connect nodes within the maximum distance
                if (distance < CONFIG.connectionDistance) {
                    createConnection(nodeA, nodeB, distance, dx, dy);
                    connectedCount++;
                }
            }
        }
    }
    
    /**
     * Creates a visual connection between two nodes
     */
    function createConnection(nodeA, nodeB, distance, dx, dy) {
        const connection = document.createElement('div');
        connection.className = 'connection';
        
        // Calculate rotation angle
        const angle = Math.atan2(dy, dx) * 180 / Math.PI;
        
        // Set connection properties
        connection.style.width = `${distance}px`;
        connection.style.left = `${nodeA.x}px`;
        connection.style.top = `${nodeA.y}px`;
        connection.style.transform = `rotate(${angle}deg)`;
        
        // Opacity based on distance (farther = more transparent)
        connection.style.opacity = (1 - distance / CONFIG.connectionDistance) * 0.5;
        
        // Store connection data
        connections.push({
            element: connection,
            nodeA: nodes.indexOf(nodeA),
            nodeB: nodes.indexOf(nodeB)
        });
        
        // Add to DOM
        networkBg.appendChild(connection);
    }
    
    /**
     * Animation loop that updates node positions and connections
     */
    function animate() {
        // Update node positions
        nodes.forEach(node => {
            // Update position based on velocity
            node.x += node.vx;
            node.y += node.vy;
            
            // Bounce off viewport boundaries
            if (node.x < 0 || node.x > window.innerWidth) node.vx *= -1;
            if (node.y < 0 || node.y > window.innerHeight) node.vy *= -1;
            
            // Update DOM element position
            node.element.style.left = `${node.x}px`;
            node.element.style.top = `${node.y}px`;
        });
        
        // Occasionally update connections for performance
        if (Math.random() < CONFIG.connectionUpdateProbability) {
            updateConnections();
        }
        
        // Continue animation loop
        requestAnimationFrame(animate);
    }
    
    /**
     * Handles window resize events to keep animation within viewport
     */
    function setupResizeHandler() {
        window.addEventListener('resize', function() {
            // Reposition nodes within new window bounds
            nodes.forEach(node => {
                if (node.x > window.innerWidth) node.x = window.innerWidth - 10;
                if (node.y > window.innerHeight) node.y = window.innerHeight - 10;
            });
            
            // Update connections after resize
            updateConnections();
        });
    }
});