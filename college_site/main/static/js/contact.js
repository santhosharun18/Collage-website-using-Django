// Contact form functionality
class ContactForm {
    constructor() {
        this.form = document.getElementById('contactForm');
        this.submitButton = null;
        this.originalButtonText = '';
        
        if (this.form) {
            this.init();
        }
    }
    
    init() {
        this.submitButton = this.form.querySelector('button[type="submit"]');
        this.originalButtonText = this.submitButton.textContent;
        
        this.setupFormValidation();
        this.setupFormSubmission();
        this.setupRealTimeValidation();
        this.setupFormPersistence();
    }
    
    setupFormValidation() {
        const inputs = this.form.querySelectorAll('input, select, textarea');
        
        inputs.forEach(input => {
            // Add validation styling
            input.addEventListener('invalid', (e) => {
                e.preventDefault();
                this.showFieldError(input, input.validationMessage);
            });
            
            input.addEventListener('input', () => {
                this.clearFieldError(input);
                if (input.checkValidity()) {
                    this.showFieldSuccess(input);
                }
            });
        });
    }
    
    setupRealTimeValidation() {
        const emailInput = this.form.querySelector('#email');
        const phoneInput = this.form.querySelector('#phone');
        
        // Email validation
        if (emailInput) {
            emailInput.addEventListener('blur', () => {
                if (emailInput.value && !this.isValidEmail(emailInput.value)) {
                    this.showFieldError(emailInput, 'Please enter a valid email address');
                }
            });
        }
        
        // Phone validation
        if (phoneInput) {
            phoneInput.addEventListener('input', (e) => {
                // Format phone number as user types
                let value = e.target.value.replace(/\D/g, '');
                if (value.length >= 6) {
                    value = value.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
                } else if (value.length >= 3) {
                    value = value.replace(/(\d{3})(\d{3})/, '($1) $2');
                }
                e.target.value = value;
            });
        }
    }
    
    setupFormSubmission() {
        this.form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            if (!this.validateForm()) {
                return;
            }
            
            await this.submitForm();
        });
    }
    
    setupFormPersistence() {
        const inputs = this.form.querySelectorAll('input, select, textarea');
        
        // Load saved data
        inputs.forEach(input => {
            const savedValue = localStorage.getItem(`contact_${input.name}`);
            if (savedValue && input.type !== 'submit') {
                input.value = savedValue;
            }
        });
        
        // Save data as user types
        inputs.forEach(input => {
            input.addEventListener('input', () => {
                if (input.type !== 'submit') {
                    localStorage.setItem(`contact_${input.name}`, input.value);
                }
            });
        });
    }
    
    validateForm() {
        const requiredFields = this.form.querySelectorAll('[required]');
        let isValid = true;
        
        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                this.showFieldError(field, 'This field is required');
                isValid = false;
            }
        });
        
        // Additional validations
        const email = this.form.querySelector('#email');
        if (email && email.value && !this.isValidEmail(email.value)) {
            this.showFieldError(email, 'Please enter a valid email address');
            isValid = false;
        }
        
        return isValid;
    }
    
    async submitForm() {
        this.setLoadingState(true);
        
        try {
            // Simulate form submission
            // await this.simulateFormSubmission();
            this.form.submit();  // ✅ real form submission
            this.showSuccessMessage();
            this.resetForm();
            this.clearFormPersistence();
            
        } catch (error) {
            this.showErrorMessage(error.message);
        } finally {
            this.setLoadingState(false);
        }
    }
    
    async simulateFormSubmission() {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Simulate random success/failure for demo
        if (Math.random() > 0.1) { // 90% success rate
            return { success: true };
        } else {
            throw new Error('Network error. Please try again.');
        }
    }
    
    setLoadingState(loading) {
        if (loading) {
            this.submitButton.textContent = 'Sending...';
            this.submitButton.disabled = true;
            this.submitButton.style.opacity = '0.7';
        } else {
            this.submitButton.textContent = this.originalButtonText;
            this.submitButton.disabled = false;
            this.submitButton.style.opacity = '1';
        }
    }
    
    showFieldError(field, message) {
        this.clearFieldError(field);
        
        field.style.borderColor = 'var(--error-color)';
        
        const errorDiv = document.createElement('div');
        errorDiv.className = 'field-error';
        errorDiv.textContent = message;
        errorDiv.style.cssText = `
            color: var(--error-color);
            font-size: 0.875rem;
            margin-top: 5px;
            display: flex;
            align-items: center;
            gap: 5px;
        `;
        
        const icon = document.createElement('i');
        icon.className = 'fas fa-exclamation-circle';
        errorDiv.insertBefore(icon, errorDiv.firstChild);
        
        field.parentNode.appendChild(errorDiv);
    }
    
    showFieldSuccess(field) {
        this.clearFieldError(field);
        field.style.borderColor = 'var(--success-color)';
    }
    
    clearFieldError(field) {
        field.style.borderColor = 'var(--gray-200)';
        const existingError = field.parentNode.querySelector('.field-error');
        if (existingError) {
            existingError.remove();
        }
    }
    
    showSuccessMessage() {
        const message = document.createElement('div');
        message.className = 'success-message';
        message.innerHTML = `
            <div style="
                background: var(--success-color);
                color: white;
                padding: 20px;
                border-radius: var(--border-radius);
                margin-bottom: 20px;
                display: flex;
                align-items: center;
                gap: 10px;
            ">
                <i class="fas fa-check-circle" style="font-size: 1.5rem;"></i>
                <div>
                    <h4 style="margin: 0 0 5px 0;">Message Sent Successfully!</h4>
                    <p style="margin: 0; opacity: 0.9;">Thank you for contacting us. We'll get back to you within 24 hours.</p>
                </div>
            </div>
        `;
        
        this.form.parentNode.insertBefore(message, this.form);
        
        // Remove message after 5 seconds
        setTimeout(() => {
            message.remove();
        }, 5000);
        
        // Show notification
        window.showNotification('Message sent successfully!', 'success');
    }
    
    showErrorMessage(error) {
        const message = document.createElement('div');
        message.className = 'error-message';
        message.innerHTML = `
            <div style="
                background: var(--error-color);
                color: white;
                padding: 20px;
                border-radius: var(--border-radius);
                margin-bottom: 20px;
                display: flex;
                align-items: center;
                gap: 10px;
            ">
                <i class="fas fa-exclamation-triangle" style="font-size: 1.5rem;"></i>
                <div>
                    <h4 style="margin: 0 0 5px 0;">Error Sending Message</h4>
                    <p style="margin: 0; opacity: 0.9;">${error}</p>
                </div>
            </div>
        `;
        
        this.form.parentNode.insertBefore(message, this.form);
        
        // Remove message after 5 seconds
        setTimeout(() => {
            message.remove();
        }, 5000);
        
        // Show notification
        window.showNotification('Failed to send message. Please try again.', 'error');
    }
    
    resetForm() {
        this.form.reset();
        
        // Clear all field styling
        const inputs = this.form.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.style.borderColor = 'var(--gray-200)';
        });
    }
    
    clearFormPersistence() {
        const inputs = this.form.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            if (input.type !== 'submit') {
                localStorage.removeItem(`contact_${input.name}`);
            }
        });
    }
    
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
}

