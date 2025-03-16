/**
 * email.js - Contact form handling with EmailJS integration
 *
 * This script handles the contact form submission process including:
 * - Form validation with real-time feedback
 * - EmailJS integration for sending emails without a backend
 * - Notification system for user feedback
 * - Custom styling for form elements and notifications
 */

document.addEventListener('DOMContentLoaded', function() {
    // ======================================================
    // CONFIGURATION
    // ======================================================
    const CONFIG = {
        // EmailJS configuration
        emailjs: {
            serviceID: 'default_service',
            templateID: 'jobchumocontactform'
        },
        // Notification settings
        notification: {
            duration: 5000,
            animationDuration: 400
        },
        // Validation rules
        validation: {
            minNameLength: 2,
            minMessageLength: 10,
            emailRegex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        }
    };

    // ======================================================
    // NOTIFICATION SYSTEM
    // ======================================================

    /**
     * Initialize the notification container
     * Creates a fixed container at the top-right corner of the screen
     * @returns {HTMLElement} The popup container element
     */
    function initNotificationSystem() {
        // Create popup container
        const popupContainer = document.createElement('div');
        popupContainer.className = 'popup-container';
        document.body.appendChild(popupContainer);

        // Add notification styles to the document
        addNotificationStyles();

        return popupContainer;
    }

    /**
     * Add CSS styles for notifications to the document head
     */
    function addNotificationStyles() {
        const style = document.createElement('style');
        style.textContent = `
            /* Notification container */
            .popup-container {
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 1000;
                pointer-events: none;
            }
            
            /* Individual notification */
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
            
            .light-mode .popup {
                background-color: var(--light-secondary-color)
            }
            
            .popup.success {
                border-left: 4px solid var(--accent-color);
            }
            .popup.error {
                border-left: 4px solid #e53e3e;
            }
            
            /* Notification components */
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
            
            .light-mode .popup-title {
                color: var(--light-text-color);
            }
            
            .popup-message {
                font-size: 14px;
                opacity: 0.9;
            }
            
            .light-mode .popup-message {
                color: var(--light-text-color);
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
    }

    /**
     * Display a notification to the user
     * @param {string} type - 'success' or 'error'
     * @param {string} title - Notification title
     * @param {string} message - Notification message
     * @param {number} duration - How long to display the notification (ms)
     * @returns {HTMLElement} The created notification element
     */
    function showNotification(type, title, message, duration = CONFIG.notification.duration) {
        const popup = document.createElement('div');
        popup.className = `popup ${type}`;

        // Select icon based on notification type
        const iconSvg = type === 'success'
            ? '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>'
            : '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>';

        // Create notification content
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

        // Add to container
        popupContainer.appendChild(popup);

        // Animate in (small delay for transition to work)
        setTimeout(() => {
            popup.style.transform = 'translateX(0)';
        }, 10);

        // Setup progress bar animation
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
        popup.dataset.timeoutId = setTimeout(() => {
            closePopup(popup);
        }, duration);

        return popup;
    }

    /**
     * Close and remove a notification
     * @param {HTMLElement} popup - The notification element to close
     */
    function closePopup(popup) {
        // Clear the auto-close timeout
        clearTimeout(popup.dataset.timeoutId);

        // Animate out
        popup.style.transform = 'translateX(120%)';

        // Remove from DOM after animation completes
        setTimeout(() => {
            popup.remove();
        }, CONFIG.notification.animationDuration);
    }

    // ======================================================
    // FORM VALIDATION
    // ======================================================

    /**
     * Validate a form field and show appropriate error messages
     * @param {HTMLElement} field - The input or textarea to validate
     * @param {HTMLElement} errorElement - The element to display error messages in
     * @returns {boolean} Whether the field is valid
     */
    function validateField(field, errorElement) {
        let isValid = true;
        const value = field.value.trim();

        // Reset previous validation state
        field.classList.remove('invalid');
        errorElement.classList.remove('visible');

        // Apply validation rules based on field type
        if (field.required && value === '') {
            // Required field validation
            field.classList.add('error');
            errorElement.textContent = 'This field is required';
            isValid = false;
        } else if (field.type === 'email' && value !== '') {
            // Email format validation
            if (!CONFIG.validation.emailRegex.test(value)) {
                errorElement.textContent = 'Please enter a valid email address';
                isValid = false;
            }
        } else if (field.id === 'from_name' && value.length < CONFIG.validation.minNameLength) {
            // Name length validation
            errorElement.textContent = `Name must be at least ${CONFIG.validation.minNameLength} characters`;
            isValid = false;
        } else if (field.id === 'message' && value.length < CONFIG.validation.minMessageLength) {
            // Message length validation
            errorElement.textContent = `Message must be at least ${CONFIG.validation.minMessageLength} characters`;
            isValid = false;
        }

        // If invalid, show the error
        if (!isValid) {
            field.classList.add('invalid');
            errorElement.classList.add('visible');
        }

        return isValid;
    }

    /**
     * Setup form field validation with error messages
     * @param {HTMLElement} form - The form element
     * @returns {NodeList} The form fields
     */
    function setupFormValidation(form) {
        const formFields = form.querySelectorAll('input, textarea');

        formFields.forEach(field => {
            // Create error message element for each field
            const errorMsg = document.createElement('div');
            errorMsg.className = 'error-message';
            field.parentNode.appendChild(errorMsg);

            // Real-time validation on input
            field.addEventListener('input', function() {
                const errorElement = this.parentNode.querySelector('.error-message');
                validateField(this, errorElement);
            });

            // Validate when field loses focus
            field.addEventListener('blur', function() {
                const errorElement = this.parentNode.querySelector('.error-message');
                validateField(this, errorElement);
            });
        });

        return formFields;
    }

    /**
     * Validate all form fields before submission
     * @param {NodeList} formFields - All form fields to validate
     * @returns {boolean} Whether the entire form is valid
     */
    function validateForm(formFields) {
        let isFormValid = true;

        formFields.forEach(field => {
            const errorElement = field.parentNode.querySelector('.error-message');
            if (!validateField(field, errorElement)) {
                isFormValid = false;
            }
        });

        return isFormValid;
    }

    // ======================================================
    // EMAIL SUBMISSION
    // ======================================================

    /**
     * Handle form submission and send email via EmailJS
     * @param {Event} event - The form submission event
     * @param {NodeList} formFields - All form fields
     */
    function handleFormSubmit(event, formFields) {
        event.preventDefault();

        // Validate all fields before submission
        if (!validateForm(formFields)) {
            showNotification('error', 'Form Error', 'Please fill in all required fields correctly');
            return;
        }

        // Update button state to show loading
        const btn = document.getElementById('button');
        const originalBtnText = btn.textContent;
        btn.textContent = 'Sending...';
        btn.disabled = true;

        // Send the email using EmailJS
        emailjs.sendForm(
            CONFIG.emailjs.serviceID,
            CONFIG.emailjs.templateID,
            event.target
        )
            .then(() => {
                // Restore button state
                btn.textContent = originalBtnText;
                btn.disabled = false;

                // Show success notification
                showNotification(
                    'success',
                    'Message Sent',
                    'Thank you for your message. I\'ll get back to you soon.'
                );

                // Reset the form
                event.target.reset();
            })
            .catch((err) => {
                // Restore button state
                btn.textContent = originalBtnText;
                btn.disabled = false;

                // Show error notification
                showNotification(
                    'error',
                    'Error',
                    'Something went wrong. Please try again later.'
                );

                // Log detailed error for debugging
                console.error('EmailJS error:', err);
            });
    }

    // ======================================================
    // INITIALIZATION
    // ======================================================

    // Initialize notification system
    const popupContainer = initNotificationSystem();

    // Get the contact form
    const form = document.getElementById('form');
    if (!form) {
        console.error('Contact form not found in the document');
        return;
    }

    // Setup form validation
    const formFields = setupFormValidation(form);

    // Setup form submission handler
    form.addEventListener('submit', function(event) {
        handleFormSubmit(event, formFields);
    });
});