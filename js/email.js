document.getElementById('form')
    .addEventListener('submit', function(event) {
        event.preventDefault();

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

                // Show success message
                alert('Message sent successfully! I\'ll get back to you soon.');

                // Reset the form
                document.getElementById('form').reset();
            })
            .catch((err) => {
                btn.textContent = originalBtnText;
                btn.disabled = false;

                // Show error message
                alert('Something went wrong. Please try again later.');
                console.error('EmailJS error:', err);
            });
    });