// Contact information interactions
class ContactInfo {
    constructor() {
        this.init();
    }
    
    init() {
        this.setupClickToCopy();
        this.setupMapInteraction();
        this.setupOfficeHours();
    }
    
    setupClickToCopy() {
        const contactItems = document.querySelectorAll('.contact-details p');
        
        contactItems.forEach(item => {
            if (item.textContent.includes('@') || item.textContent.includes('+')) {
                item.style.cursor = 'pointer';
                item.title = 'Click to copy';
                
                item.addEventListener('click', () => {
                    const text = item.textContent.trim();
                    this.copyToClipboard(text);
                });
                
                // Add hover effect
                item.addEventListener('mouseenter', () => {
                    item.style.backgroundColor = 'var(--gray-50)';
                    item.style.padding = '5px';
                    item.style.borderRadius = 'var(--border-radius)';
                });
                
                item.addEventListener('mouseleave', () => {
                    item.style.backgroundColor = '';
                    item.style.padding = '';
                    item.style.borderRadius = '';
                });
            }
        });
    }
    
    setupMapInteraction() {
        const mapContainer = document.querySelector('.map-placeholder');
        
        if (mapContainer) {
            mapContainer.style.cursor = 'pointer';
            mapContainer.addEventListener('click', () => {
                // Simulate opening map application
                window.showNotification('Opening map application...', 'info');
                window.open('https://maps.google.com/?q=123+Education+Ave,+City,+State+12345');
                
                // In a real application, you would open Google Maps or similar
                // window.open('https://maps.google.com/?q=123+Education+Ave,+City,+State+12345');
            });
        }
    }
    
    setupOfficeHours() {
        const officeHoursElement = document.querySelector('.contact-details p');
        
        if (officeHoursElement && officeHoursElement.textContent.includes('Office Hours')) {
            this.displayCurrentStatus(officeHoursElement);
        }
    }
    
    displayCurrentStatus(element) {
        const now = new Date();
        const currentHour = now.getHours();
        const currentDay = now.getDay(); // 0 = Sunday, 6 = Saturday
        
        let status = '';
        let statusColor = '';
        
        if (currentDay === 0) { // Sunday
            status = 'Closed';
            statusColor = 'var(--error-color)';
        } else if (currentDay === 6) { // Saturday
            if (currentHour >= 9 && currentHour < 16) {
                status = 'Open';
                statusColor = 'var(--success-color)';
            } else {
                status = 'Closed';
                statusColor = 'var(--error-color)';
            }
        } else { // Monday - Friday
            if (currentHour >= 8 && currentHour < 18) {
                status = 'Open';
                statusColor = 'var(--success-color)';
            } else {
                status = 'Closed';
                statusColor = 'var(--error-color)';
            }
        }
        
        const statusBadge = document.createElement('span');
        statusBadge.textContent = status;
        statusBadge.style.cssText = `
            background: ${statusColor};
            color: white;
            padding: 2px 8px;
            border-radius: 12px;
            font-size: 0.75rem;
            font-weight: 500;
            margin-left: 10px;
        `;
        
        element.appendChild(statusBadge);
    }
    
