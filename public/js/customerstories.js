// --- Elegant Glow Edition JS --- //

        // Scroll reveal effect
        const reveals = document.querySelectorAll('.reveal');
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2 });

        reveals.forEach(r => observer.observe(r));

        // Hover glow effect
        document.querySelectorAll('.hover-glow').forEach(card => {
            card.addEventListener('mousemove', e => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                card.style.setProperty('--x', `${x}px`);
                card.style.setProperty('--y', `${y}px`);
            });
        });

        // Floating gold particles background
        const canvas = document.getElementById('goldParticles');
        const ctx = canvas.getContext('2d');
        let w, h, particles = [];

        function resizeCanvas() {
            w = canvas.width = window.innerWidth;
            h = canvas.height = window.innerHeight;
        }
        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();

        class Particle {
            constructor() {
                this.reset();
            }
            reset() {
                this.x = Math.random() * w;
                this.y = Math.random() * h;
                this.size = Math.random() * 2 + 0.5;
                this.speedY = Math.random() * 0.4 + 0.1;
                this.alpha = Math.random() * 0.8 + 0.2;
            }
            update() {
                this.y += this.speedY;
                if (this.y > h) this.reset();
            }
            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(212,175,55,${this.alpha})`;
                ctx.fill();
            }
        }

        for (let i = 0; i < 100; i++) particles.push(new Particle());

        function animate() {
            ctx.clearRect(0, 0, w, h);
            particles.forEach(p => {
                p.update();
                p.draw();
            });
            requestAnimationFrame(animate);
        }
        animate();


        // --- Word-by-Word Reveal for Subtitle ---
        const subtitle = document.querySelector('.subtitle-container p');
        if (subtitle) {
            const words = subtitle.textContent.trim().split(/\s+/);
            subtitle.innerHTML = words.map(w => `<span class="word">${w}</span>`).join(" ");

            const observer = new IntersectionObserver(entries => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const wordEls = subtitle.querySelectorAll('.word');
                        wordEls.forEach((w, i) => {
                            setTimeout(() => w.classList.add('visible'), i * 80);
                        });
                        observer.unobserve(subtitle);
                    }
                });
            }, { threshold: 0.2 });

            observer.observe(subtitle);
        }