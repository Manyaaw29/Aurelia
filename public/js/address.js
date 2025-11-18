// A simple data structure to hold and manage addresses in memory
        let addresses = [{
            id: 1,
            type: 'Home',
            name: 'Priya Sharma',
            line1: '123, Green Valley Apartments',
            line2: 'Andheri West',
            city: 'Mumbai',
            state: 'Maharashtra',
            zip: '400001',
            country: 'India',
            phone: '+91 9876543210',
            isDefault: true
        },
        {
            id: 2,
            type: 'Office',
            name: 'Priya Sharma',
            line1: 'Tech Tower, 5th Floor',
            line2: 'Bandra Kurla Complex',
            city: 'Mumbai',
            state: 'Maharashtra',
            zip: '400051',
            country: 'India',
            phone: '+91 9876543210',
            isDefault: false
        }
        ];

        // --- DOM Elements ---
        const addressesGrid = document.getElementById('addressesGrid');
        const addressModal = document.getElementById('addressModal');
        const form = document.getElementById('addressForm');
        const openAddModalBtn = document.getElementById('openAddModalBtn');
        const closeBtn = addressModal.querySelector('.close-btn');
        const modalTitle = document.getElementById('modalTitle');
        const addressIdInput = document.getElementById('addressId');
        const phoneInput = document.getElementById('phoneNumber');

        // Notification Elements
        const notificationModal = document.getElementById('notificationModal');
        const notificationMessage = document.getElementById('notificationMessage');

        // Confirmation Elements
        const confirmModal = document.getElementById('confirmModal');
        const confirmCancel = document.getElementById('confirmCancel');
        const confirmDelete = document.getElementById('confirmDelete');
        let addressToDeleteId = null;

        // Sign Out Modal Elements
        const signOutLink = document.getElementById('signOutLink');
        const signOutModal = document.getElementById('signOutModal');
        const successSignOutModal = document.getElementById('successSignOutModal');
        const confirmSignOut = document.getElementById('confirmSignOut');
        const cancelSignOut = document.getElementById('cancelSignOut');

        let nextId = addresses.length > 0 ? Math.max(...addresses.map(a => a.id)) + 1 : 1;

        // --- Utility Functions ---

        function showNotification(message) {
            notificationMessage.textContent = message;
            notificationModal.classList.add('show');

            setTimeout(() => {
                notificationModal.classList.remove('show');
            }, 3000);
        }

        function closeModal() {
            addressModal.style.display = 'none';
            form.reset();
            addressIdInput.value = '';
            // Clear validation errors
            phoneInput.style.borderColor = '';
            const validationMsg = document.querySelector('.validation-message');
            if (validationMsg) validationMsg.remove();
        }

        function closeConfirmModal() {
            confirmModal.style.display = 'none';
            addressToDeleteId = null;
        }

        function showPhoneValidationMessage(message) {
            // Remove any existing validation message
            const existingMessage = document.querySelector('.validation-message');
            if (existingMessage) {
                existingMessage.remove();
            }

            // Create and show validation message
            const validationMsg = document.createElement('div');
            validationMsg.className = 'validation-message';
            validationMsg.textContent = message;

            phoneInput.parentElement.appendChild(validationMsg);

            // Remove message after 5 seconds
            setTimeout(() => {
                validationMsg.remove();
            }, 5000);
        }

        function openModal(address = null) {
            if (address) {
                // Edit Mode
                modalTitle.textContent = 'Edit Address';
                addressIdInput.value = address.id;
                document.getElementById('addressType').value = address.type;
                document.getElementById('fullName').value = address.name;
                document.getElementById('addressLine1').value = address.line1;
                document.getElementById('addressLine2').value = address.line2;
                document.getElementById('city').value = address.city;
                document.getElementById('state').value = address.state;
                document.getElementById('zipCode').value = address.zip;
                document.getElementById('country').value = address.country;
                document.getElementById('phoneNumber').value = address.phone;
                document.getElementById('isDefault').checked = address.isDefault;
            } else {
                // Add Mode
                modalTitle.textContent = 'Add New Address';
                form.reset();
                addressIdInput.value = '';
                document.getElementById('country').value = 'India';
                document.getElementById('isDefault').checked = addresses.length === 0;
            }
            addressModal.style.display = 'block';
        }

        function renderAddressCard(address) {
            const isDefaultClass = address.isDefault ? ' default' : '';
            const defaultBadge = address.isDefault ?
                '<span class="default-badge">Default</span>' :
                '';
            const setDefaultButton = address.isDefault ?
                '' :
                `<a href="#" class="action-link set-default-btn" data-address-id="${address.id}">Set as Default</a>`;

            return `
            <div class="address-card${isDefaultClass}" data-address-id="${address.id}">
                ${defaultBadge}
                <div class="address-header">
                    <div class="address-type">${address.type}</div>
                </div>
                <div class="address-name">${address.name}</div>
                <div class="address-details">
                    ${address.line1}<br>
                    ${address.line2 ? address.line2 + '<br>' : ''}
                    ${address.city}, ${address.state} ${address.zip}<br>
                    ${address.country}
                </div>
                <div class="address-phone">Phone: ${address.phone}</div>
                <div class="address-actions">
                    <a href="#" class="action-link edit-address-btn" data-address-id="${address.id}">Edit</a>
                    ${setDefaultButton}
                    <a href="#" class="action-link remove remove-address-btn" data-address-id="${address.id}">Remove</a>
                </div>
            </div>
        `;
        }

        function renderAddresses() {
            addressesGrid.innerHTML = '';
            addresses.sort((a, b) => (b.isDefault - a.isDefault));

            if (addresses.length === 0) {
                addressesGrid.innerHTML =
                    '<p style="color: #CCCCCC; grid-column: 1/-1;">You have no saved addresses. Click "Add New Address" to begin.</p>';
                return;
            }

            addresses.forEach(address => {
                addressesGrid.innerHTML += renderAddressCard(address);
            });
            attachEventListeners();
        }

        // --- Phone Number Validation ---
        phoneInput.addEventListener('input', function (e) {
            // Remove any non-numeric characters except + and spaces
            let value = e.target.value.replace(/[^\d+\s]/g, '');
            e.target.value = value;
        });

        phoneInput.addEventListener('blur', function (e) {
            const phoneNumber = e.target.value.replace(/\s/g, '');

            // Indian phone number validation
            const indianPhoneRegex = /^\+91\d{10}$/;

            if (phoneNumber && !indianPhoneRegex.test(phoneNumber)) {
                e.target.style.borderColor = '#ff4444';
                showPhoneValidationMessage('Please enter a valid Indian phone number (+91 followed by 10 digits)');
            } else {
                e.target.style.borderColor = '';
                const existingMessage = document.querySelector('.validation-message');
                if (existingMessage) {
                    existingMessage.remove();
                }
            }
        });

        // --- Core Logic Functions ---

        function handleSaveAddress(e) {
            e.preventDefault();

            // Validate phone number before saving
            const phoneNumber = phoneInput.value.replace(/\s/g, '');
            const indianPhoneRegex = /^\+91\d{10}$/;

            if (!indianPhoneRegex.test(phoneNumber)) {
                phoneInput.style.borderColor = '#ff4444';
                showPhoneValidationMessage('Please enter a valid Indian phone number (+91 followed by 10 digits)');
                phoneInput.focus();
                return;
            }

            const isEdit = !!addressIdInput.value;
            const id = isEdit ? parseInt(addressIdInput.value) : nextId;

            const newAddress = {
                id: id,
                type: form.addressType.value,
                name: form.fullName.value,
                line1: form.addressLine1.value,
                line2: form.addressLine2.value,
                city: form.city.value,
                state: form.state.value,
                zip: form.zipCode.value,
                country: form.country.value,
                phone: form.phoneNumber.value,
                isDefault: form.isDefault.checked
            };

            // Manage Default Status
            if (newAddress.isDefault) {
                addresses.forEach(a => a.isDefault = false);
            } else if (addresses.length === 0 || (isEdit && addresses.length === 1)) {
                newAddress.isDefault = true;
            }

            // Add or Update
            if (isEdit) {
                const index = addresses.findIndex(a => a.id === id);
                if (index !== -1) {
                    addresses[index] = newAddress;
                }
            } else {
                addresses.push(newAddress);
                nextId++;
                if (addresses.length === 1) {
                    newAddress.isDefault = true;
                }
            }

            // Force the first one to be default if none is set
            if (!addresses.some(a => a.isDefault) && addresses.length > 0) {
                addresses[0].isDefault = true;
            }

            renderAddresses();
            closeModal();
            showNotification(`Address ${isEdit ? 'Edited' : 'Saved'} Successfully!`);
        }

        function executeDeleteAddress(id) {
            const index = addresses.findIndex(a => a.id === id);
            if (index !== -1) {
                const wasDefault = addresses[index].isDefault;
                addresses.splice(index, 1);

                if (wasDefault && addresses.length > 0) {
                    addresses[0].isDefault = true;
                }
                renderAddresses();
                showNotification('Address Deleted!');
            }
        }

        function deleteAddress(id) {
            addressToDeleteId = id;
            confirmModal.style.display = 'block';
        }

        function setDefaultAddress(id) {
            addresses.forEach(address => {
                address.isDefault = address.id === id;
            });
            renderAddresses();
            showNotification('Default Address Updated!');
        }

        function attachEventListeners() {
            // Edit Button Listener
            document.querySelectorAll('.edit-address-btn').forEach(button => {
                button.onclick = (e) => {
                    e.preventDefault();
                    const id = parseInt(e.target.dataset.addressId);
                    const address = addresses.find(a => a.id === id);
                    if (address) {
                        openModal(address);
                    }
                };
            });

            // Remove Button Listener
            document.querySelectorAll('.remove-address-btn').forEach(button => {
                button.onclick = (e) => {
                    e.preventDefault();
                    const id = parseInt(e.target.dataset.addressId);
                    deleteAddress(id);
                };
            });

            // Set as Default Button Listener
            document.querySelectorAll('.set-default-btn').forEach(button => {
                button.onclick = (e) => {
                    e.preventDefault();
                    const id = parseInt(e.target.dataset.addressId);
                    setDefaultAddress(id);
                };
            });
        }

        // --- Sign Out Modal Functionality ---
        signOutLink.addEventListener('click', function (e) {
            e.preventDefault();
            signOutModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });

        cancelSignOut.addEventListener('click', function () {
            signOutModal.classList.remove('active');
            document.body.style.overflow = 'auto';
        });

        confirmSignOut.addEventListener('click', function () {
            signOutModal.classList.remove('active');
            successSignOutModal.classList.add('active');
            
            setTimeout(function() {
                window.location.href = 'signin.html';
            }, 3000);
        });

        signOutModal.addEventListener('click', function (e) {
            if (e.target === signOutModal) {
                signOutModal.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
        });

        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && signOutModal.classList.contains('active')) {
                signOutModal.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
        });

        // --- Initialization & Main Event Listeners ---

        openAddModalBtn.onclick = () => openModal();
        closeBtn.onclick = closeModal;
        addressModal.addEventListener('click', (event) => {
            if (event.target == addressModal) {
                closeModal();
            }
        });
        form.onsubmit = handleSaveAddress;

        confirmCancel.onclick = closeConfirmModal;
        confirmDelete.onclick = () => {
            if (addressToDeleteId !== null) {
                executeDeleteAddress(addressToDeleteId);
            }
            closeConfirmModal();
        };
        confirmModal.addEventListener('click', (event) => {
            if (event.target == confirmModal) {
                closeConfirmModal();
            }
        });

        document.addEventListener('DOMContentLoaded', renderAddresses);

        // --- Newsletter Subscription Logic ---
        const newsletterForm = document.querySelector('.newsletter-form');
        const newsletterInput = document.querySelector('.newsletter-input');
        const subscribedEmails = new Set();

        newsletterForm.addEventListener('submit', (event) => {
            event.preventDefault();
            const email = newsletterInput.value.trim();

            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (!emailPattern.test(email)) {
                showNotification("❌ Invalid email address. Please enter a valid one.");
                return;
            }

            if (subscribedEmails.has(email)) {
                showNotification("📩 You're already subscribed!");
            } else {
                subscribedEmails.add(email);
                showNotification("✅ Thank you for subscribing!");
                newsletterInput.value = "";
            }
        });