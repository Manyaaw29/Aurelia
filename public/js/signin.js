document.addEventListener('DOMContentLoaded', () => {
    const signinForm = document.getElementById('signinForm');
    if (!signinForm) return;

    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const submitBtn = signinForm.querySelector('button[type="submit"]');
    const errorMessage = document.getElementById('errorMessage');
    const loginSuccessNotification = document.getElementById('loginSuccessNotification');
    const defaultSuccessText = loginSuccessNotification?.querySelector('p')?.textContent || '';

    const forgotPasswordLink = document.getElementById('forgotPasswordLink');
    const forgotPasswordModal = document.getElementById('forgotPasswordModal');
    const closeModal = document.getElementById('closeModal');
    const resetPasswordForm = document.getElementById('resetPasswordForm');
    const successMessage = document.getElementById('successMessage');

    const setButtonState = (isLoading) => {
        if (!submitBtn) return;
        submitBtn.disabled = isLoading;
        submitBtn.textContent = isLoading ? 'Signing In...' : 'Sign In';
    };

    const showError = (text) => {
        if (!errorMessage) return;
        errorMessage.textContent = text;
        errorMessage.classList.add('active');
    };

    const clearErrors = () => {
        if (!errorMessage) return;
        errorMessage.classList.remove('active');
        errorMessage.textContent = '';
        emailInput.classList.remove('error');
        passwordInput.classList.remove('error');
    };

    const showSuccessNotification = (message, duration = 3000, redirect = true) => {
        if (!loginSuccessNotification) return;
        const textNode = loginSuccessNotification.querySelector('p');
        if (textNode && message) {
            textNode.textContent = message;
        }
        loginSuccessNotification.classList.add('show');
        setTimeout(() => {
            loginSuccessNotification.classList.remove('show');
            if (textNode) {
                textNode.textContent = defaultSuccessText;
            }
            if (redirect) {
                window.location.href = '/';
            }
        }, duration);
    };

    // Prefill email if redirected from signup
    const storedEmail = sessionStorage.getItem('userEmail');
    if (storedEmail && emailInput) {
        emailInput.value = storedEmail;
    }

    const accountCreated = sessionStorage.getItem('accountCreated');
    if (accountCreated === 'true') {
        showSuccessNotification('Account created! Sign in to continue.', 4000, false);
        sessionStorage.removeItem('accountCreated');
    }

    signinForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        clearErrors();

        const email = emailInput.value.trim().toLowerCase();
        const password = passwordInput.value;

        if (!email || !password) {
            if (!email) emailInput.classList.add('error');
            if (!password) passwordInput.classList.add('error');
            return showError('Please enter both email and password.');
        }

        setButtonState(true);

        try {
            const response = await fetch('/api/users/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (!response.ok || !data.success) {
                throw new Error(data.message || 'Unable to sign in. Please try again.');
            }

            if (data.token) {
                localStorage.setItem('authToken', data.token);
            }
            if (data.data) {
                localStorage.setItem('userName', data.data.name || '');
                localStorage.setItem('userEmail', data.data.email || email);
            }

            showSuccessNotification('Login successful! Redirecting to homepage...');
            setTimeout(() => {
                window.location.href = '/homepage';
            }, 1500);
        } catch (error) {
            showError(error.message);
            passwordInput.classList.add('error');
        } finally {
            setButtonState(false);
        }
    });

    const clearErrorOnInput = () => {
        if (errorMessage && errorMessage.classList.contains('active')) {
            clearErrors();
        }
    };

    emailInput.addEventListener('input', clearErrorOnInput);
    passwordInput.addEventListener('input', clearErrorOnInput);

    if (forgotPasswordLink && forgotPasswordModal && closeModal && resetPasswordForm && successMessage) {
        const openForgotModal = () => {
            forgotPasswordModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        };

        const closePasswordModal = () => {
            forgotPasswordModal.classList.remove('active');
            document.body.style.overflow = 'auto';
            resetPasswordForm.reset();
            successMessage.classList.remove('active');
        };

        forgotPasswordLink.addEventListener('click', (e) => {
            e.preventDefault();
            openForgotModal();
        });

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

        resetPasswordForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const resetEmailInput = document.getElementById('resetEmail');
            const email = resetEmailInput ? resetEmailInput.value.trim() : '';

            if (!email) {
                successMessage.textContent = 'Please enter your email address.';
                successMessage.classList.add('active');
                return;
            }

            successMessage.textContent = 'If this email exists, a reset link will be sent shortly.';
            successMessage.classList.add('active');

            try {
                await fetch('/api/users/forgot-password', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email })
                });
            } catch (err) {
                console.warn('Forgot password API not implemented:', err.message);
            }

            setTimeout(closePasswordModal, 3000);
        });
    }
});