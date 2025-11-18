document.addEventListener('DOMContentLoaded', function() {
            const form = document.querySelector('.auth-form');
            const firstName = document.getElementById('firstName');
            const lastName = document.getElementById('lastName');
            const email = document.getElementById('email');
            const password = document.getElementById('password');
            const confirmPassword = document.getElementById('confirmPassword');

            // Form submission handler
            form.addEventListener('submit', function(e) {
                e.preventDefault();
                
                // Clear previous error messages
                clearErrors();
                
                // Validate form
                let isValid = true;
                
                // First name validation
                if (firstName.value.trim() === '') {
                    showError(firstName, 'First name is required');
                    isValid = false;
                }
                
                // Last name validation
                if (lastName.value.trim() === '') {
                    showError(lastName, 'Last name is required');
                    isValid = false;
                }
                
                // Email validation
                if (email.value.trim() === '') {
                    showError(email, 'Email is required');
                    isValid = false;
                } else if (!isValidEmail(email.value)) {
                    showError(email, 'Please enter a valid email address');
                    isValid = false;
                }
                
                // Password validation
                if (password.value.trim() === '') {
                    showError(password, 'Password is required');
                    isValid = false;
                } else if (password.value.length < 6) {
                    showError(password, 'Password must be at least 6 characters');
                    isValid = false;
                }
                
                // Confirm password validation
                if (confirmPassword.value.trim() === '') {
                    showError(confirmPassword, 'Please confirm your password');
                    isValid = false;
                } else if (password.value !== confirmPassword.value) {
                    showError(confirmPassword, 'Passwords do not match');
                    isValid = false;
                }
                
                // If form is valid, create account
                if (isValid) {
                    createAccount();
                }
            });
            
            // Function to validate email format
            function isValidEmail(email) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                return emailRegex.test(email);
            }
            
            // Function to show error message
            function showError(input, message) {
                const formGroup = input.closest('.form-group');
                const error = document.createElement('div');
                error.className = 'error-message';
                error.textContent = message;
                error.style.color = '#ff6b6b';
                error.style.fontSize = '0.85rem';
                error.style.marginTop = '5px';
                formGroup.appendChild(error);
                input.style.borderColor = '#ff6b6b';
            }
            
            // Function to clear all error messages
            function clearErrors() {
                const errorMessages = document.querySelectorAll('.error-message');
                errorMessages.forEach(error => error.remove());
                
                const inputs = document.querySelectorAll('.form-input');
                inputs.forEach(input => {
                    input.style.borderColor = '';
                });
            }
            
            // Function to create account and redirect
            function createAccount() {
                // Store user data (in a real app, this would be sent to a server)
                const userData = {
                    firstName: firstName.value.trim(),
                    lastName: lastName.value.trim(),
                    email: email.value.trim(),
                    createdAt: new Date().toISOString()
                };
                
                // Store in memory (simulating account creation)
                const accounts = JSON.parse(sessionStorage.getItem('accounts') || '[]');
                accounts.push(userData);
                sessionStorage.setItem('accounts', JSON.stringify(accounts));
                
                // Set success flag
                sessionStorage.setItem('accountCreated', 'true');
                sessionStorage.setItem('userEmail', userData.email);
                
                // Show success message briefly before redirect
                showSuccessMessage();
                
                // Redirect to sign in page after 1.5 seconds
                setTimeout(function() {
                    window.location.href = 'signin.html';
                }, 1500);
            }
            
            // Function to show success message
            function showSuccessMessage() {
                const successDiv = document.createElement('div');
                successDiv.className = 'success-modal';
                successDiv.innerHTML = `
                    <div class="modal-overlay"></div>
                    <div class="modal-content">
                        <div class="success-icon">✓</div>
                        <h2 class="success-title">Account Created!</h2>
                        <p class="success-text">Redirecting to sign in...</p>
                    </div>
                `;
                document.body.appendChild(successDiv);
            }
            
            // Real-time validation on input
            const inputs = [firstName, lastName, email, password, confirmPassword];
            inputs.forEach(input => {
                input.addEventListener('input', function() {
                    // Remove error styling when user starts typing
                    const errorMessage = this.closest('.form-group').querySelector('.error-message');
                    if (errorMessage) {
                        errorMessage.remove();
                        this.style.borderColor = '';
                    }
                });
            });
        });