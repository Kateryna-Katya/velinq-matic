document.addEventListener('DOMContentLoaded', () => {
    
    // ==============================================
    // 1. Инициализация иконок (Lucide)
    // ==============================================
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // ==============================================
    // 2. Плавный скролл (Lenis)
    // ==============================================
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        direction: 'vertical',
        gestureDirection: 'vertical',
        smooth: true,
        mouseMultiplier: 1,
        smoothTouch: false,
        touchMultiplier: 2,
    });

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // ==============================================
    // 3. Мобильное меню
    // ==============================================
    const burger = document.querySelector('.header__burger');
    const mobileMenu = document.querySelector('.mobile-menu');
    const menuLinks = document.querySelectorAll('.mobile-menu__link');
    const mobileBtn = document.querySelector('.mobile-menu__btn');

    const toggleMenu = () => {
        if (!burger || !mobileMenu) return;
        
        mobileMenu.classList.toggle('is-active');
        const isActive = mobileMenu.classList.contains('is-active');
        
        const iconName = isActive ? 'x' : 'menu';
        burger.innerHTML = `<i data-lucide="${iconName}"></i>`;
        lucide.createIcons();
        
        if (isActive) {
            lenis.stop();
            document.body.style.overflow = 'hidden';
        } else {
            lenis.start();
            document.body.style.overflow = '';
        }
    };

    if (burger) {
        burger.addEventListener('click', toggleMenu);
    }

    [...menuLinks, mobileBtn].forEach(link => {
        if(link) {
            link.addEventListener('click', () => {
                if(mobileMenu && mobileMenu.classList.contains('is-active')) {
                    toggleMenu();
                }
            });
        }
    });

    // ==============================================
    // 4. Анимация Нейросети (Hero Canvas)
    // ==============================================
    const canvas = document.getElementById('neuro-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let width, height;
        let particles = [];

        const config = {
            particleColor: 'rgba(0, 208, 132, 0.8)',
            lineColor: 'rgba(0, 208, 132, 0.15)',
            particleAmount: window.innerWidth < 768 ? 30 : 60,
            defaultSpeed: 0.4,
            linkRadius: 140,
        };

        const resize = () => {
            const parent = canvas.parentElement;
            if (parent) {
                width = parent.offsetWidth;
                height = parent.offsetHeight;
                canvas.width = width;
                canvas.height = height;
            }
        };

        class Particle {
            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.vx = (Math.random() - 0.5) * config.defaultSpeed;
                this.vy = (Math.random() - 0.5) * config.defaultSpeed;
                this.size = Math.random() * 2 + 1;
            }
            update() {
                this.x += this.vx;
                this.y += this.vy;
                if (this.x < 0 || this.x > width) this.vx *= -1;
                if (this.y < 0 || this.y > height) this.vy *= -1;
            }
            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = config.particleColor;
                ctx.fill();
            }
        }

        const initParticles = () => {
            particles = [];
            for (let i = 0; i < config.particleAmount; i++) {
                particles.push(new Particle());
            }
        };

        const animateParticles = () => {
            ctx.clearRect(0, 0, width, height);
            for (let i = 0; i < particles.length; i++) {
                const p = particles[i];
                p.update();
                p.draw();
                for (let j = i; j < particles.length; j++) {
                    const p2 = particles[j];
                    const dx = p.x - p2.x;
                    const dy = p.y - p2.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    if (distance < config.linkRadius) {
                        ctx.beginPath();
                        ctx.strokeStyle = config.lineColor;
                        ctx.lineWidth = 1;
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(p2.x, p2.y);
                        ctx.stroke();
                    }
                }
            }
            requestAnimationFrame(animateParticles);
        };

        resize();
        initParticles();
        animateParticles();

        window.addEventListener('resize', () => {
            resize();
            if (particles.length === 0 || Math.abs(width - canvas.width) > 50) {
                initParticles();
            }
        });
    }

    // ==============================================
    // 5. ЛОГИКА ФОРМЫ (Валидация + Капча)
    // ==============================================
    const contactForm = document.getElementById('contactForm');
    const phoneInput = document.getElementById('phone');
    const captchaInput = document.getElementById('captcha');
    const captchaQuestion = document.getElementById('captcha-question');
    const successMessage = document.getElementById('successMessage');

    // A. Валидация телефона (Только цифры)
    if (phoneInput) {
        phoneInput.addEventListener('input', (e) => {
            e.target.value = e.target.value.replace(/\D/g, '');
        });
    }

    // B. Капча
    let captchaResult = 0;
    const generateCaptcha = () => {
        if (!captchaQuestion) return;
        const num1 = Math.floor(Math.random() * 10) + 1;
        const num2 = Math.floor(Math.random() * 10) + 1;
        captchaResult = num1 + num2;
        captchaQuestion.textContent = `${num1} + ${num2} = ?`;
    };
    generateCaptcha();

    // C. Отправка
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            if (parseInt(captchaInput.value) !== captchaResult) {
                alert('Неверное решение примера.');
                generateCaptcha();
                captchaInput.value = '';
                return;
            }

            const btn = contactForm.querySelector('button[type="submit"]');
            btn.textContent = 'Отправка...';
            btn.disabled = true;

            setTimeout(() => {
                contactForm.style.display = 'none';
                successMessage.style.display = 'block';
                lucide.createIcons();
                contactForm.reset();
            }, 1500);
        });
    }

    // ==============================================
    // 6. COOKIE POPUP (Сохранение в LocalStorage)
    // ==============================================
    const cookiePopup = document.getElementById('cookie-popup');
    const cookieBtn = document.getElementById('accept-cookies');

    if (cookiePopup && cookieBtn) {
        // Проверяем, есть ли запись в хранилище
        if (!localStorage.getItem('velinq_cookie_consent')) {
            // Если нет — показываем с небольшой задержкой (чтобы красиво выехало)
            setTimeout(() => {
                cookiePopup.classList.add('is-visible');
            }, 1000);
        }

        // Клик по кнопке
        cookieBtn.addEventListener('click', () => {
            // 1. Сохраняем согласие
            localStorage.setItem('velinq_cookie_consent', 'true');
            // 2. Убираем класс видимости
            cookiePopup.classList.remove('is-visible');
        });
    }
});