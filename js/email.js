document.addEventListener('DOMContentLoaded', function() {
    // Create popup elements and add them to the DOM
    const popupContainer = document.createElement('div');
    popupContainer.className = 'popup-container';
    document.body.appendChild(popupContainer);

    // Add styles for the popup
    const style = document.createElement('style');
    style.textContent = `
        .popup-container {
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 1000;
            pointer-events: none;
        }
        .popup {
            background-color: var(--secondary-color);
            color: var(--text-color);
            padding: 16px 20px;
            border-radius: 4px;
            margin-bottom: 10px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
            display: flex;
            align-items: center;
            transform: translateX(120%);
            transition: transform var(--menu-transition-duration) var(--menu-transition-timing);
            max-width: 350px;
            pointer-events: all;
            position: relative;
            overflow: hidden;
        }
        .popup.success {
            border-left: 4px solid var(--accent-color);
        }
        .popup.error {
            border-left: 4px solid #e53e3e;
        }
        .popup-icon {
            margin-right: 12px;
            flex-shrink: 0;
        }
        .popup-content {
            flex-grow: 1;
        }
        .popup-title {
            font-weight: 600;
            margin-bottom: 4px;
            font-size: 16px;
        }
        .popup-message {
            font-size: 14px;
            opacity: 0.9;
        }
        .popup-close {
            cursor: pointer;
            padding: 4px;
            color: rgba(255, 255, 255, 0.7);
            transition: color 0.2s ease;
            margin-left: 10px;
        }
        .popup-close:hover {
            color: var(--text-color);
        }
        .popup-progress {
            position: absolute;
            bottom: 0;
            left: 0;
            height: 3px;
            background-color: rgba(255, 255, 255, 0.3);
        }
        .popup.success .popup-progress {
            background-color: var(--accent-color);
        }
        .popup.error .popup-progress {
            background-color: #e53e3e;
        }
        
        /* Form validation styles */
        .form-group input.invalid,
        .form-group textarea.invalid {
            border-color: #e53e3e;
        }
        .error-message {
            color: #e53e3e;
            font-size: 0.8rem;
            margin-top: 4px;
            display: none;
        }
        .error-message.visible {
            display: block;
            animation: fadeIn 0.3s ease forwards;
        }
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(-5px); }
            to { opacity: 1; transform: translateY(0); }
        }
    `;
    document.head.appendChild(style);

    // Create notification function
    function showNotification(type, title, message, duration = 5000) {
        const popup = document.createElement('div');
        popup.className = `popup ${type}`;

        // Create icon based on type
        const iconSvg = type === 'success'
            ? '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>'
            : '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>';

        popup.innerHTML = `
            <div class="popup-icon">${iconSvg}</div>
            <div class="popup-content">
                <div class="popup-title">${title}</div>
                <div class="popup-message">${message}</div>
            </div>
            <div class="popup-close">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
            </div>
            <div class="popup-progress"></div>
        `;

        popupContainer.appendChild(popup);

        // Animate in
        setTimeout(() => {
            popup.style.transform = 'translateX(0)';
        }, 10);

        // Set progress bar animation
        const progressBar = popup.querySelector('.popup-progress');
        progressBar.style.width = '100%';
        progressBar.style.transition = `width ${duration}ms linear`;

        setTimeout(() => {
            progressBar.style.width = '0';
        }, 10);

        // Setup close button
        const closeBtn = popup.querySelector('.popup-close');
        closeBtn.addEventListener('click', () => {
            closePopup(popup);
        });

        // Auto close after duration
        // Store the timeout ID
        popup.dataset.timeoutId = setTimeout(() => {
            closePopup(popup);
        }, duration);

        return popup;
    }

    function closePopup(popup) {
        // Clear the timeout
        clearTimeout(popup.dataset.timeoutId);

        // Animate out
        popup.style.transform = 'translateX(120%)';

        // Remove from DOM after animation
        setTimeout(() => {
            popup.remove();
        }, 400);
    }

    // Form validation functions
    function validateField(field, errorElement) {
        let isValid = true;
        const value = field.value.trim();

        // Reset previous validation state
        field.classList.remove('invalid');
        errorElement.classList.remove('visible');

        // Different validation rules based on field type
        if (field.required && value === '') {
            errorElement.textContent = 'This field is required';
            isValid = false;
        } else if (field.type === 'email' && value !== '') {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                errorElement.textContent = 'Please enter a valid email address';
                isValid = false;
            }
        } else if (field.id === 'from_name' && value.length < 2) {
            errorElement.textContent = 'Name must be at least 2 characters';
            isValid = false;
        } else if (field.id === 'message' && value.length < 10) {
            errorElement.textContent = 'Message must be at least 10 characters';
            isValid = false;
        }

        // If invalid, show the error
        if (!isValid) {
            field.classList.add('invalid');
            errorElement.classList.add('visible');
        }

        return isValid;
    }

    // Prepare the form
    const form = document.getElementById('form');

    // Add error message elements to each form field
    const formFields = form.querySelectorAll('input, textarea');
    formFields.forEach(field => {
        const errorMsg = document.createElement('div');
        errorMsg.className = 'error-message';
        field.parentNode.appendChild(errorMsg);

        // Add input event listener for real-time validation
        field.addEventListener('input', function() {
            const errorElement = this.parentNode.querySelector('.error-message');
            validateField(this, errorElement);
        });

        // Add blur event for validation when field loses focus
        field.addEventListener('blur', function() {
            const errorElement = this.parentNode.querySelector('.error-message');
            validateField(this, errorElement);
        });
    });

    // Form submission handler
    form.addEventListener('submit', function(event) {
        event.preventDefault();

        // Validate all fields before submission
        let isFormValid = true;
        formFields.forEach(field => {
            const errorElement = field.parentNode.querySelector('.error-message');
            if (!validateField(field, errorElement)) {
                isFormValid = false;
            }
        });

        if (!isFormValid) {
            showNotification('error', 'Form Error', 'Please fill in all required fields correctly');
            return;
        }

        const btn = document.getElementById('button');
        const originalBtnText = btn.textContent;
        btn.textContent = 'Sending...';
        btn.disabled = true;

        const serviceID = 'default_service';
        const templateID = 'jobchumocontactform';

        emailjs.sendForm(serviceID, templateID, this)
            .then(() => {
                btn.textContent = originalBtnText;
                btn.disabled = false;

                // Show success notification
                showNotification('success', 'Message Sent', 'Thank you for your message. I\'ll get back to you soon.');

                // Reset the form
                form.reset();
            })
            .catch((err) => {
                btn.textContent = originalBtnText;
                btn.disabled = false;

                // Show error notification
                showNotification('error', 'Error', 'Something went wrong. Please try again later.');
                console.error('EmailJS error:', err);
            });
    });
});