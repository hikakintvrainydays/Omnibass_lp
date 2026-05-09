document.addEventListener('DOMContentLoaded', () => {
    // 1. Sticky Header UI Toggle
    const header = document.getElementById('header');

    const handleScroll = () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Check on init

    // 2. Smooth Scroll for Anchor Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                // Offset for sticky header
                const headerHeight = header.offsetHeight;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerHeight - 20;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // 3. Scroll Reveal Animation
    const revealElements = document.querySelectorAll('.reveal-up');

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target); // Optional: animate only once
            }
        });
    }, {
        root: null,
        rootMargin: '0px 0px -100px 0px',
        threshold: 0.1
    });

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });

    // 4. FAQ Accordion Logic
    const accordionTitles = document.querySelectorAll('.accordion__title');

    accordionTitles.forEach(title => {
        title.addEventListener('click', () => {
            const isActive = title.classList.contains('active');

            // Optional: Close other accordions
            accordionTitles.forEach(t => {
                t.classList.remove('active');
                if (t.nextElementSibling) {
                    t.nextElementSibling.style.maxHeight = null;
                }
            });

            if (!isActive) {
                title.classList.add('active');
                const content = title.nextElementSibling;
                if (content) {
                    content.style.maxHeight = content.scrollHeight + "px";
                }
            }
        });
    });
});
