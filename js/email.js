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
     * Adds notification styles to the document
     * Creates a style element with CSS for notifications
     */
    function addNotificationStyles() {
        // Create style element
        const style = document.createElement('style');
        style.textContent = `
            .popup-container {
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 9999;
                display: flex;
                flex-direction: column;
                align-items: flex-end;
                gap: 10px;
                max-width: 350px;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
            }
            
            .popup {
                padding: 15px 20px;
                border-radius: 6px;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
                display: flex;
                align-items: flex-start;
                gap: 12px;
                width: 100%;
                box-sizing: border-box;
                animation: slideIn ${CONFIG.notification.animationDuration}ms ease forwards;
                position: relative;
                overflow: hidden;
                background-color: var(--secondary-color);
                border: 1px solid var(--accent-color);
            }
            
            .popup.success {
                background-color: rgba(52, 199, 89, 0.1);
                border-left: 4px solid #34c759;
                color: #34c759;
            }
            
            .popup.error {
                background-color: rgba(229, 62, 62, 0.1);
                border-left: 4px solid #e53e3e;
                color: #e53e3e;
            }
            
            .popup.info {
                background-color: rgba(49, 130, 206, 0.1);
                border-left: 4px solid var(--accent-color);
                color: var(--accent-color);
            }
            
            .popup-icon {
                flex-shrink: 0;
                width: 24px;
                height: 24px;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            
            .popup-content {
                flex-grow: 1;
            }
            
            .popup-title {
                font-weight: 600;
                margin-bottom: 5px;
                font-size: 16px;
            }
            
            .popup-message {
                font-size: 14px;
                line-height: 1.4;
                margin: 0;
                opacity: 0.9;
            }
            
            .popup-close {
                position: absolute;
                top: 10px;
                right: 10px;
                background: none;
                border: none;
                cursor: pointer;
                color: inherit;
                opacity: 0.6;
                padding: 0;
                font-size: 18px;
                line-height: 1;
                transition: opacity 0.2s ease;
            }
            
            .popup-close:hover {
                opacity: 1;
            }
            
            .popup-progress {
                position: absolute;
                bottom: 0;
                left: 0;
                height: 3px;
                background-color: rgba(0, 0, 0, 0.2);
                width: 100%;
            }
            
            .popup-progress-bar {
                height: 100%;
                width: 100%;
                transform-origin: left;
                animation: progress linear forwards;
            }
            
            .popup.success .popup-progress-bar {
                background-color: #34c759;
            }
            
            .popup.error .popup-progress-bar {
                background-color: #e53e3e;
            }
            
            .popup.info .popup-progress-bar {
                background-color: var(--accent-color);
            }
            
            @keyframes slideIn {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            
            @keyframes slideOut {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(100%);
                    opacity: 0;
                }
            }
            
            @keyframes progress {
                from {
                    transform: scaleX(1);
                }
                to {
                    transform: scaleX(0);
                }
            }
            
            /* Responsive adjustments */
            @media (max-width: 480px) {
                .popup-container {
                    right: 10px;
                    left: 10px;
                    max-width: none;
                }
                
                .popup {
                    width: 100%;
                }
            }
        `;
        
        // Add style to document head
        document.head.appendChild(style);
    }
    
    /**
     * Shows a notification popup
     * @param {string} type - Type of notification: 'success', 'error', or 'info'
     * @param {string} title - Title of the notification
     * @param {string} message - Message content
     * @param {number} duration - Duration in milliseconds
     */
    function showNotification(type, title, message, duration = CONFIG.notification.duration) {
        // Get or create popup container
        let popupContainer = document.querySelector('.popup-container');
        if (!popupContainer) {
            popupContainer = initNotificationSystem();
        }
        
        // Create popup element
        const popup = document.createElement('div');
        popup.className = `popup ${type}`;
        
        // Set icon based on type
        let iconSvg = '';
        switch (type) {
            case 'success':
                iconSvg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>';
                break;
            case 'error':
                iconSvg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>';
                break;
            case 'info':
                iconSvg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>';
                break;
        }
        
        // Create popup content
        popup.innerHTML = `
            <div class="popup-icon">${iconSvg}</div>
            <div class="popup-content">
                <div class="popup-title">${title}</div>
                <p class="popup-message">${message}</p>
            </div>
            <button class="popup-close">&times;</button>
            <div class="popup-progress">
                <div class="popup-progress-bar" style="animation-duration: ${duration}ms"></div>
            </div>
        `;
        
        // Add popup to container
        popupContainer.appendChild(popup);
        
        // Add close button event listener
        const closeButton = popup.querySelector('.popup-close');
        closeButton.addEventListener('click', () => closePopup(popup));
        
        // Auto-close after duration
        const timeoutId = setTimeout(() => closePopup(popup), duration);
        
        // Store timeout ID on the popup element
        popup.dataset.timeoutId = timeoutId;
        
        return popup;
    }
    
    /**
     * Closes a notification popup with animation
     * @param {HTMLElement} popup - The popup element to close
     */
    function closePopup(popup) {
        // Clear the timeout if it exists
        if (popup.dataset.timeoutId) {
            clearTimeout(parseInt(popup.dataset.timeoutId));
        }
        
        // Add slide out animation
        popup.style.animation = `slideOut ${CONFIG.notification.animationDuration}ms ease forwards`;
        
        // Remove popup after animation completes
        setTimeout(() => {
            if (popup.parentNode) {
                popup.parentNode.removeChild(popup);
            }
            
            // Remove container if no more popups
            const popupContainer = document.querySelector('.popup-container');
            if (popupContainer && !popupContainer.querySelector('.popup')) {
                popupContainer.parentNode.removeChild(popupContainer);
            }
        }, CONFIG.notification.animationDuration);
    }
    
    // ======================================================
    // FORM VALIDATION
    // ======================================================
    
    /**
     * Validates a form field and shows error message if invalid
     * @param {HTMLElement} field - The form field to validate
     * @param {HTMLElement} errorElement - Element to display error message
     * @returns {boolean} Whether the field is valid
     */
    function validateField(field, errorElement) {
        // Reset error state
        field.classList.remove('error');
        errorElement.textContent = '';
        
        // Get field value and trim whitespace
        const value = field.value.trim();
        
        // Check if field is required and empty
        if (field.required && !value) {
            field.classList.add('error');
            errorElement.textContent = 'This field is required';
            return false;
        }
        
        // Validate based on field type
        switch (field.id) {
            case 'from_name':
                if (value.length < CONFIG.validation.minNameLength) {
                    field.classList.add('error');
                    errorElement.textContent = `Name must be at least ${CONFIG.validation.minNameLength} characters`;
                    return false;
                }
                break;
                
            case 'reply_to':
                if (!CONFIG.validation.emailRegex.test(value)) {
                    field.classList.add('error');
                    errorElement.textContent = 'Please enter a valid email address';
                    return false;
                }
                break;
                
            case 'subject':
                if (value.length < 3) {
                    field.classList.add('error');
                    errorElement.textContent = 'Subject must be at least 3 characters';
                    return false;
                }
                break;
                
            case 'message':
                if (value.length < CONFIG.validation.minMessageLength) {
                    field.classList.add('error');
                    errorElement.textContent = `Message must be at least ${CONFIG.validation.minMessageLength} characters`;
                    return false;
                }
                break;
        }
        
        return true;
    }
    
    /**
     * Sets up form validation for all fields
     * @param {HTMLFormElement} form - The form element
     */
    function setupFormValidation(form) {
        // Create error elements for each field
        const formFields = {};
        
        // Process each form field
        form.querySelectorAll('input, textarea').forEach(field => {
            // Create error message element
            const errorElement = document.createElement('div');
            errorElement.className = 'error-message';
            field.parentNode.appendChild(errorElement);
            
            // Store field and error element
            formFields[field.id] = { field, errorElement };
            
            // Add validation on blur
            field.addEventListener('blur', () => {
                validateField(field, errorElement);
            });
            
            // Add validation on input
            field.addEventListener('input', () => {
                validateField(field, errorElement);
            });
            
            // Add validation on form submission
            field.addEventListener('invalid', (e) => {
                e.preventDefault();
                validateField(field, errorElement);
            });
        });
        
        return formFields;
    }
    
    /**
     * Validates all form fields
     * @param {Object} formFields - Object containing form fields and error elements
     * @returns {boolean} Whether all fields are valid
     */
    function validateForm(formFields) {
        let isValid = true;
        
        // Validate each field
        Object.values(formFields).forEach(({ field, errorElement }) => {
            if (!validateField(field, errorElement)) {
                isValid = false;
            }
        });
        
        return isValid;
    }
    
    // ======================================================
    // FORM SUBMISSION
    // ======================================================
    
    /**
     * Handles form submission
     * @param {Event} event - Form submit event
     * @param {Object} formFields - Object containing form fields and error elements
     */
    function handleFormSubmit(event, formFields) {
        // Prevent default form submission
        event.preventDefault();
        
        // Validate form
        if (!validateForm(formFields)) {
            showNotification('error', 'Validation Error', 'Please check the form for errors.');
            return;
        }
        
        // Get form data
        const formData = {
            from_name: formFields.from_name.field.value.trim(),
            reply_to: formFields.reply_to.field.value.trim(),
            subject: formFields.subject.field.value.trim(),
            to_name: formFields.to_name.field.value.trim(),
            message: formFields.message.field.value.trim()
        };
        
        // Disable form during submission
        const submitButton = event.target.querySelector('button[type="submit"]');
        const originalButtonText = submitButton.textContent;
        submitButton.disabled = true;
        submitButton.textContent = 'Sending...';
        
        // Send email using EmailJS
        emailjs.send(CONFIG.emailjs.serviceID, CONFIG.emailjs.templateID, formData)
            .then(() => {
                // Show success notification
                showNotification('success', 'Message Sent', 'Your message has been sent successfully. I\'ll get back to you soon!');
                
                // Reset form
                event.target.reset();
                
                // Clear error states
                Object.values(formFields).forEach(({ field, errorElement }) => {
                    field.classList.remove('error');
                    errorElement.textContent = '';
                });
            })
            .catch(error => {
                // Show error notification
                showNotification('error', 'Error Sending Message', 'There was a problem sending your message. Please try again later.');
                console.error('EmailJS Error:', error);
            })
            .finally(() => {
                // Re-enable form
                submitButton.disabled = false;
                submitButton.textContent = originalButtonText;
            });
    }
    
    // ======================================================
    // INITIALIZATION
    // ======================================================
    
    // Initialize contact form
    const form = document.getElementById('form');
    if (form) {
        // Setup form validation
        const formFields = setupFormValidation(form);
        
        // Add form submission handler
        form.addEventListener('submit', event => handleFormSubmit(event, formFields));
    }
});