// ==========================================================
        // JAVASCRIPT LOGIC
        // ==========================================================

        // Simulated database of existing accounts with associated passwords
        const existingAccounts = [
            { email: 'user@example.com', password: 'password123' },
            { email: 'demo@aurelia.com', password: 'demo' },
            { email: 'test@test.com', password: 'test' }
        ];

        const signinForm = document.getElementById('signinForm');
        const emailInput = document.getElementById('email');
        const passwordInput = document.getElementById('password');
        const errorMessage = document.getElementById('errorMessage');
        // 🚨 NEW VARIABLE: Reference to the global success notification
        const loginSuccessNotification = document.getElementById('loginSuccessNotification'); 


        signinForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const email = emailInput.value.trim().toLowerCase();
            const password = passwordInput.value;
            
            // Find the account object that matches the email
            const userAccount = existingAccounts.find(account => account.email === email);
            
            // Reset previous errors/styles
            errorMessage.classList.remove('active');
            emailInput.classList.remove('error');
            passwordInput.classList.remove('error');

            let errorText = '';
            let isError = false;

            // 1. Check if the account exists
            if (!userAccount) {
                errorText = "Account doesn't exist. Please sign up first.";
                isError = true;
                emailInput.classList.add('error');
            } 
            // 2. If the account exists, check the password
            else if (userAccount.password !== password) {
                errorText = "Invalid email or password. Please try again.";
                isError = true;
                // Apply error only to the password field for better UX
                passwordInput.classList.add('error'); 
            }

            // Handle Error State
            if (isError) {
                errorMessage.textContent = errorText; // Set the specific error message
                errorMessage.classList.add('active');
                
                // Auto-hide error after 5 seconds
                setTimeout(() => {
                    errorMessage.classList.remove('active');
                    emailInput.classList.remove('error');
                    passwordInput.classList.remove('error');
                }, 5000);
            } 
            // Handle Success State (UPDATED: Show notification and redirect)
            else {
                console.log('Login successful:', { email, password });
                
                // 1. Show the success notification box
                loginSuccessNotification.classList.add('show');
                
                // 2. Set the timeout for redirection
                setTimeout(() => {
                    // Hide the notification (optional cleanup)
                    loginSuccessNotification.classList.remove('show');
                    
                    // Redirect to the home page
                    window.location.href = 'homepage.html'; 
                }, 3000); // 3000 milliseconds = 3 seconds
            }
        });

        // Clear error when user starts typing in EITHER field
        const clearErrorOnInput = function() {
            if (errorMessage.classList.contains('active')) {
                errorMessage.classList.remove('active');
                emailInput.classList.remove('error');
                passwordInput.classList.remove('error');
            }
        };

        emailInput.addEventListener('input', clearErrorOnInput);
        passwordInput.addEventListener('input', clearErrorOnInput);


        // ==========================================================
        // FORGOT PASSWORD MODAL LOGIC (UNCHANGED)
        // ==========================================================
        const forgotPasswordLink = document.getElementById('forgotPasswordLink');
        const forgotPasswordModal = document.getElementById('forgotPasswordModal');
        const closeModal = document.getElementById('closeModal');
        const resetPasswordForm = document.getElementById('resetPasswordForm');
        const successMessage = document.getElementById('successMessage');

        // Open modal
        forgotPasswordLink.addEventListener('click', (e) => {
            e.preventDefault();
            forgotPasswordModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });

        // Close modal function
        const closePasswordModal = () => {
            forgotPasswordModal.classList.remove('active');
            document.body.style.overflow = 'auto';
            resetPasswordForm.reset();
            successMessage.classList.remove('active');
        };

        // Close modal listeners
        closeModal.addEventListener('click', closePasswordModal);

        forgotPasswordModal.addEventListener('click', (e) => {
            if (e.target === forgotPasswordModal) {
                closePasswordModal();
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && forgotPasswordModal.classList.contains('active')) {
                closePasswordModal();
            }
        });

        // Handle form submission for reset
        resetPasswordForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('resetEmail').value;

            // Show success message
            successMessage.classList.add('active');
            console.log('Password reset requested for:', email);

            // Auto-close modal after 3 seconds
            setTimeout(closePasswordModal, 3000);
        });