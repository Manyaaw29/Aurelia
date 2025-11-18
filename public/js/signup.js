document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('.auth-form');
    if (!form) return;

    const firstName = document.getElementById('firstName');
    const lastName = document.getElementById('lastName');
    const email = document.getElementById('email');
    const password = document.getElementById('password');
    const confirmPassword = document.getElementById('confirmPassword');
    const passwordStrength = document.getElementById('passwordStrength');
    const signupAlert = document.getElementById('signupAlert');
    const submitBtn = form.querySelector('button[type="submit"]');

    const setAlert = (message = '', variant = 'error') => {
        if (!signupAlert) return;
        signupAlert.textContent = message;
        signupAlert.style.display = message ? 'block' : 'none';
        signupAlert.className = `form-alert ${variant}`;
    };

    const showError = (input, message) => {
        const formGroup = input.closest('.form-group');
        const error = document.createElement('div');
        error.className = 'error-message';
        error.textContent = message;
        error.style.color = '#ff6b6b';
        error.style.fontSize = '0.85rem';
        error.style.marginTop = '5px';
        formGroup.appendChild(error);
        input.style.borderColor = '#ff6b6b';
    };

    const clearErrors = () => {
        document.querySelectorAll('.error-message').forEach(error => error.remove());
        document.querySelectorAll('.form-input').forEach(input => {
            input.style.borderColor = '';
        });
        setAlert('');
    };

    const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

    const updatePasswordStrength = (value) => {
        if (!passwordStrength) return;
        if (!value) {
            passwordStrength.textContent = '';
            passwordStrength.className = 'password-strength';
            return;
        }

        const score = [
            /[a-z]/.test(value),
            /[A-Z]/.test(value),
            /\d/.test(value),
            /[^A-Za-z0-9]/.test(value),
            value.length >= 8
        ].filter(Boolean).length;

        const levels = ['Weak', 'Moderate', 'Strong', 'Very Strong'];
        const classes = ['weak', 'fair', 'good', 'strong'];
        const index = Math.max(0, Math.min(score - 1, levels.length - 1));

        passwordStrength.textContent = `Password Strength: ${levels[index]}`;
        passwordStrength.className = `password-strength ${classes[index]}`;
    };

    password.addEventListener('input', (event) => updatePasswordStrength(event.target.value));

    const setButtonState = (isLoading) => {
        submitBtn.disabled = isLoading;
        submitBtn.textContent = isLoading ? 'Creating Account...' : 'Create Account';
    };

    const showSuccessModal = () => {
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
    };

    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        clearErrors();

        let isValid = true;
        const first = firstName.value.trim();
        const last = lastName.value.trim();
        const emailValue = email.value.trim().toLowerCase();
        const passwordValue = password.value;
        const confirmValue = confirmPassword.value;

        if (!first) {
            showError(firstName, 'First name is required');
            isValid = false;
        }

        if (!last) {
            showError(lastName, 'Last name is required');
            isValid = false;
        }

        if (!emailValue) {
            showError(email, 'Email is required');
            isValid = false;
        } else if (!isValidEmail(emailValue)) {
            showError(email, 'Please enter a valid email address');
            isValid = false;
        }

        if (!passwordValue) {
            showError(password, 'Password is required');
            isValid = false;
        } else if (passwordValue.length < 6) {
            showError(password, 'Password must be at least 6 characters');
            isValid = false;
        }

        if (!confirmValue) {
            showError(confirmPassword, 'Please confirm your password');
            isValid = false;
        } else if (passwordValue !== confirmValue) {
            showError(confirmPassword, 'Passwords do not match');
            isValid = false;
        }

        if (!isValid) return;

        setButtonState(true);
        setAlert('');

        try {
            const response = await fetch('/api/users/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: `${first} ${last}`.trim(),
                    email: emailValue,
                    password: passwordValue
                })
            });

            const data = await response.json();

            if (!response.ok || !data.success) {
                throw new Error(data.message || 'Unable to create account. Please try again.');
            }

            sessionStorage.setItem('accountCreated', 'true');
            sessionStorage.setItem('userEmail', emailValue);

            showSuccessModal();
            setTimeout(() => {
                window.location.href = '/signin';
            }, 1500);
        } catch (error) {
            setAlert(error.message, 'error');
        } finally {
            setButtonState(false);
        }
    });

    const inputs = [firstName, lastName, email, password, confirmPassword];
    inputs.forEach(input => {
        input.addEventListener('input', function() {
            const errorMessage = this.closest('.form-group').querySelector('.error-message');
            if (errorMessage) {
                errorMessage.remove();
                this.style.borderColor = '';
            }
            setAlert('');
        });
    });
});