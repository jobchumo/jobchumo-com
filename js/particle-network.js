(function() {
	// Main animation controller
	var ParticleNetworkAnimation, PNA;
	ParticleNetworkAnimation = PNA = function() {};

	PNA.prototype.init = function(element) {
		this.$el = $(element);
		this.container = element;
		this.canvas = document.createElement('canvas');
		this.sizeCanvas();
		this.container.appendChild(this.canvas);
		this.ctx = this.canvas.getContext('2d');
		this.particleNetwork = new ParticleNetwork(this);

		this.bindUiActions();

		return this;
	};

	PNA.prototype.bindUiActions = function() {
		// Handle window resize
		$(window).on('resize', function() {
			// Clear canvas before resizing
			this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
			this.sizeCanvas();
			this.particleNetwork.createParticles();
		}.bind(this));
	};

	PNA.prototype.sizeCanvas = function() {
		// Set canvas dimensions to match container
		this.canvas.width = this.container.offsetWidth || window.innerWidth;
		this.canvas.height = this.container.offsetHeight || window.innerHeight;
	};

	/**
	 * Particle object
	 * Represents a single particle in the network
	 */
	var Particle = function(parent, x, y) {
		this.network = parent;
		this.canvas = parent.canvas;
		this.ctx = parent.ctx;
		this.particleColor = returnRandomArrayitem(this.network.options.particleColors);
		// Slightly larger particles
		this.radius = getLimitedRandom(1.2, 2.0);
		// Start with lower opacity
		this.opacity = 0;
		this.x = x || Math.random() * this.canvas.width;
		this.y = y || Math.random() * this.canvas.height;
		this.velocity = {
			x: (Math.random() - 0.5) * parent.options.velocity * 0.7, // Slower movement
			y: (Math.random() - 0.5) * parent.options.velocity * 0.7  // Slower movement
		};
	};

	Particle.prototype.update = function() {
		// Update particle position based on velocity
		this.x += this.velocity.x;
		this.y += this.velocity.y;

		// Bounce off edges
		if (this.x > this.canvas.width + 100 || this.x < -100) {
			this.velocity.x = -this.velocity.x;
		}
		if (this.y > this.canvas.height + 100 || this.y < -100) {
			this.velocity.y = -this.velocity.y;
		}

		// Gradually increase opacity for fade-in effect
		if (this.opacity < 1) {
			this.opacity += 0.01;
		}
	};

	Particle.prototype.draw = function() {
		// Draw the particle
		this.ctx.beginPath();
		this.ctx.fillStyle = this.particleColor;
		this.ctx.globalAlpha = this.opacity;
		this.ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
		this.ctx.fill();
	};

	/**
	 * Particle Network
	 * Manages the collection of particles and their connections
	 */
	var ParticleNetwork = function(parent) {
		this.options = {
			velocity: 1,
			density: 15000, // Lower density = more particles
			netLineDistance: 200,
			netLineColor: '#929292',
			particleColors: ['#fff'] // Default color
		};
		this.canvas = parent.canvas;
		this.ctx = parent.ctx;

		// Check if we're in light mode and adjust colors
		this.updateThemeColors();

		// Listen for theme changes
		document.addEventListener('themeChanged', this.updateThemeColors.bind(this));

		this.createParticles();
		this.animationFrame = requestAnimationFrame(this.update.bind(this));

		// Add mouse interaction
		this.bindUiActions();
	};

	ParticleNetwork.prototype.updateThemeColors = function() {
		const isLightMode = document.body.classList.contains('light-mode');
		
		// Get transparent color based on theme
		const getTransparentColor = (color) => {
			// Extract RGB components
			const hexToRgb = (hex) => {
				const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
				return result ? {
					r: parseInt(result[1], 16),
					g: parseInt(result[2], 16),
					b: parseInt(result[3], 16)
				} : null;
			};
			
			// Convert to rgba with transparency
			const rgb = hexToRgb(color);
			return rgb ? `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.5)` : 'rgba(255, 255, 255, 0.5)';
		};
		
		// Update colors based on theme
		if (isLightMode) {
			this.options.particleColors = ['#0066ff']; // Light blue for light mode
			this.options.netLineColor = getTransparentColor('#003366');
		} else {
			this.options.particleColors = ['#fff']; // White for dark mode
			this.options.netLineColor = 'rgba(255, 255, 255, 0.2)';
		}
		
		// Update existing particles if they exist
		if (this.particles) {
			this.particles.forEach(particle => {
				particle.particleColor = returnRandomArrayitem(this.options.particleColors);
			});
		}
	};

	ParticleNetwork.prototype.createParticles = function() {
		// Clear existing particles
		this.particles = [];

		// Calculate number of particles based on canvas size and density
		var quantity = Math.floor(this.canvas.width * this.canvas.height / this.options.density);

		// Create particles
		for (var i = 0; i < quantity; i++) {
			var particle = new Particle(this);
			this.particles.push(particle);
		}
	};

	ParticleNetwork.prototype.findClosestParticles = function(particle) {
		// Find particles within connection distance
		var closest = [];
		var threshold = this.options.netLineDistance;

		for (var i = 0; i < this.particles.length; i++) {
			var current = this.particles[i];
			if (current === particle) continue;

			var dx = particle.x - current.x;
			var dy = particle.y - current.y;
			var distance = Math.sqrt(dx * dx + dy * dy);

			if (distance < threshold) {
				closest.push({
					particle: current,
					distance: distance
				});
			}
		}

		return closest;
	};

	ParticleNetwork.prototype.drawNetwork = function(particle) {
		// Find and draw connections to nearby particles
		var closest = this.findClosestParticles(particle);

		for (var i = 0; i < closest.length; i++) {
			var opacity = 1 - closest[i].distance / this.options.netLineDistance;
			var connection = closest[i].particle;

			// Draw connection line with opacity based on distance
			this.ctx.beginPath();
			this.ctx.strokeStyle = this.options.netLineColor;
			this.ctx.globalAlpha = opacity;
			this.ctx.lineWidth = 0.5;
			this.ctx.moveTo(particle.x, particle.y);
			this.ctx.lineTo(connection.x, connection.y);
			this.ctx.stroke();
		}
	};

	ParticleNetwork.prototype.update = function() {
		// Clear canvas
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

		// Update and draw each particle and its connections
		for (var i = 0; i < this.particles.length; i++) {
			var particle = this.particles[i];
			particle.update();
			particle.draw();

			// Draw connections
			this.drawNetwork(particle);
		}

		// Continue animation loop
		this.animationFrame = requestAnimationFrame(this.update.bind(this));
	};

	ParticleNetwork.prototype.bindUiActions = function() {
		// Track mouse position for interactive effects
		this.mousePosition = {
			x: 0,
			y: 0
		};

		// Add mouse move listener
		this.canvas.addEventListener('mousemove', function(e) {
			var rect = this.canvas.getBoundingClientRect();
			this.mousePosition = {
				x: e.clientX - rect.left,
				y: e.clientY - rect.top
			};
		}.bind(this));

		// Add touch move listener for mobile
		this.canvas.addEventListener('touchmove', function(e) {
			if (e.touches.length > 0) {
				var rect = this.canvas.getBoundingClientRect();
				this.mousePosition = {
					x: e.touches[0].clientX - rect.left,
					y: e.touches[0].clientY - rect.top
				};
			}
		}.bind(this));

		// Reset mouse position when mouse leaves canvas
		this.canvas.addEventListener('mouseleave', function() {
			this.mousePosition = {
				x: null,
				y: null
			};
		}.bind(this));

		// Handle theme changes
		document.addEventListener('themeChanged', function(e) {
			const isLightMode = e.detail.isLightMode;
			
			// Update particle colors
			this.updateThemeColors();
		}.bind(this));
	};

	/**
	 * Helper Functions
	 */
	function returnRandomArrayitem(array) {
		return array[Math.floor(Math.random() * array.length)];
	}

	function getLimitedRandom(min, max) {
		return Math.random() * (max - min) + min;
	}

	/**
	 * Initialize the animation when the DOM is ready
	 */
	$(document).ready(function() {
		// Initialize animation on the container element
		var particleNetworkAnimation = new ParticleNetworkAnimation();
		particleNetworkAnimation.init('.particle-network-animation');
	});
})(); 