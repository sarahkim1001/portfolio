document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                if (href.startsWith('#')) {
                    e.preventDefault();
                    hamburger.classList.remove('active');
                    navMenu.classList.remove('active');

                    const targetId = href.substring(1);
                    const targetElement = document.getElementById(targetId);
                    if (targetElement) {
                        const headerHeight = document.querySelector('header').offsetHeight;
                        const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY - headerHeight - 20;
                        window.scroll({
                            top: targetPosition,
                            behavior: 'smooth'
                        });
                    }
                } else {
                    // Allow normal navigation for full URLs
                    hamburger.classList.remove('active');
                    navMenu.classList.remove('active');
                }
            });
        });
    }

    const carousels = [
        { track: document.querySelector('.carousel-track-1'), speed: 0.2, direction: -1 },
        { track: document.querySelector('.carousel-track-2'), speed: 0.1, direction: 1 },
        { track: document.querySelector('.carousel-track-3'), speed: 0.2, direction: -1 },
        { track: document.querySelector('.carousel-track-4'), speed: 0.1, direction: 1 },
        { track: document.querySelector('.carousel-track-5'), speed: 0.2, direction: -1 }
    ];

    carousels.forEach(carousel => {
        if (carousel.track) {
            const images = carousel.track.getElementsByTagName('img');
            carousel.images = images;
            carousel.scrollPosition = 0;
            carousel.imageWidth = images[0] ? images[0].clientWidth : 0;
            carousel.totalImages = images.length;
            carousel.maxScroll = (carousel.totalImages - 1) * carousel.imageWidth;
        }
    });

    function updateCarousels() {
        const scrollTop = window.scrollY;
        const viewportHeight = window.innerHeight;

        carousels.forEach(carousel => {
            if (!carousel.track) return;
            const carouselElement = carousel.track.closest('.carousel');
            const rect = carouselElement.getBoundingClientRect();
            const carouselTop = rect.top + scrollTop;
            const carouselBottom = carouselTop + rect.height;

            if (scrollTop < carouselBottom && scrollTop + viewportHeight > carouselTop) {
                const rangeStart = carouselTop - viewportHeight;
                const rangeEnd = carouselBottom;
                const scrollRange = rangeEnd - rangeStart;
                const progress = Math.max(0, Math.min(1, (scrollTop - rangeStart) / scrollRange));

                carousel.scrollPosition = progress * carousel.maxScroll * carousel.speed * carousel.direction;
                if (carousel.scrollPosition > carousel.maxScroll) carousel.scrollPosition = carousel.maxScroll;
                if (carousel.scrollPosition < -carousel.maxScroll) carousel.scrollPosition = -carousel.maxScroll;

                carousel.track.style.transform = `translateX(${carousel.scrollPosition}px)`;
            }
        });
    }

    window.addEventListener('scroll', updateCarousels);
    window.addEventListener('resize', updateCarousels);

    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);

        const fadeInSections = document.querySelectorAll('.fade-in-section');

        fadeInSections.forEach(section => {
            gsap.from(section, {
                opacity: 0,
                y: 20,
                duration: 2,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: section,
                    start: 'top 80%',
                    end: 'bottom 20%',
                    toggleActions: 'play none none reverse'
                }
            });
        });
    }
});