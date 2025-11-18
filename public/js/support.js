// FAQ Accordion Functionality
        document.querySelectorAll('.faq-item').forEach(item => {
            const question = item.querySelector('.faq-question');
            question.addEventListener('click', () => {
                // Close all other items
                document.querySelectorAll('.faq-item').forEach(otherItem => {
                    if (otherItem !== item) {
                        otherItem.classList.remove('active');
                    }
                });
                // Toggle current item
                item.classList.toggle('active');
            });
        });

        // Modal Functionality
        const modals = {
            shipping: document.getElementById('shipping-modal'),
            returns: document.getElementById('returns-modal'),
            sizing: document.getElementById('sizing-modal')
        };

        // Open modals when support cards are clicked
        document.querySelectorAll('.support-card[data-modal]').forEach(card => {
            card.addEventListener('click', () => {
                const modalName = card.getAttribute('data-modal');
                if (modals[modalName]) {
                    modals[modalName].classList.add('active');
                }
            });
        });

        // Close modals
        document.querySelectorAll('.close-modal').forEach(btn => {
            btn.addEventListener('click', () => {
                btn.closest('.modal').classList.remove('active');
            });
        });

        // Close modals when clicking outside
        Object.values(modals).forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.classList.remove('active');
                }
            });
        });

        // Chat Bot Functionality
        const chatToggle = document.getElementById('chat-toggle');
        const chatModal = document.getElementById('chat-bot-modal');
        const closeChat = document.getElementById('close-chat');
        const contactCard = document.getElementById('contact-card');
        const chatInputField = document.getElementById('chat-input-field');
        const sendChatBtn = document.getElementById('send-chat');
        const chatMessages = document.getElementById('chat-messages');

        // Open chat
        chatToggle.addEventListener('click', () => {
            chatModal.classList.add('active');
        });

        contactCard.addEventListener('click', () => {
            chatModal.classList.add('active');
        });

        // Close chat
        closeChat.addEventListener('click', () => {
            chatModal.classList.remove('active');
        });

        // Enhanced Chat bot with more intelligence
        const conversationHistory = [];
        let userContext = {
            askedAbout: [],
            lastTopic: null
        };

        const botKnowledge = {
            // Greetings
            greetings: {
                patterns: ['hi', 'hello', 'hey', 'good morning', 'good afternoon', 'good evening'],
                responses: [
                    "Hello! 👋 Welcome to Aurelia. How can I assist you with your jewelry needs today?",
                    "Hi there! 🌟 I'm here to help you with any questions about our products or services.",
                    "Hey! ✨ Great to see you. What would you like to know about Aurelia?"
                ]
            },
            
            // Order tracking
            tracking: {
                patterns: ['track', 'order status', 'where is my order', 'tracking number', 'delivery status', 'shipment'],
                responses: [
                    "To track your order:\n1. Log into your Aurelia account\n2. Go to 'My Orders'\n3. Click on the order you want to track\n\nYou can also use the tracking number sent to your email. Need help finding it? 📦",
                    "I can help you track your order! Do you have your order number or tracking ID? You can find it in your confirmation email. 📧"
                ]
            },
            
            // Returns & Exchanges
            return: {
                patterns: ['return', 'refund', 'exchange', 'send back', 'money back', 'cancel order'],
                responses: [
                    "Our return policy:\n✅ 30-day hassle-free returns\n✅ Items must be unworn with original tags\n✅ Refund processed in 5-7 days\n\n⚠️ Note: Personalized items cannot be returned unless defective.\n\nWould you like to initiate a return?",
                    "You can return items within 30 days! Here's how:\n1. Go to 'My Orders'\n2. Select the item\n3. Choose 'Return'\n4. Print the prepaid label\n\nNeed help with a specific order?"
                ]
            },
            
            // Sizing
            sizing: {
                patterns: ['size', 'fit', 'measurement', 'too big', 'too small', 'ring size', 'bracelet size'],
                responses: [
                    "I can help you find the perfect fit! 📏\n\nFor rings: Measure your finger circumference\nFor bracelets: Measure wrist + add 1-2cm\nFor necklaces: Choose based on where you want it to sit\n\nWant me to open our detailed size guide? Or need help measuring?",
                    "Getting the right size is important! What type of jewelry are you looking at? Ring, bracelet, or necklace? I can provide specific sizing tips for each. 💍"
                ]
            },
            
            // Shipping
            shipping: {
                patterns: ['shipping', 'delivery', 'how long', 'when will', 'delivery time', 'express', 'international'],
                responses: [
                    "Shipping details:\n🚚 Standard (India): 5-7 business days - FREE over ₹5,000\n⚡ Express (India): 2-3 business days\n🌍 International: 10-15 business days\n\nWhere are you located? I can give you more specific information!",
                    "We offer multiple shipping options! Standard shipping is free on orders above ₹5,000. Need express delivery? We can get it to you in 2-3 days! 📦✨"
                ]
            },
            
            // Payment
            payment: {
                patterns: ['payment', 'pay', 'credit card', 'debit card', 'upi', 'cod', 'cash on delivery', 'emi'],
                responses: [
                    "We accept multiple payment methods:\n💳 Credit/Debit Cards (All major banks)\n📱 UPI\n🏦 Net Banking\n💰 Digital Wallets\n\nAll transactions are 100% secure with SSL encryption. EMI options available for orders above ₹10,000!",
                    "Payment is secure and easy! We support cards, UPI, net banking, and wallets. Looking for EMI? Available on orders ₹10,000+. Any specific payment method you'd like to know about? 💳"
                ]
            },
            
            // Product questions
            products: {
                patterns: ['product', 'jewelry', 'gold', 'diamond', 'ring', 'necklace', 'bracelet', 'earring', 'material', 'quality'],
                responses: [
                    "Our jewelry collection features:\n✨ 18K & 14K solid gold\n💎 Conflict-free diamonds\n♻️ Certified recycled gold\n🌿 Hypoallergenic & nickel-free\n\nWhat type of jewelry interests you? Rings, necklaces, bracelets, or earrings?",
                    "All Aurelia pieces are crafted with ethically sourced materials! We use certified recycled gold and conflict-free gemstones. Want to know about a specific piece or material? 💫"
                ]
            },
            
            // Pricing
            pricing: {
                patterns: ['price', 'cost', 'how much', 'expensive', 'cheap', 'discount', 'sale', 'offer'],
                responses: [
                    "🎉 Current offer: DIWALI SALE - Buy 1 Get 1 FREE! Use code: DIWALI\n\nOur collection ranges from ₹5,000 to ₹2,00,000+. Prices vary based on material, gemstones, and design complexity. Looking for something specific?",
                    "Great news! We have a DIWALI sale running - Buy 1 Get 1 FREE! 🎊 Use code 'DIWALI' at checkout. Want to know about a specific product's price?"
                ]
            },
            
            // Care & Maintenance
            care: {
                patterns: ['care', 'clean', 'maintain', 'polish', 'tarnish', 'damaged'],
                responses: [
                    "Jewelry care tips:\n✨ Clean with mild soap & warm water\n🧴 Avoid harsh chemicals\n📦 Store in a soft pouch\n💍 Remove before swimming/exercising\n\nNeed specific care instructions for gold, silver, or gemstones?",
                    "Taking care of your Aurelia pieces is easy! Regular cleaning with mild soap keeps them sparkling. Want detailed care instructions? I can send you our complete care guide! ✨"
                ]
            },
            
            // Contact
            contact: {
                patterns: ['contact', 'phone', 'email', 'talk to', 'speak to', 'human', 'representative'],
                responses: [
                    "📞 Phone: 1800-XXX-XXXX (Mon-Sat, 9 AM - 7 PM)\n📧 Email: support@aurelia.com\n💬 Live Chat: Right here!\n\nI'm here to help, but if you'd like to speak with a human representative, our team is available during business hours. What can I help you with?",
                    "You can reach us at:\n• Call: 1800-XXX-XXXX\n• Email: support@aurelia.com\n• Or chat with me right now!\n\nI'm pretty smart, but if you need human assistance, our team is ready to help! 😊"
                ]
            },
            
            // Thanks
            thanks: {
                patterns: ['thank', 'thanks', 'appreciate', 'helpful'],
                responses: [
                    "You're very welcome! 😊 Is there anything else you'd like to know about Aurelia?",
                    "Happy to help! ✨ Feel free to ask if you have more questions. Enjoy your Aurelia experience!",
                    "My pleasure! 🌟 Don't hesitate to reach out if you need anything else."
                ]
            }
        };

        // More intelligent response matching
        function findBestResponse(message) {
            const lowerMessage = message.toLowerCase();
            let bestMatch = null;
            let highestScore = 0;

            // Check each knowledge category
            for (const [category, data] of Object.entries(botKnowledge)) {
                let score = 0;
                
                // Count matching patterns
                for (const pattern of data.patterns) {
                    if (lowerMessage.includes(pattern)) {
                        score += pattern.length; // Longer matches score higher
                    }
                }

                if (score > highestScore) {
                    highestScore = score;
                    bestMatch = category;
                }
            }

            // If we found a good match, return a response
            if (bestMatch && highestScore > 0) {
                const responses = botKnowledge[bestMatch].responses;
                const response = responses[Math.floor(Math.random() * responses.length)];
                
                // Update context
                if (!userContext.askedAbout.includes(bestMatch)) {
                    userContext.askedAbout.push(bestMatch);
                }
                userContext.lastTopic = bestMatch;
                
                return response;
            }

            // Default responses with context awareness
            const defaultResponses = [
                "I'd love to help! Could you please provide more details? You can ask me about shipping, returns, sizing, payments, or our products. 🤔",
                "I'm not quite sure about that, but I can help with:\n• Order tracking\n• Returns & exchanges\n• Sizing guides\n• Shipping info\n• Product details\n\nWhat would you like to know?",
                "Hmm, I didn't quite catch that. Try asking about orders, returns, sizing, or our jewelry collection! I'm here to help. 💬"
            ];

            return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
        }

        // Show typing indicator
        function showTypingIndicator() {
            const typingDiv = document.createElement('div');
            typingDiv.className = 'chat-message bot typing-indicator';
            typingDiv.innerHTML = '<span></span><span></span><span></span>';
            typingDiv.id = 'typing-indicator';
            chatMessages.appendChild(typingDiv);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }

        function removeTypingIndicator() {
            const typing = document.getElementById('typing-indicator');
            if (typing) typing.remove();
        }

        // Send message function with enhanced intelligence
        function sendMessage() {
            const message = chatInputField.value.trim();
            if (message === '') return;

            // Add user message
            const userMsg = document.createElement('div');
            userMsg.className = 'chat-message user';
            userMsg.textContent = message;
            chatMessages.appendChild(userMsg);

            // Save to conversation history
            conversationHistory.push({ role: 'user', message: message });

            // Clear input
            chatInputField.value = '';

            // Scroll to bottom
            chatMessages.scrollTop = chatMessages.scrollHeight;

            // Show typing indicator
            showTypingIndicator();

            // Generate bot response with realistic delay
            const typingDelay = Math.min(1000 + message.length * 20, 2500);
            setTimeout(() => {
                removeTypingIndicator();

                const botMsg = document.createElement('div');
                botMsg.className = 'chat-message bot';
                
                // Get intelligent response
                const response = findBestResponse(message);
                botMsg.innerHTML = response.replace(/\n/g, '<br>');
                
                // Save to conversation history
                conversationHistory.push({ role: 'bot', message: response });
                
                chatMessages.appendChild(botMsg);
                
                // Scroll to bottom
                chatMessages.scrollTop = chatMessages.scrollHeight;
            }, typingDelay);
        }

        // Send button click
        sendChatBtn.addEventListener('click', sendMessage);

        // Enter key press
        chatInputField.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });

        // Newsletter Form Submission
        document.getElementById('newsletter-form').addEventListener('submit', (e) => {
            e.preventDefault();
            const email = e.target.querySelector('input').value;
            alert(`Thank you for subscribing with ${email}! You'll receive exclusive offers soon.`);
            e.target.reset();
        });

        // Smooth scroll for internal links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });

        // Add animation on scroll
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);

        // Observe support cards
        document.querySelectorAll('.support-card').forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            card.style.transition = `all 0.6s ease ${index * 0.1}s`;
            observer.observe(card);
        });

        // Observe FAQ items
        document.querySelectorAll('.faq-item').forEach((item, index) => {
            item.style.opacity = '0';
            item.style.transform = 'translateY(20px)';
            item.style.transition = `all 0.6s ease ${index * 0.1}s`;
            observer.observe(item);
        });