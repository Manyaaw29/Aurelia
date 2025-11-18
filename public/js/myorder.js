// ========================================
        // ENHANCED ORDER MANAGEMENT SYSTEM
        // ========================================

        document.addEventListener("DOMContentLoaded", () => {
            initializeOrderActions();
            initializeFilters();
            // Reorder buttons
            document.querySelectorAll(".reorder-btn").forEach(btn => {
                btn.addEventListener("click", (e) => {
                    e.preventDefault();
                    handleReorder();
                });
            });
        });

        // Initialize all order action buttons
        function initializeOrderActions() {
            // View Details buttons
            document.querySelectorAll(".view-details-btn").forEach(btn => {
                btn.addEventListener("click", (e) => {
                    e.preventDefault();
                    const card = e.target.closest(".order-card");
                    showOrderDetails(card);
                });
            });

            // Track Order buttons
            document.querySelectorAll(".track-order-btn").forEach(btn => {
                btn.addEventListener("click", (e) => {
                    e.preventDefault();
                    const card = e.target.closest(".order-card");
                    trackOrder(card);
                });
            });

            // Cancel Order buttons
            document.querySelectorAll(".cancel-order-btn").forEach(btn => {
                btn.addEventListener("click", (e) => {
                    e.preventDefault();
                    const card = e.target.closest(".order-card");
                    showCancelOptions(card);
                });
            });

            // Reorder buttons
            document.querySelectorAll(".reorder-btn").forEach(btn => {
                btn.addEventListener("click", (e) => {
                    e.preventDefault();
                    handleReorder();
                });
            });
        }

        // ========================================
        // FILTER AND SORT FUNCTIONALITY
        // ========================================
        function initializeFilters() {
            const statusFilter = document.getElementById('statusFilter');
            const sortOrder = document.getElementById('sortOrder');

            statusFilter?.addEventListener('change', filterOrders);
            sortOrder?.addEventListener('change', sortOrders);
        }

        function filterOrders() {
            const filterValue = document.getElementById('statusFilter').value;
            const orderCards = document.querySelectorAll('.order-card');

            orderCards.forEach(card => {
                const status = card.dataset.status;
                if (filterValue === 'all' || status === filterValue) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        }

        function sortOrders() {
            const sortValue = document.getElementById('sortOrder').value;
            const container = document.querySelector('.order-history-list');
            const orderCards = Array.from(document.querySelectorAll('.order-card'));

            orderCards.sort((a, b) => {
                switch(sortValue) {
                    case 'newest':
                        return new Date(b.dataset.date) - new Date(a.dataset.date);
                    case 'oldest':
                        return new Date(a.dataset.date) - new Date(b.dataset.date);
                    case 'price-high':
                        return parseInt(b.dataset.price) - parseInt(a.dataset.price);
                    case 'price-low':
                        return parseInt(a.dataset.price) - parseInt(b.dataset.price);
                    default:
                        return 0;
                }
            });

            orderCards.forEach(card => container.appendChild(card));
        }

        // ========================================
        // VIEW ORDER DETAILS MODAL (WITH RETURN/REFUND OPTION)
        // ========================================
        function showOrderDetails(card) {
            const orderId = card.querySelector(".order-id").textContent;
            const productName = card.querySelector(".item-names")?.textContent.trim() || "Unknown item";
            const total = card.querySelector(".order-total-price")?.textContent || "₹—";
            const status = card.querySelector(".order-status")?.textContent || "Unknown";
            const orderDate = card.querySelector(".order-date")?.textContent || "Unknown date";

            const html = `
        <div class="modal-overlay">
            <div class="modal-box">
                <button class="close-btn">&times;</button>
                <h2>📦 ${orderId}</h2>
                <div class="order-summary">
                    <p><strong>🛍️ Product:</strong> <span>${productName}</span></p>
                    <p><strong>📅 Order Date:</strong> <span>${orderDate.split(': ')[1] || orderDate}</span></p>
                    <p><strong>📊 Status:</strong> <span style="color: var(--color-gold-light);">${status}</span></p>
                    <p><strong>💳 Payment Method:</strong> <span>UPI (Paid)</span></p>
                    <p><strong>📍 Delivery Address:</strong> <span>Mehak Kumar<br>B-45 Rosewood Apartments<br>Gurugram, Haryana - 122018</span></p>
                    <p><strong>💰 Total Amount:</strong> <span style="color: var(--color-gold-light); font-size: 1.2rem;">${total}</span></p>
                </div>
                <div style="margin-top: 25px; padding-top: 20px; border-top: 1px solid rgba(255,255,255,0.1);">
                    <h3 style="color: var(--color-gold); margin-bottom: 15px;">📋 Order Timeline</h3>
                    <div class="progress-list">
                        <li class="done">✅ Order Placed - Sep 28, 2025</li>
                        <li class="done">📦 Processing & Packed - Sep 29, 2025</li>
                        <li class="done">🚚 Shipped - Sep 30, 2025</li>
                        <li class="done">🛵 Out for Delivery - Oct 1, 2025</li>
                        <li class="done">🏠 Delivered - Oct 2, 2025</li>
                    </div>
                </div>
                <div style="margin-top: 20px; padding: 15px; background: rgba(112, 224, 135, 0.1); border-radius: 10px; border-left: 4px solid var(--color-status-success);">
                    <p style="font-size: 0.9rem; color: var(--color-text-grey); margin: 0;">
                        <strong>✓ Delivered Successfully:</strong> Your order was delivered on Oct 2, 2025. Hope you love your purchase!
                    </p>
                </div>
                <div class="modal-buttons">
                    <button class="btn-primary" onclick="window.print()">🖨️ Print Invoice</button>
                    <button class="btn-primary return-refund-btn">🔄 Return / Refund</button>
                    <button class="btn-secondary close-modal-btn">Close</button>
                </div>
            </div>
        </div>`;

            openModal(html);

            // Add event listener for return/refund button
            document.querySelector('.return-refund-btn').onclick = () => {
                closeModal();
                showReturnRefundOptions(card);
            };
        }

        // ========================================
        // RETURN/REFUND MODAL
        // ========================================
        function showReturnRefundOptions(card) {
            const orderId = card.querySelector(".order-id").textContent;
            const productName = card.querySelector(".item-names")?.textContent.trim() || "Unknown item";
            const total = card.querySelector(".order-total-price")?.textContent || "₹—";

            const html = `
        <div class="modal-overlay">
            <div class="modal-box">
                <button class="close-btn">&times;</button>
                <h2>🔄 Return/Refund Request</h2>
                <div class="order-summary">
                    <p><strong>Order ID:</strong> <span>${orderId}</span></p>
                    <p><strong>Product:</strong> <span>${productName}</span></p>
                    <p><strong>Amount:</strong> <span style="color: var(--color-gold-light);">${total}</span></p>
                </div>
                <form id="returnForm" style="margin-top: 20px;">
                    <div class="form-section">
                        <h4 style="color: var(--color-gold); margin-bottom: 15px;">Select Return Reason:</h4>
                        <label><input type="radio" name="returnReason" value="Defective product" required> Defective or damaged product</label>
                        <label><input type="radio" name="returnReason" value="Wrong item received"> Wrong item received</label>
                        <label><input type="radio" name="returnReason" value="Not as described"> Product not as described</label>
                        <label><input type="radio" name="returnReason" value="Size/fit issue"> Size or fit issue</label>
                        <label><input type="radio" name="returnReason" value="Quality concerns"> Quality not satisfactory</label>
                        <label><input type="radio" name="returnReason" value="Changed mind"> Changed my mind</label>
                    </div>
                    <div class="form-section" style="margin-top: 20px;">
                        <h4 style="color: var(--color-gold); margin-bottom: 10px;">Preferred Resolution:</h4>
                        <label><input type="radio" name="resolution" value="refund" checked> Full Refund to original payment method</label>
                        <label><input type="radio" name="resolution" value="exchange"> Exchange for same product</label>
                        <label><input type="radio" name="resolution" value="credit"> Store credit for future purchase</label>
                    </div>
                    <div class="form-section" style="margin-top: 20px;">
                        <label for="returnComments" style="display: block; margin-bottom: 10px; color: var(--color-gold);">Additional Comments (Optional):</label>
                        <textarea id="returnComments" rows="4" placeholder="Please describe the issue in detail..." style="width: 100%; padding: 12px; border-radius: 8px; background: rgba(255,255,255,0.08); color: #fff; border: 1px solid rgba(212,175,55,0.3);"></textarea>
                    </div>
                </form>
                <div style="background: rgba(244, 208, 63, 0.1); padding: 15px; border-radius: 10px; margin-top: 20px; border-left: 4px solid var(--color-gold);">
                    <p style="font-size: 0.9rem; color: var(--color-text-grey); margin: 0;">
                        <strong>ℹ️ Return Policy:</strong> Items must be returned within 7 days of delivery in original condition with tags attached. Refunds will be processed within 5-7 business days after inspection.
                    </p>
                </div>
                <div class="modal-buttons">
                    <button class="btn-secondary close-modal-btn">Cancel</button>
                    <button class="btn-primary confirm-return-btn">Submit Return Request</button>
                </div>
            </div>
        </div>`;

            openModal(html);

            document.querySelector('.confirm-return-btn').onclick = () => {
                const selectedReason = document.querySelector('input[name="returnReason"]:checked');
                const selectedResolution = document.querySelector('input[name="resolution"]:checked');
                
                if (!selectedReason) {
                    showToast("⚠️ Please select a return reason", "warning");
                    return;
                }
                
                closeModal();
                handleReturnConfirm(card, orderId, selectedReason.value, selectedResolution.value);
            };
        }

        function handleReturnConfirm(card, orderId, reason, resolution) {
            showToast(`✅ Return request submitted! Resolution: ${resolution}. Reason: ${reason}`);
            
            const statusEl = card.querySelector(".order-status");
            statusEl.textContent = "Return Requested";
            statusEl.className = "order-status status-pending";

            const actionBtn = card.querySelector(".order-actions a");
            actionBtn.textContent = "View Return Status";
            actionBtn.className = "view-return-btn";
            actionBtn.onclick = (e) => {
                e.preventDefault();
                showReturnStatus(card, resolution);
            };
        }

        // ========================================
        // TRACK ORDER MODAL (WITH CANCEL OPTION)
        // ========================================
        function trackOrder(card) {
            const orderId = card.querySelector(".order-id").textContent;

            const html = `
        <div class="modal-overlay">
            <div class="modal-box track-box">
                <button class="close-btn">&times;</button>
                <h2>🚚 ${orderId} - Tracking</h2>
                <div class="shipment-info">
                    <p><strong>From:</strong> <span>Mumbai, Maharashtra</span></p>
                    <p><strong>To:</strong> <span>Gurugram, Haryana</span></p>
                    <p><strong>Current Status:</strong> <span style="color: var(--color-gold-light);">Out for Delivery 🛵</span></p>
                    <p><strong>Estimated Delivery:</strong> <span style="color: var(--color-status-success);">October 6, 2025</span></p>
                    <p><strong>Tracking ID:</strong> <span style="font-family: monospace; color: var(--color-gold);">TRK-AUR-2025-451</span></p>
                    <p><strong>Carrier:</strong> <span>BlueDart Express</span></p>
                </div>
                <div class="timeline">
                    <div class="step done">
                        <i>🧾</i>
                        <p>Order Placed</p>
                        <span>Sep 29</span>
                    </div>
                    <div class="step done">
                        <i>📦</i>
                        <p>Packed</p>
                        <span>Sep 30</span>
                    </div>
                    <div class="step done">
                        <i>🚚</i>
                        <p>Shipped</p>
                        <span>Oct 1</span>
                    </div>
                    <div class="step current">
                        <i>🛵</i>
                        <p>Out for Delivery</p>
                        <span>Oct 5</span>
                    </div>
                    <div class="step">
                        <i>🏠</i>
                        <p>Delivered</p>
                        <span>Pending</span>
                    </div>
                </div>
                <div style="background: rgba(244, 208, 63, 0.1); padding: 15px; border-radius: 10px; margin-top: 20px; border-left: 4px solid var(--color-gold);">
                    <p style="font-size: 0.9rem; color: var(--color-text-grey); margin: 0;">
                        <strong>📍 Live Update:</strong> Your package is currently with the delivery agent and will arrive today between 2 PM - 6 PM.
                    </p>
                </div>
                <div class="modal-buttons">
                    <button class="btn-primary" onclick="showToast('📲 SMS notification sent!')">Get SMS Updates</button>
                    <button class="btn-warning cancel-from-track-btn">❌ Cancel Order</button>
                    <button class="btn-secondary close-modal-btn">Close</button>
                </div>
            </div>
        </div>`;

            openModal(html);

            // Add cancel order functionality from tracking modal
            document.querySelector('.cancel-from-track-btn').onclick = () => {
                closeModal();
                showCancelOptions(card);
            };
        }

        // ========================================
        // CANCEL ORDER MODAL
        // ========================================
        function showCancelOptions(card) {
            const orderId = card.querySelector(".order-id").textContent;

            const html = `
        <div class="modal-overlay">
            <div class="modal-box">
                <button class="close-btn">&times;</button>
                <h2>❌ Cancel ${orderId}</h2>
                <p style="margin: 15px 0; color: var(--color-text-grey);">
                    <strong>Why do you want to cancel this order?</strong>
                </p>
                <form id="cancelForm">
                    <label><input type="radio" name="reason" value="Ordered by mistake"> Ordered by mistake</label>
                    <label><input type="radio" name="reason" value="Found a better price elsewhere"> Found a better price elsewhere</label>
                    <label><input type="radio" name="reason" value="Delivery taking too long"> Delivery taking too long</label>
                    <label><input type="radio" name="reason" value="Change in mind"> Change in mind</label>
                    <label><input type="radio" name="reason" value="Other reason"> Other reason</label>
                </form>
                <div style="background: rgba(255, 120, 120, 0.1); padding: 15px; border-radius: 10px; margin-top: 20px; border-left: 4px solid #ff6b6b;">
                    <p style="font-size: 0.9rem; color: var(--color-text-grey); margin: 0;">
                        <strong>⚠️ Note:</strong> Cancellation will initiate a refund process. Amount will be credited within 5-7 business days.
                    </p>
                </div>
                <div class="modal-buttons">
                    <button class="btn-secondary close-modal-btn">Keep Order</button>
                    <button class="btn-primary confirm-cancel-btn">Confirm Cancellation</button>
                </div>
            </div>
        </div>`;

            openModal(html);

            document.querySelector(".confirm-cancel-btn").onclick = () => {
                const selected = document.querySelector("input[name='reason']:checked");
                if (!selected) {
                    showToast("⚠️ Please select a reason before cancelling", "warning");
                    return;
                }
                closeModal();
                handleCancelConfirm(card, orderId, selected.value);
            };
        }

        // ========================================
        // HANDLE CANCEL CONFIRMATION
        // ========================================
        function handleCancelConfirm(card, orderId, reason) {
            showToast(`✅ Cancellation request submitted! Reason: ${reason}`);

            const statusEl = card.querySelector(".order-status");
            statusEl.textContent = "Cancellation Requested";
            statusEl.className = "order-status status-pending";

            const actionBtn = card.querySelector(".order-actions a");
            actionBtn.textContent = "View Return Status";
            actionBtn.className = "view-return-btn";
            actionBtn.onclick = (e) => {
                e.preventDefault();
                showReturnStatus(card, 'refund');
            };
        }

        // ========================================
        // VIEW RETURN STATUS MODAL
        // ========================================
        function showReturnStatus(card, resolution = 'refund') {
            const orderId = card.querySelector(".order-id").textContent;
            const resolutionText = resolution === 'refund' ? 'Refund' : resolution === 'exchange' ? 'Exchange' : 'Store Credit';

            const html = `
        <div class="modal-overlay">
            <div class="modal-box">
                <button class="close-btn">&times;</button>
                <h2>🔄 ${orderId} - Return Status</h2>
                <div style="margin: 20px 0;">
                    <p style="color: var(--color-text-grey); margin-bottom: 20px;">
                        Your ${resolutionText.toLowerCase()} request is being processed. Here's the current status:
                    </p>
                    <ul class="progress-list">
                        <li class="done">Return Requested - Oct 2, 2025</li>
                        <li class="done">Request Approved - Oct 2, 2025</li>
                        <li class="done">Pickup Scheduled - Oct 3, 2025</li>
                        <li>Item Collected - Pending</li>
                        <li>${resolutionText} Initiated - Pending</li>
                        <li>${resolutionText} Completed - Pending</li>
                    </ul>
                </div>
                <div style="background: rgba(112, 224, 135, 0.1); padding: 15px; border-radius: 10px; border-left: 4px solid var(--color-status-success);">
                    <p style="font-size: 0.9rem; color: var(--color-text-grey); margin: 0;">
                        <strong>✓ Next Step:</strong> Our delivery partner will collect the item from your address on Oct 3, 2025. Please keep the package ready with all original tags and packaging.
                    </p>
                </div>
                <div class="modal-buttons">
                    <button class="btn-primary" onclick="showToast('📧 Return details emailed!')">Email Details</button>
                    <button class="btn-secondary close-modal-btn">Close</button>
                </div>
            </div>
        </div>`;

            openModal(html);
        }

        // ========================================
        // QUICK ACTIONS
        // ========================================
        function downloadAllInvoices() {
            showToast('📥 Downloading all invoices... Please wait.');
            setTimeout(() => {
                showToast('✅ All invoices downloaded successfully!');
            }, 2000);
        }

        function showHelpCenter() {
            const html = `
        <div class="modal-overlay">
            <div class="modal-box">
                <button class="close-btn">&times;</button>
                <h2>💬 Help Center</h2>
                <div style="margin: 20px 0;">
                    <div class="help-option">
                        <h4 style="color: var(--color-gold); margin-bottom: 10px;">📞 Call Us</h4>
                        <p style="color: var(--color-text-grey);">Customer Support: <strong style="color: #fff;">1800-123-4567</strong></p>
                        <p style="color: var(--color-text-grey); font-size: 0.85rem;">Available 24/7</p>
                    </div>
                    <div class="help-option" style="margin-top: 20px;">
                        <h4 style="color: var(--color-gold); margin-bottom: 10px;">💬 Live Chat</h4>
                        <p style="color: var(--color-text-grey);">Chat with our support team in real-time</p>
                        <button class="btn-primary" style="margin-top: 10px;" onclick="showToast('💬 Opening chat window...')">Start Chat</button>
                    </div>
                    <div class="help-option" style="margin-top: 20px;">
                        <h4 style="color: var(--color-gold); margin-bottom: 10px;">📧 Email Support</h4>
                        <p style="color: var(--color-text-grey);">support@aurelia.com</p>
                        <p style="color: var(--color-text-grey); font-size: 0.85rem;">Response within 24 hours</p>
                    </div>
                    <div class="help-option" style="margin-top: 20px;">
                        <h4 style="color: var(--color-gold); margin-bottom: 10px;">❓ FAQs</h4>
                        <ul style="list-style: none; padding: 0;">
                            <li style="padding: 8px 0; border-bottom: 1px dashed rgba(255,255,255,0.1);">
                                <a href="#" style="color: var(--color-text-grey); text-decoration: none;" onmouseover="this.style.color='var(--color-gold)'" onmouseout="this.style.color='var(--color-text-grey)'">How do I track my order?</a>
                            </li>
                            <li style="padding: 8px 0; border-bottom: 1px dashed rgba(255,255,255,0.1);">
                                <a href="#" style="color: var(--color-text-grey); text-decoration: none;" onmouseover="this.style.color='var(--color-gold)'" onmouseout="this.style.color='var(--color-text-grey)'">What is your return policy?</a>
                            </li>
                            <li style="padding: 8px 0; border-bottom: 1px dashed rgba(255,255,255,0.1);">
                                <a href="#" style="color: var(--color-text-grey); text-decoration: none;" onmouseover="this.style.color='var(--color-gold)'" onmouseout="this.style.color='var(--color-text-grey)'">How long does shipping take?</a>
                            </li>
                            <li style="padding: 8px 0;">
                                <a href="#" style="color: var(--color-text-grey); text-decoration: none;" onmouseover="this.style.color='var(--color-gold)'" onmouseout="this.style.color='var(--color-text-grey)'">How do I cancel an order?</a>
                            </li>
                        </ul>
                    </div>
                </div>
                <div class="modal-buttons">
                    <button class="btn-secondary close-modal-btn">Close</button>
                </div>
            </div>
        </div>`;

            openModal(html);
        }

        // ========================================
        // MODAL UTILITIES
        // ========================================
        function openModal(html) {
            document.body.insertAdjacentHTML("beforeend", html);

            // Close button handlers
            document.querySelectorAll(".close-btn, .close-modal-btn").forEach(btn => {
                btn.onclick = closeModal;
            });

            // Click outside to close
            document.querySelector(".modal-overlay").onclick = (e) => {
                if (e.target.classList.contains("modal-overlay")) {
                    closeModal();
                }
            };

            // ESC key to close
            document.addEventListener("keydown", handleEscKey);
        }

        function closeModal() {
            const modal = document.querySelector(".modal-overlay");
            if (modal) {
                modal.style.animation = "fadeOut 0.3s ease";
                setTimeout(() => modal.remove(), 300);
            }
            document.removeEventListener("keydown", handleEscKey);
        }

        function handleEscKey(e) {
            if (e.key === "Escape") {
                closeModal();
            }
        }

        // ========================================
        // TOAST NOTIFICATION
        // ========================================
        function showToast(message, type = "success") {
            const existingToast = document.querySelector(".toast-message");
            if (existingToast) existingToast.remove();

            const toast = document.createElement("div");
            toast.className = "toast-message";
            toast.textContent = message;
            document.body.appendChild(toast);

            setTimeout(() => {
                toast.style.animation = "slideOut 0.5s ease";
                setTimeout(() => toast.remove(), 500);
            }, 4000);
        }

        // ========================================
        // NEWSLETTER FORM
        // ========================================
        document.querySelector('.newsletter-form')?.addEventListener('submit', function (e) {
            e.preventDefault();
            const input = this.querySelector('.newsletter-input');
            const email = input.value.trim();

            if (!email || !email.includes('@') || !email.includes('.')) {
                showToast('⚠️ Please enter a valid email address', 'warning');
                return;
            }

            showToast('🎉 Thank you for subscribing to Aurelia!');
            input.value = '';
        });

        // ========================================
        // ADD FADE OUT ANIMATION
        // ========================================
        const style = document.createElement('style');
        style.textContent = `
    @keyframes fadeOut {
        from { opacity: 1; }
        to { opacity: 0; }
    }
    @keyframes slideOut {
        from { opacity: 1; transform: translateX(0); }
        to { opacity: 0; transform: translateX(100px); }
    }
`;
        document.head.appendChild(style);