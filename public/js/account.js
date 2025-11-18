// --- MODAL & GLOBAL HELPERS ---

        function openModal(modalElement) {
            modalElement.classList.add('active');
            document.body.style.overflow = 'hidden';
        }

        function closeModal(modalElement) {
            modalElement.classList.remove('active');
            // Only restore scroll if no other modals are active
            if (!document.querySelectorAll('.modal-overlay.active').length) {
                document.body.style.overflow = 'auto';
            }
        }
        
        // Helper function to show password errors
        function showPasswordError(message) {
            const errorElement = document.getElementById('passwordError');
            errorElement.textContent = message;
            errorElement.style.display = 'block';
        }

        // Helper function to clear password errors
        function clearPasswordError() {
            document.getElementById('passwordError').style.display = 'none';
            document.getElementById('passwordError').textContent = '';
        }


        // --- SIGN OUT MODAL FUNCTIONALITY ---
        const signOutLink = document.getElementById('signOutLink');
        const signOutModal = document.getElementById('signOutModal');
        const successSignOutModal = document.getElementById('successSignOutModal');
        const confirmSignOut = document.getElementById('confirmSignOut');
        const cancelSignOut = document.getElementById('cancelSignOut');

        // Open modal when sign out link is clicked
        signOutLink.addEventListener('click', function (e) {
            e.preventDefault();
            openModal(signOutModal);
        });

        // Close modal when cancel is clicked
        cancelSignOut.addEventListener('click', function () {
            closeModal(signOutModal);
        });

        // Show success message and redirect when confirm is clicked
        confirmSignOut.addEventListener('click', function () {
            closeModal(signOutModal);
            openModal(successSignOutModal);
            
            // Redirect to signin.html after 3 seconds
            setTimeout(function() {
                window.location.href = 'signin.html';
            }, 3000);
        });

        // Close modal when clicking outside of it
        signOutModal.addEventListener('click', function (e) {
            if (e.target === signOutModal) {
                closeModal(signOutModal);
            }
        });

        // --- CHANGE PASSWORD MODAL FUNCTIONALITY (NEW) ---
        const changePasswordBtn = document.getElementById('changePasswordBtn');
        const passwordModal = document.getElementById('passwordModal');
        const passwordForm = document.getElementById('passwordForm');
        const cancelPasswordChange = document.getElementById('cancelPasswordChange');
        const passwordSuccessModal = document.getElementById('passwordSuccessModal');
        const closePasswordSuccessModal = document.getElementById('closePasswordSuccessModal');

        // Open password modal
        changePasswordBtn.addEventListener('click', function() {
            clearPasswordError(); // Clear any previous error
            openModal(passwordModal);
        });

        // Close password modal (Cancel button)
        cancelPasswordChange.addEventListener('click', function() {
            passwordForm.reset(); // Clear form on cancel
            clearPasswordError(); // Clear any previous error
            closeModal(passwordModal);
        });

        // Password form submission
        passwordForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            clearPasswordError();

            const currentPass = document.getElementById('currentPassword').value;
            const newPass = document.getElementById('newPassword').value;
            const confirmPass = document.getElementById('confirmNewPassword').value;
            
            // NOTE: In a real application, you would make an AJAX call to a server
            // to securely check the current password against the stored hash and update the new one.
            // For this demonstration, we are using a simulated stored password.
            const CORRECT_CURRENT_PASSWORD = "mySecurePassword123"; 

            // 1. Check if new passwords match
            if (newPass !== confirmPass) {
                showPasswordError("Passwords don't match. Please re-enter.");
                document.getElementById('confirmNewPassword').focus();
                return;
            }

            // 2. Check current password validity (Simulated check)
            if (currentPass !== CORRECT_CURRENT_PASSWORD) {
                showPasswordError("The current password you entered is incorrect.");
                document.getElementById('currentPassword').focus();
                return;
            }
            
            // 3. Simple length/empty check (If all passes, check if fields are empty)
            if (!currentPass || !newPass || !confirmPass) {
                 showPasswordError("Please fill in all password fields.");
                return;
            }
            
            // If all validation passes:
            console.log('Password successfully changed to:', newPass);

            // Close the password modal and show success modal
            closeModal(passwordModal);
            openModal(passwordSuccessModal);
            
            passwordForm.reset(); // Clear the form fields
        });

        // Close Password Success Modal
        closePasswordSuccessModal.addEventListener('click', function() {
            closeModal(passwordSuccessModal);
        });

        // Close modal when clicking outside of it
        passwordModal.addEventListener('click', function (e) {
            if (e.target === passwordModal) {
                passwordForm.reset();
                clearPasswordError();
                closeModal(passwordModal);
            }
        });
        passwordSuccessModal.addEventListener('click', function (e) {
            if (e.target === passwordSuccessModal) {
                closeModal(passwordSuccessModal);
            }
        });
        
        // --- PERSONAL INFO FORM FUNCTIONALITY (Existing Code) ---
        const accountForm = document.getElementById('accountForm');
        const successModal = document.getElementById('successModal');
        const closeSuccessModal = document.getElementById('closeSuccessModal');
        const contactInput = document.getElementById('contact');

        // Store original values
        let originalValues = {
            firstName: document.getElementById('firstName').value,
            lastName: document.getElementById('lastName').value,
            email: document.getElementById('email').value,
            contact: document.getElementById('contact').value,
            birthday: document.getElementById('birthday').value,
            gender: document.getElementById('gender').value
        };

        // Validation message helper function
        function showValidationMessage(message) {
            // Remove any existing validation message
            const existingMessage = document.querySelector('.validation-message');
            if (existingMessage) {
                existingMessage.remove();
            }

            // Create and show validation message
            const validationMsg = document.createElement('div');
            validationMsg.className = 'validation-message';
            validationMsg.textContent = message;
            validationMsg.style.cssText = `
                color: #ff4444;
                font-size: 13px;
                margin-top: 5px;
                padding: 8px 12px;
                background: #fff5f5;
                border-radius: 4px;
                border-left: 3px solid #ff4444;
            `;

            contactInput.parentElement.appendChild(validationMsg);

            // Remove message after 5 seconds
            setTimeout(() => {
                validationMsg.remove();
            }, 5000);
        }

        // Phone Number Validation
        contactInput.addEventListener('input', function (e) {
            // Remove any non-numeric characters except + and spaces
            let value = e.target.value.replace(/[^\d+\s]/g, '');
            e.target.value = value;
        });

        contactInput.addEventListener('blur', function (e) {
            const phoneNumber = e.target.value.replace(/\s/g, '');

            // Indian phone number validation
            const indianPhoneRegex = /^\+91\d{10}$/;

            if (phoneNumber && !indianPhoneRegex.test(phoneNumber)) {
                e.target.style.borderColor = '#ff4444';
                showValidationMessage('Please enter a valid Indian phone number (+91 followed by 10 digits)');
            } else {
                e.target.style.borderColor = ''; // Reset border color
                // Remove validation message if exists
                const existingMessage = document.querySelector('.validation-message');
                if (existingMessage) {
                    existingMessage.remove();
                }
            }
        });

        // Form submission with validation
        accountForm.addEventListener('submit', function (e) {
            e.preventDefault();

            // Validate phone number before submitting
            const phoneNumber = document.getElementById('contact').value.replace(/\s/g, '');
            const indianPhoneRegex = /^\+91\d{10}$/;

            if (!indianPhoneRegex.test(phoneNumber)) {
                contactInput.style.borderColor = '#ff4444';
                showValidationMessage('Please enter a valid Indian phone number (+91 followed by 10 digits)');
                contactInput.focus();
                return;
            }

            // Update original values with new ones
            originalValues = {
                firstName: document.getElementById('firstName').value,
                lastName: document.getElementById('lastName').value,
                email: document.getElementById('email').value,
                contact: document.getElementById('contact').value,
                birthday: document.getElementById('birthday').value,
                gender: document.getElementById('gender').value
            };

            // Show success modal
            openModal(successModal);

            // Here you would typically send the data to a server
            console.log('Personal Info Form submitted with values:', originalValues);
        });

        // Close success modal
        closeSuccessModal.addEventListener('click', function () {
            closeModal(successModal);
        });

        // Close modal when clicking outside
        successModal.addEventListener('click', function (e) {
            if (e.target === successModal) {
                closeModal(successModal);
            }
        });

        // Cancel Button Handler
        const cancelBtn = document.getElementById('cancelBtn');
        cancelBtn.addEventListener('click', function () {
            // Restore original values (no changes applied)
            document.getElementById('firstName').value = originalValues.firstName;
            document.getElementById('lastName').value = originalValues.lastName;
            document.getElementById('email').value = originalValues.email;
            document.getElementById('contact').value = originalValues.contact;
            document.getElementById('birthday').value = originalValues.birthday;
            document.getElementById('gender').value = originalValues.gender;

            // Reset border colors and remove validation messages
            contactInput.style.borderColor = '';
            const existingMessage = document.querySelector('.validation-message');
            if (existingMessage) {
                existingMessage.remove();
            }
        });

        // --- OTHER UTILITIES (Existing Code) ---

        // Newsletter Form Handler
        const newsletterForm = document.getElementById('newsletterForm');
        newsletterForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const emailInput = this.querySelector('.newsletter-input');
            alert(`Thank you for subscribing with ${emailInput.value}!`);
            emailInput.value = '';
        });

        // Search Input Handler
        const searchInput = document.querySelector('.search-input');
        searchInput.addEventListener('keypress', function (e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                const searchTerm = this.value.trim();
                if (searchTerm) {
                    alert(`Searching for: ${searchTerm}`);
                }
            }
        });

        // Active Menu Item Highlight
        const menuLinks = document.querySelectorAll('.sidebar-menu a');
        menuLinks.forEach(link => {
            link.addEventListener('click', function (e) {
                menuLinks.forEach(l => l.classList.remove('active'));
                if (this.id !== 'signOutLink') {
                    this.classList.add('active');
                }
            });
        });

        // Form Input Focus Animation
        const formInputs = document.querySelectorAll('.form-input, .form-select');
        formInputs.forEach(input => {
            input.addEventListener('focus', function () {
                this.style.transform = 'scale(1.01)';
            });

            input.addEventListener('blur', function () {
                this.style.transform = 'scale(1)';
            });
        });

        // Smooth scroll for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                const href = this.getAttribute('href');
                // Exclude the sign out link from smooth scroll logic
                if (href !== '#' && this.id !== 'signOutLink') { 
                    e.preventDefault();
                    const target = document.querySelector(href);
                    if (target) {
                        target.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });
                    }
                }
            });
        });