    copyToClipboard(text) {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(text).then(() => {
                window.showNotification('Copied to clipboard!', 'success');
            }).catch(() => {
                this.fallbackCopyToClipboard(text);
            });
        } else {
            this.fallbackCopyToClipboard(text);
        }
    }
    
    fallbackCopyToClipboard(text) {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        try {
            document.execCommand('copy');
            window.showNotification('Copied to clipboard!', 'success');
        } catch (err) {
            window.showNotification('Failed to copy to clipboard', 'error');
        }
        
        document.body.removeChild(textArea);
    }
}

// FAQ functionality
class ContactFAQ {
    constructor() {
        this.faqs = [
            {
                question: "What are the admission requirements?",
                answer: "Admission requirements vary by program. Generally, you need a high school diploma, entrance exam scores, and letters of recommendation. Check our Courses page for specific program requirements."
            },
            {
                question: "When is the application deadline?",
                answer: "We have multiple application deadlines: Early Decision (November 15), Regular Decision (February 1), and Late Applications (April 30)."
            },
            {
                question: "Do you offer financial aid?",
                answer: "Yes, we offer various financial aid options including merit-based scholarships, need-based aid, work-study programs, and student loans."
            },
            {
                question: "Can I schedule a campus visit?",
                answer: "Absolutely! We encourage prospective students to visit our campus. You can schedule a tour by calling our admissions office or filling out the contact form."
            },
            {
                question: "What is the student-to-faculty ratio?",
                answer: "Our student-to-faculty ratio is 15:1, ensuring personalized attention and quality education for all students."
            }
        ];
        
        this.createFAQSection();
    }
    
    createFAQSection() {
        const faqSection = document.createElement('section');
        faqSection.className = 'faq-section';
        faqSection.style.cssText = `
            background-color: var(--gray-50);
            padding: var(--spacing-3xl) 0;
        `;
        
        faqSection.innerHTML = `
            <div class="container">
                <h2 class="section-title">Frequently Asked Questions</h2>
                <div class="faq-container"></div>
            </div>
        `;
        
        // Insert before footer
        const footer = document.querySelector('.footer');
        footer.parentNode.insertBefore(faqSection, footer);
        
        this.renderFAQs(faqSection.querySelector('.faq-container'));
    }
    
    renderFAQs(container) {
        this.faqs.forEach((faq, index) => {
            const faqItem = document.createElement('div');
            faqItem.className = 'faq-item';
            faqItem.style.cssText = `
                background: white;
                border-radius: var(--border-radius);
                margin-bottom: 15px;
                box-shadow: var(--shadow-sm);
                overflow: hidden;
            `;
            
            faqItem.innerHTML = `
                <div class="faq-question" style="
                    padding: 20px;
                    cursor: pointer;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    font-weight: 600;
                    color: var(--gray-900);
                    transition: var(--transition);
                ">
                    <span>${faq.question}</span>
                    <i class="fas fa-chevron-down" style="
                        transition: var(--transition);
                        color: var(--primary-color);
                    "></i>
                </div>
                <div class="faq-answer" style="
                    padding: 0 20px;
                    max-height: 0;
                    overflow: hidden;
                    transition: all 0.3s ease;
                    color: var(--gray-600);
                    line-height: 1.6;
                ">
                    <div style="padding-bottom: 20px;">
                        ${faq.answer}
                    </div>
                </div>
            `;
            
            const question = faqItem.querySelector('.faq-question');
            const answer = faqItem.querySelector('.faq-answer');
            const icon = faqItem.querySelector('.fas');
            
            question.addEventListener('click', () => {
                const isOpen = answer.style.maxHeight && answer.style.maxHeight !== '0px';
                
                if (isOpen) {
                    answer.style.maxHeight = '0px';
                    icon.style.transform = 'rotate(0deg)';
                } else {
                    answer.style.maxHeight = answer.scrollHeight + 'px';
                    icon.style.transform = 'rotate(180deg)';
                }
            });
            
            question.addEventListener('mouseenter', () => {
                question.style.backgroundColor = 'var(--gray-50)';
            });
            
            question.addEventListener('mouseleave', () => {
                question.style.backgroundColor = '';
            });
            
            container.appendChild(faqItem);
        });
    }
}

// Initialize contact functionality
document.addEventListener('DOMContentLoaded', function() {
    new ContactForm();
    new ContactInfo();
    new ContactFAQ();
});

// Add contact-specific styles
const contactStyles = document.createElement('style');
contactStyles.textContent = `
    .field-error {
        animation: shake 0.3s ease-in-out;
    }
    
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-5px); }
        75% { transform: translateX(5px); }
    }
    
    .contact-form input:focus,
    .contact-form select:focus,
    .contact-form textarea:focus {
        transform: scale(1.02);
    }
    
    .success-message,
    .error-message {
        animation: slideIn 0.3s ease-out;
    }
    
    @keyframes slideIn {
        from {
            opacity: 0;
            transform: translateY(-20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(contactStyles);