document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Lucide Icons
    lucide.createIcons();

    // 2. Initialize Lenis (Smooth Scroll)
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

    // 3. Mobile Menu Toggle
    const burger = document.querySelector('.header__burger');
    const mobileMenu = document.querySelector('.mobile-menu');
    const menuLinks = document.querySelectorAll('.mobile-menu__link');
    const mobileBtn = document.querySelector('.mobile-menu__btn');

    const toggleMenu = () => {
        mobileMenu.classList.toggle('is-active');
        const iconName = mobileMenu.classList.contains('is-active') ? 'x' : 'menu';
        
        // Update icon specifically inside the button
        burger.innerHTML = `<i data-lucide="${iconName}"></i>`;
        lucide.createIcons();
    };

    if (burger) {
        burger.addEventListener('click', toggleMenu);
    }

    // Close menu when clicking a link
    [...menuLinks, mobileBtn].forEach(link => {
        if(link) {
            link.addEventListener('click', () => {
                if(mobileMenu.classList.contains('is-active')) {
                    toggleMenu();
                }
            });
        }
    });
});