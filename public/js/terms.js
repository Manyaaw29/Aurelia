// Back to Top Button
        const backToTop = document.getElementById('backToTop');
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                backToTop.classList.add('visible');
            } else {
                backToTop.classList.remove('visible');
            }
        });

        backToTop.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });

        // Table of Contents - Active Section Highlighting
        const sections = document.querySelectorAll('h2[id]');
        const tocLinks = document.querySelectorAll('.toc-link');

        window.addEventListener('scroll', () => {
            let current = '';
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                if (window.pageYOffset >= sectionTop - 200) {
                    current = section.getAttribute('id');
                }
            });

            tocLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === '#' + current) {
                    link.classList.add('active');
                }
            });
        });

        // Smooth Scroll for TOC Links
        tocLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                const targetSection = document.querySelector(targetId);
                if (targetSection) {
                    window.scrollTo({
                        top: targetSection.offsetTop - 120,
                        behavior: 'smooth'
                    });
                }
            });
        });

        // Intersection Observer for Section Animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        };

        const sectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, observerOptions);

        sections.forEach(section => {
            sectionObserver.observe(section);
        });

        // Newsletter Form Submission
        document.getElementById('newsletterForm').addEventListener('submit', (e) => {
            e.preventDefault();
            const email = e.target.querySelector('.newsletter-input').value;
            
            // Create success message
            const button = e.target.querySelector('.newsletter-button');
            const originalText = button.textContent;
            button.textContent = 'Subscribed! ✓';
            button.style.background = '#4CAF50';
            
            // Reset after 3 seconds
            setTimeout(() => {
                button.textContent = originalText;
                button.style.background = '#D4AF37';
                e.target.reset();
            }, 3000);
        });

        // Search Functionality
        const searchInput = document.querySelector('.search-input');
        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            if (searchTerm.length > 2) {
                const mainContent = document.querySelector('.main-content');
                const text = mainContent.textContent.toLowerCase();
                
                if (text.includes(searchTerm)) {
                    console.log('Search term found:', searchTerm);
                }
            }
        });

        // Keyboard Navigation
        document.addEventListener('keydown', (e) => {
            // Home key to scroll to top
            if (e.key === 'Home') {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
            
            // End key to scroll to bottom
            if (e.key === 'End') {
                e.preventDefault();
                window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
            }
        });

        // Dynamic Date Update
        const updateDate = () => {
            const dateElement = document.querySelector('.version-date');
            const lastUpdated = new Date('2025-09-25');
            const today = new Date();
            const daysDiff = Math.floor((today - lastUpdated) / (1000 * 60 * 60 * 24));
            
            if (daysDiff > 0) {
                dateElement.innerHTML = `Last Updated: September 25, 2025 <span style="color: #D4AF37;">(${daysDiff} days ago)</span>`;
            }
        };
        updateDate();

        // Add Reading Time Estimate
        const calculateReadingTime = () => {
            const content = document.querySelector('.main-content').textContent;
            const wordCount = content.trim().split(/\s+/).length;
            const readingTime = Math.ceil(wordCount / 200);
            
            const versionDate = document.querySelector('.version-date');
            versionDate.innerHTML += ` | <span style="color: #D4AF37;">📖 ${readingTime} min read</span>`;
        };
        calculateReadingTime();