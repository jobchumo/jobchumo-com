document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');

    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Get form data
            const formData = {
                firstName: document.getElementById('firstName').value,
                lastName: document.getElementById('lastName').value,
                email: document.getElementById('email').value,
                subject: document.getElementById('subject').value,
                message: document.getElementById('message').value
            };

            // Here you would typically send the data to your server
            // For demonstration, let's log it to console and show a success message
            console.log('Form submitted:', formData);

            // Show success message
            const button = contactForm.querySelector('button[type="submit"]');
            const originalText = button.textContent;

            button.textContent = 'Message Sent!';
            button.disabled = true;

            // Reset form
            contactForm.reset();

            // Reset button after delay
            setTimeout(() => {
                button.textContent = originalText;
                button.disabled = false;
            }, 3000);

            // In a real implementation, you would use fetch or XMLHttpRequest to send data
            // Example with fetch:
            /*
            fetch('your-server-endpoint', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            })
            .then(response => response.json())
            .then(data => {
                console.log('Success:', data);
                button.textContent = 'Message Sent!';
                contactForm.reset();

                setTimeout(() => {
                    button.textContent = originalText;
                    button.disabled = false;
                }, 3000);
            })
            .catch(error => {
                console.error('Error:', error);
                button.textContent = 'Error! Try Again';

                setTimeout(() => {
                    button.textContent = originalText;
                    button.disabled = false;
                }, 3000);
            });
            */
        });
    }
});