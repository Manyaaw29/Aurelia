let orderItems = [];
        let appliedCoupon = null;
        const GST_RATE = 0.03;

        // Load cart items from API
        async function loadCartItems() {
            try {
                const response = await fetch('/api/cart');
                const data = await response.json();
                
                if (data.success && data.cart && data.cart.items) {
                    orderItems = data.cart.items.map(item => ({
                        name: item.product.name,
                        price: item.product.price,
                        originalQuantity: item.quantity,
                        quantity: item.quantity,
                        image: item.product.images && item.product.images.length > 0 
                            ? item.product.images[0] 
                            : '/images/placeholder.jpg',
                        productId: item.product._id
                    }));
                    updateOrderSummary();
                } else {
                    console.log('Cart is empty');
                }
            } catch (error) {
                console.error('Error loading cart:', error);
            }
        }

        function applyDiwaliCoupon() {
            orderItems.forEach(item => item.quantity = item.originalQuantity * 2);
        }

        function showAddressMessage(message, type = 'error') {
            const container = document.querySelector('.address-notification');
            container.innerHTML = '';
            
            const messageDiv = document.createElement('div');
            messageDiv.className = `address-message ${type}`;
            messageDiv.textContent = message;
            
            container.appendChild(messageDiv);
            setTimeout(() => messageDiv.classList.add('show'), 10);
            
            // Scroll to the error message
            setTimeout(() => {
                const addressSection = document.querySelector('.checkout-section');
                if (addressSection) {
                    addressSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    window.scrollBy(0, -100); // Adjust for header
                }
            }, 150);
            
            setTimeout(() => {
                messageDiv.style.animation = 'fadeOut 0.3s ease';
                setTimeout(() => {
                    if (messageDiv.parentNode) {
                        messageDiv.remove();
                    }
                }, 300);
            }, 4000);
        }

        function showPaymentMessage(message, type = 'error') {
            const container = document.querySelector('.payment-notification');
            container.innerHTML = '';
            
            const messageDiv = document.createElement('div');
            messageDiv.className = `address-message ${type}`;
            messageDiv.textContent = message;
            
            container.appendChild(messageDiv);
            setTimeout(() => messageDiv.classList.add('show'), 10);
            
            // Scroll to the payment error message
            setTimeout(() => {
                const paymentSection = document.querySelectorAll('.checkout-section')[1];
                if (paymentSection) {
                    paymentSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    window.scrollBy(0, -100); // Adjust for header
                }
            }, 150);
            
            setTimeout(() => {
                messageDiv.style.animation = 'fadeOut 0.3s ease';
                setTimeout(() => {
                    if (messageDiv.parentNode) {
                        messageDiv.remove();
                    }
                }, 300);
            }, 4000);
        }

        function initializeAddressEditing() {
            const editBtn = document.querySelector('.edit-address-btn');
            const saveBtn = document.querySelector('.save-address-btn');
            const cancelBtn = document.querySelector('.cancel-address-btn');
            const formInputs = document.querySelectorAll('.checkout-section form input, .checkout-section form select');
            
            let originalValues = {};
            
            function saveOriginalValues() {
                formInputs.forEach((input, index) => {
                    originalValues[index] = input.value;
                });
            }
            
            saveOriginalValues();
            formInputs.forEach(input => input.disabled = true);
            
            editBtn.addEventListener('click', function() {
                formInputs.forEach(input => input.disabled = false);
                editBtn.style.display = 'none';
                saveBtn.style.display = 'inline-block';
                cancelBtn.style.display = 'inline-block';
                
                formInputs.forEach(input => {
                    input.style.borderColor = '#D4AF37';
                    input.style.background = 'rgba(212, 175, 55, 0.08)';
                });
            });
            
            saveBtn.addEventListener('click', function() {
                formInputs.forEach(input => input.disabled = true);
                saveBtn.style.display = 'none';
                cancelBtn.style.display = 'none';
                editBtn.style.display = 'inline-block';
                
                saveOriginalValues();
                
                formInputs.forEach(input => {
                    input.style.borderColor = '';
                    input.style.background = '';
                });
                
                showAddressMessage('✅ ADDRESS UPDATED SUCCESSFULLY!', 'success');
            });
            
            cancelBtn.addEventListener('click', function() {
                formInputs.forEach((input, index) => {
                    input.value = originalValues[index];
                    input.disabled = true;
                });
                
                saveBtn.style.display = 'none';
                cancelBtn.style.display = 'none';
                editBtn.style.display = 'inline-block';
                
                formInputs.forEach(input => {
                    input.style.borderColor = '';
                    input.style.background = '';
                });
                
                showAddressMessage('ℹ️ CHANGES CANCELLED', 'info');
            });
        }

        function isValidEmail(email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(email);
        }

        function isValidPhone(phone) {
            const digitsOnly = phone.replace(/\D/g, '');
            return digitsOnly.length >= 10;
        }

        function isValidPinCode(pin) {
            const digitsOnly = pin.replace(/\D/g, '');
            return digitsOnly.length === 6;
        }

        function calculateTotals() {
            let subtotal = 0;
            orderItems.forEach(item => subtotal += item.price * item.originalQuantity);
            const shipping = 0;
            let discount = 0;
            if (appliedCoupon === 'DIWALI') discount = subtotal * 0.5;
            const taxableAmount = subtotal - discount;
            const tax = Math.round(taxableAmount * GST_RATE);
            const total = subtotal - discount + tax + shipping;
            return {subtotal, shipping, discount, tax, total};
        }

        function updateOrderSummary() {
            const totals = calculateTotals();
            const orderItemsContainer = document.querySelector('.order-summary');
            let itemsHTML = '<h2 class="summary-title">Order Summary</h2>';
            
            orderItems.forEach(item => {
                itemsHTML += `<div class="order-item"><div class="item-image" style="background-image: url('${item.image}');"></div><div class="item-details"><div class="item-name">${item.name}</div><div class="item-quantity">Quantity: ${item.quantity}${item.quantity > item.originalQuantity ? ' (Buy 1 Get 1 Free! 🎁)' : ''}</div><div class="item-price">₹${item.price.toLocaleString('en-IN')}</div></div></div>`;
            });
            
            itemsHTML += '<div class="summary-divider"></div>';
            itemsHTML += `<div class="promo-code"><input type="text" class="promo-input" placeholder="Enter promo code" ${appliedCoupon ? 'disabled' : ''} ${appliedCoupon ? `value="${appliedCoupon}"` : ''}><button class="apply-btn" ${appliedCoupon ? 'style="background: #4CAF50; border-color: #4CAF50; color: #fff;"' : ''}>${appliedCoupon ? 'Applied ✓' : 'Apply'}</button></div>`;
            itemsHTML += `<div class="summary-row"><span>Subtotal</span><span>₹${totals.subtotal.toLocaleString('en-IN')}</span></div><div class="summary-row"><span>Shipping</span><span style="color: #4CAF50;">FREE</span></div>`;
            
            if (totals.discount > 0) {
                itemsHTML += `<div class="summary-row"><span>Discount (DIWALI Buy 1 Get 1)</span><span style="color: #4CAF50;">-₹${totals.discount.toLocaleString('en-IN')}</span></div>`;
            }
            
            itemsHTML += `<div class="summary-row"><span>Tax (GST 3%)</span><span>₹${totals.tax.toLocaleString('en-IN')}</span></div><div class="summary-row total"><span>Total</span><span>₹${totals.total.toLocaleString('en-IN')}</span></div><button class="place-order-btn">Place Order</button><div class="secure-badge"><span>🔒</span><span>Secure Checkout - Your data is protected</span></div>`;
            
            orderItemsContainer.innerHTML = itemsHTML;
            initializePromoCode();
            initializeFormValidation();
        }

        function initializeFormValidation() {
            const placeOrderBtn = document.querySelector('.place-order-btn');
            
            placeOrderBtn.addEventListener('click', function(e) {
                e.preventDefault();
                
                if (validateForm()) {
                    showConfirmationModal();
                }
            });
        }

        function showConfirmationModal() {
            const confirmModal = document.getElementById('confirmationModal');
            confirmModal.classList.add('active');
            
            const confirmYes = document.querySelector('.confirm-yes');
            const confirmNo = document.querySelector('.confirm-no');
            
            confirmYes.onclick = function() {
                confirmModal.classList.remove('active');
                placeOrder();
            };
            
            confirmNo.onclick = function() {
                confirmModal.classList.remove('active');
            };
        }

        function placeOrder() {
            const orderData = {
                items: orderItems,
                totals: calculateTotals(),
                coupon: appliedCoupon,
                customerInfo: getCustomerInfo(),
                paymentMethod: getSelectedPaymentMethod()
            };
            
            sessionStorage.setItem('orderData', JSON.stringify(orderData));
            showOrderSuccessModal(orderData);
        }

        function showOrderSuccessModal(orderData) {
            const orderNumber = 'AUR-' + new Date().getFullYear() + '-' + Math.floor(Math.random() * 100000);
            
            document.getElementById('orderNumber').textContent = orderNumber;
            
            const today = new Date();
            const deliveryStart = new Date(today);
            deliveryStart.setDate(today.getDate() + 3);
            const deliveryEnd = new Date(today);
            deliveryEnd.setDate(today.getDate() + 6);
            
            function formatDate(date) {
                return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
            }
            
            const deliveryDateElement = document.querySelector('.modal-delivery-date');
            if (deliveryDateElement) {
                deliveryDateElement.innerHTML = `
                    Your order will be delivered between<br>
                    <strong>${formatDate(deliveryStart)} - ${formatDate(deliveryEnd)}</strong>
                `;
            }
            
            let itemsHTML = '';
            orderData.items.forEach(item => {
                itemsHTML += `
                    <div class="modal-order-item">
                        <div class="modal-item-image" style="background-image: url('${item.image}');"></div>
                        <div class="modal-item-info">
                            <div class="modal-item-name">${item.name}</div>
                            <div class="modal-item-quantity">Quantity: ${item.quantity}</div>
                            <div class="modal-item-price">₹${(item.price * item.originalQuantity).toLocaleString('en-IN')}</div>
                        </div>
                    </div>
                `;
            });
            document.getElementById('modalOrderItems').innerHTML = itemsHTML;
            
            const totals = orderData.totals;
            let totalsHTML = `
                <div class="modal-total-row">
                    <span>Subtotal</span>
                    <span>₹${totals.subtotal.toLocaleString('en-IN')}</span>
                </div>
                <div class="modal-total-row">
                    <span>Shipping</span>
                    <span style="color: #4CAF50;">FREE</span>
                </div>
            `;
            
            if (totals.discount > 0) {
                totalsHTML += `
                    <div class="modal-total-row">
                        <span>Discount</span>
                        <span style="color: #4CAF50;">-₹${totals.discount.toLocaleString('en-IN')}</span>
                    </div>
                `;
            }
            
            totalsHTML += `
                <div class="modal-total-row">
                    <span>Tax (GST 3%)</span>
                    <span>₹${totals.tax.toLocaleString('en-IN')}</span>
                </div>
                <div class="modal-total-row final">
                    <span>Total</span>
                    <span>₹${totals.total.toLocaleString('en-IN')}</span>
                </div>
            `;
            document.getElementById('modalTotals').innerHTML = totalsHTML;
            
            const customerInfo = orderData.customerInfo;
            document.getElementById('shippingDetails').innerHTML = `
                ${customerInfo.firstName} ${customerInfo.lastName}<br>
                ${customerInfo.address}<br>
                ${customerInfo.city}, ${customerInfo.state} ${customerInfo.pincode}<br>
                ${customerInfo.country}<br>
                Phone: ${customerInfo.phone}<br>
                Email: ${customerInfo.email}
            `;
            
            const successModal = document.getElementById('successModal');
            successModal.classList.add('active');
            
            document.querySelector('.modal-close').onclick = function() {
                successModal.classList.remove('active');
            };
        }

        function showValidationError(message, isPaymentError = false) {
            if (isPaymentError) {
                showPaymentMessage(message, 'error');
            } else {
                showAddressMessage(message, 'error');
            }
        }

        function validateForm() {
            // First, enable all fields temporarily for validation
            const allInputs = document.querySelectorAll('#shippingForm input, #shippingForm select');
            const disabledStates = [];
            allInputs.forEach((input, index) => {
                disabledStates[index] = input.disabled;
                input.disabled = false;
            });

            // Validate shipping information
            const firstName = document.getElementById('firstName').value.trim();
            const lastName = document.getElementById('lastName').value.trim();
            const email = document.getElementById('email').value.trim();
            const phone = document.getElementById('phone').value.trim();
            const address = document.getElementById('address').value.trim();
            const city = document.getElementById('city').value.trim();
            const state = document.getElementById('state').value;
            const pincode = document.getElementById('pincode').value.trim();
            const country = document.getElementById('country').value;

            // Restore disabled states
            allInputs.forEach((input, index) => {
                input.disabled = disabledStates[index];
            });

            if (!firstName) {
                showValidationError('⚠️ Please enter your First Name');
                document.getElementById('firstName').focus();
                return false;
            }

            if (!lastName) {
                showValidationError('⚠️ Please enter your Last Name');
                document.getElementById('lastName').focus();
                return false;
            }

            if (!email) {
                showValidationError('⚠️ Please enter your Email Address');
                document.getElementById('email').focus();
                return false;
            }

            if (!isValidEmail(email)) {
                showValidationError('⚠️ Please enter a valid email address');
                document.getElementById('email').focus();
                return false;
            }

            if (!phone) {
                showValidationError('⚠️ Please enter your Phone Number');
                document.getElementById('phone').focus();
                return false;
            }

            if (!isValidPhone(phone)) {
                showValidationError('⚠️ Please enter a valid phone number with at least 10 digits');
                document.getElementById('phone').focus();
                return false;
            }

            if (!address) {
                showValidationError('⚠️ Please enter your Street Address');
                document.getElementById('address').focus();
                return false;
            }

            if (!city) {
                showValidationError('⚠️ Please enter your City');
                document.getElementById('city').focus();
                return false;
            }

            if (!state) {
                showValidationError('⚠️ Please select your State');
                document.getElementById('state').focus();
                return false;
            }

            if (!pincode) {
                showValidationError('⚠️ Please enter your PIN Code');
                document.getElementById('pincode').focus();
                return false;
            }

            if (!isValidPinCode(pincode)) {
                showValidationError('⚠️ Please enter a valid 6-digit PIN Code');
                document.getElementById('pincode').focus();
                return false;
            }

            if (!country) {
                showValidationError('⚠️ Please select your Country');
                document.getElementById('country').focus();
                return false;
            }

            // Validate payment method
            const selectedPayment = document.querySelector('input[name="payment"]:checked');
            if (!selectedPayment) {
                showValidationError('⚠️ Please select a Payment Method', true);
                return false;
            }

            const paymentType = selectedPayment.value;

            // Validate UPI fields if UPI is selected
            if (paymentType === 'upi') {
                const upiId = document.getElementById('upiId').value.trim();
                if (!upiId) {
                    showValidationError('⚠️ Please enter your UPI ID', true);
                    document.getElementById('upiId').focus();
                    return false;
                }
                if (!upiId.includes('@')) {
                    showValidationError('⚠️ Please enter a valid UPI ID with @ symbol', true);
                    document.getElementById('upiId').focus();
                    return false;
                }
            }

            // Validate Card fields if Card is selected
            if (paymentType === 'card') {
                const cardNumber = document.getElementById('cardNumber').value.trim();
                const cardName = document.getElementById('cardName').value.trim();
                const cardExpiry = document.getElementById('cardExpiry').value.trim();
                const cardCVV = document.getElementById('cardCVV').value.trim();

                if (!cardNumber) {
                    showValidationError('⚠️ Please enter your Card Number', true);
                    document.getElementById('cardNumber').focus();
                    return false;
                }

                const cardDigits = cardNumber.replace(/\s/g, '');
                if (cardDigits.length < 16) {
                    showValidationError('⚠️ Please enter a valid 16-digit Card Number', true);
                    document.getElementById('cardNumber').focus();
                    return false;
                }

                if (!cardName) {
                    showValidationError('⚠️ Please enter the Cardholder Name', true);
                    document.getElementById('cardName').focus();
                    return false;
                }

                if (!cardExpiry) {
                    showValidationError('⚠️ Please enter the Card Expiry Date', true);
                    document.getElementById('cardExpiry').focus();
                    return false;
                }

                if (!cardExpiry.includes('/') || cardExpiry.replace(/\D/g, '').length < 4) {
                    showValidationError('⚠️ Please enter a valid Expiry Date in MM/YY format', true);
                    document.getElementById('cardExpiry').focus();
                    return false;
                }

                if (!cardCVV) {
                    showValidationError('⚠️ Please enter the CVV', true);
                    document.getElementById('cardCVV').focus();
                    return false;
                }

                if (cardCVV.length < 3) {
                    showValidationError('⚠️ Please enter a valid 3-digit CVV', true);
                    document.getElementById('cardCVV').focus();
                    return false;
                }
            }

            return true;
        }

        function getCustomerInfo() {
            return {
                firstName: document.getElementById('firstName').value,
                lastName: document.getElementById('lastName').value,
                email: document.getElementById('email').value,
                phone: document.getElementById('phone').value,
                address: document.getElementById('address').value,
                city: document.getElementById('city').value,
                state: document.getElementById('state').value,
                pincode: document.getElementById('pincode').value,
                country: document.getElementById('country').value
            };
        }

        function getSelectedPaymentMethod() {
            const selectedPayment = document.querySelector('input[name="payment"]:checked');
            if (selectedPayment) {
                const paymentOption = selectedPayment.closest('.payment-option');
                return paymentOption.querySelector('.payment-header span:last-child').textContent;
            }
            return null;
        }

        function initializeCardFormatting() {
            const cardNumberInput = document.getElementById('cardNumber');
            if (cardNumberInput) {
                cardNumberInput.addEventListener('input', function(e) {
                    let value = e.target.value.replace(/\s/g, '');
                    let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
                    e.target.value = formattedValue;
                });
            }
            
            const expiryInput = document.getElementById('cardExpiry');
            if (expiryInput) {
                expiryInput.addEventListener('input', function(e) {
                    let value = e.target.value.replace(/\D/g, '');
                    if (value.length >= 2) {
                        value = value.slice(0, 2) + '/' + value.slice(2, 4);
                    }
                    e.target.value = value;
                });
            }

            const cvvInput = document.getElementById('cardCVV');
            if (cvvInput) {
                cvvInput.addEventListener('input', function(e) {
                    e.target.value = e.target.value.replace(/\D/g, '');
                });
            }
        }

        function initializePromoCode() {
            const applyBtn = document.querySelector('.apply-btn');
            const promoInput = document.querySelector('.promo-input');
            
            if (!applyBtn || !promoInput) return;
            
            // Remove old event listener by cloning
            const newApplyBtn = applyBtn.cloneNode(true);
            applyBtn.parentNode.replaceChild(newApplyBtn, applyBtn);
            
            newApplyBtn.addEventListener('click', function() {
                const code = promoInput.value.trim().toUpperCase();
                
                if (!code) {
                    showAddressMessage('⚠️ Please enter a promo code', 'error');
                    return;
                }
                
                if (code === 'DIWALI') {
                    appliedCoupon = code;
                    applyDiwaliCoupon();
                    updateOrderSummary();
                    showAddressMessage('🎉 DIWALI Coupon Applied! Buy 1 Get 1 Free!', 'success');
                } else {
                    showAddressMessage('⚠️ Invalid promo code. Please try again.', 'error');
                }
            });
        }

        document.addEventListener('DOMContentLoaded', async function() {
            await loadCartItems();
            initializeAddressEditing();
            initializeCardFormatting();
            updateOrderSummary();
        });