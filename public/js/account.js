// --- LOAD USER DATA ON PAGE LOAD ---
document.addEventListener('DOMContentLoaded', async () => {
    await loadUserData();
});

async function loadUserData() {
    try {
        const token = localStorage.getItem('authToken');
        if (!token) {
            window.location.href = '/signin';
            return;
        }

        const response = await fetch('/api/users/me', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            localStorage.removeItem('authToken');
            window.location.href = '/signin';
            return;
        }

        const data = await response.json();
        if (data.success && data.data) {
            const user = data.data;
            const nameParts = user.name ? user.name.split(' ') : ['', ''];
            
            document.getElementById('firstName').value = nameParts[0] || '';
            document.getElementById('lastName').value = nameParts.slice(1).join(' ') || '';
            document.getElementById('email').value = user.email || '';
            document.getElementById('contact').value = user.phone || '';
            
            if (user.birthday) {
                document.getElementById('birthday').value = user.birthday.split('T')[0];
            }
            if (user.gender) {
                document.getElementById('gender').value = user.gender;
            }
            
            // Update original values after loading
            updateOriginalValues();
        }
    } catch (error) {
        console.error('Error loading user data:', error);
        showNotification('Error loading user data', 'error');
    }
}

function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#D4AF37' : '#ff4444'};
        color: ${type === 'success' ? '#000' : '#fff'};
        padding: 15px 25px;
        border-radius: 10px;
        font-weight: 600;
        z-index: 10001;
        animation: slideIn 0.3s ease;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    `;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

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

// Function to save account updates
async function saveAccountChanges(e) {
    e.preventDefault();
    
    const token = localStorage.getItem('authToken');
    if (!token) {
        showNotification('Please login to update your account.', 'error');
        setTimeout(() => window.location.href = '/signin', 1500);
        return;
    }
    
    const firstName = document.getElementById('firstName').value.trim();
    const lastName = document.getElementById('lastName').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('contact').value.trim();
    const birthday = document.getElementById('birthday').value;
    const gender = document.getElementById('gender').value;
    
    if (!firstName || !lastName || !email) {
        showNotification('Please fill in all required fields.', 'error');
        return;
    }
    
    // Validate phone number
    const phoneNumber = phone.replace(/\s/g, '');
    const indianPhoneRegex = /^\+91\d{10}$/;
    if (phone && !indianPhoneRegex.test(phoneNumber)) {
        showNotification('Please enter a valid Indian phone number (+91 followed by 10 digits)', 'error');
        return;
    }
    
    try {
        const response = await fetch('/api/users/me', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                name: `${firstName} ${lastName}`,
                email: email,
                phone: phone,
                birthday: birthday || undefined,
                gender: gender || undefined
            })
        });
        
        const data = await response.json();
        
        if (data.success) {
            localStorage.setItem('userName', data.data.name);
            updateOriginalValues();
            openModal(successModal);
        } else {
            throw new Error(data.message || 'Failed to update account');
        }
    } catch (error) {
        console.error('Error updating account:', error);
        showNotification('Error updating account: ' + error.message, 'error');
    }
}

// Function to update original values
function updateOriginalValues() {
    originalValues = {
        firstName: document.getElementById('firstName').value,
        lastName: document.getElementById('lastName').value,
        email: document.getElementById('email').value,
        contact: document.getElementById('contact').value,
        birthday: document.getElementById('birthday').value,
        gender: document.getElementById('gender').value
    };
}

// --- CHANGE PASSWORD FUNCTIONALITY ---
async function changePassword(currentPassword, newPassword) {
    const token = localStorage.getItem('authToken');
    if (!token) {
        showNotification('Please login to change your password.', 'error');
        setTimeout(() => window.location.href = '/signin', 1500);
        return false;
    }
    
    try {
        const response = await fetch('/api/users/change-password', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                currentPassword: currentPassword,
                newPassword: newPassword
            })
        });
        
        const data = await response.json();
        
        if (data.success) {
            return true;
        } else {
            throw new Error(data.message || 'Failed to change password');
        }
    } catch (error) {
        console.error('Error changing password:', error);
        throw error;
    }
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
    
    // Clear auth token and redirect to signin
    localStorage.removeItem('authToken');
    localStorage.removeItem('userName');
    
    setTimeout(function() {
        window.location.href = '/signin';
    }, 3000);
});

// Close modal when clicking outside of it
signOutModal.addEventListener('click', function (e) {
    if (e.target === signOutModal) {
        closeModal(signOutModal);
    }
});

// --- CHANGE PASSWORD MODAL FUNCTIONALITY ---
const changePasswordBtn = document.getElementById('changePasswordBtn');
const passwordModal = document.getElementById('passwordModal');
const passwordForm = document.getElementById('passwordForm');
const cancelPasswordChange = document.getElementById('cancelPasswordChange');
const passwordSuccessModal = document.getElementById('passwordSuccessModal');
const closePasswordSuccessModal = document.getElementById('closePasswordSuccessModal');

// Open password modal
changePasswordBtn.addEventListener('click', function() {
    clearPasswordError();
    passwordForm.reset();
    openModal(passwordModal);
});

// Close password modal (Cancel button)
cancelPasswordChange.addEventListener('click', function() {
    passwordForm.reset();
    clearPasswordError();
    closeModal(passwordModal);
});

// Password form submission with backend integration
passwordForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    clearPasswordError();

    const currentPass = document.getElementById('currentPassword').value;
    const newPass = document.getElementById('newPassword').value;
    const confirmPass = document.getElementById('confirmNewPassword').value;
    
    // 1. Check if all fields are filled
    if (!currentPass || !newPass || !confirmPass) {
        showPasswordError("Please fill in all password fields.");
        return;
    }
    
    // 2. Check if new passwords match
    if (newPass !== confirmPass) {
        showPasswordError("New passwords don't match. Please re-enter.");
        document.getElementById('confirmNewPassword').focus();
        return;
    }
    
    // 3. Check password strength (minimum 8 characters)
    if (newPass.length < 8) {
        showPasswordError("New password must be at least 8 characters long.");
        document.getElementById('newPassword').focus();
        return;
    }
    
    // 4. Check if new password is different from current
    if (currentPass === newPass) {
        showPasswordError("New password must be different from current password.");
        document.getElementById('newPassword').focus();
        return;
    }
    
    try {
        // Show loading state
        const submitBtn = passwordForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Changing Password...';
        submitBtn.disabled = true;
        
        // Call backend API to change password
        await changePassword(currentPass, newPass);
        
        // Reset button state
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        
        // Close the password modal and show success modal
        closeModal(passwordModal);
        openModal(passwordSuccessModal);
        
        passwordForm.reset();
    } catch (error) {
        // Reset button state
        const submitBtn = passwordForm.querySelector('button[type="submit"]');
        submitBtn.textContent = 'Save Changes';
        submitBtn.disabled = false;
        
        // Show error message
        if (error.message.includes('incorrect') || error.message.includes('current password')) {
            showPasswordError("The current password you entered is incorrect.");
            document.getElementById('currentPassword').focus();
        } else {
            showPasswordError(error.message || "Failed to change password. Please try again.");
        }
    }
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

// --- PERSONAL INFO FORM FUNCTIONALITY ---
const accountForm = document.getElementById('accountForm');
const successModal = document.getElementById('successModal');
const closeSuccessModal = document.getElementById('closeSuccessModal');
const contactInput = document.getElementById('contact');

// Store original values
let originalValues = {
    firstName: '',
    lastName: '',
    email: '',
    contact: '',
    birthday: '',
    gender: ''
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
        e.target.style.borderColor = '';
        // Remove validation message if exists
        const existingMessage = document.querySelector('.validation-message');
        if (existingMessage) {
            existingMessage.remove();
        }
    }
});

// Form submission with validation
accountForm.addEventListener('submit', async function (e) {
    e.preventDefault();

    // Validate phone number before submitting
    const phoneNumber = document.getElementById('contact').value.replace(/\s/g, '');
    const indianPhoneRegex = /^\+91\d{10}$/;

    if (phoneNumber && !indianPhoneRegex.test(phoneNumber)) {
        contactInput.style.borderColor = '#ff4444';
        showValidationMessage('Please enter a valid Indian phone number (+91 followed by 10 digits)');
        contactInput.focus();
        return;
    }

    // Show loading state on submit button
    const submitBtn = accountForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Saving...';
    submitBtn.disabled = true;

    await saveAccountChanges(e);

    // Reset button state
    submitBtn.textContent = originalText;
    submitBtn.disabled = false;
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

// --- OTHER UTILITIES ---

// Newsletter Form Handler
const newsletterForm = document.getElementById('newsletterForm');
if (newsletterForm) {
    newsletterForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const emailInput = this.querySelector('.newsletter-input');
        alert(`Thank you for subscribing with ${emailInput.value}!`);
        emailInput.value = '';
    });
}

// Search Input Handler
const searchInput = document.querySelector('.search-input');
if (searchInput) {
    searchInput.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            const searchTerm = this.value.trim();
            if (searchTerm) {
                alert(`Searching for: ${searchTerm}`);
            }
        }
    });
}

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