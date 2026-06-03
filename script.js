document.addEventListener('DOMContentLoaded', () => {
    const header = document.getElementById('header');
    const handleScroll = () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll();

    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');

    const observerOptions = {
        root: null,
        rootMargin: '-20% 0px -60% 0px',
        threshold: 0
    };

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    } else {
                        link.classList.remove('active');
                    }
                });
            }
        });
    }, observerOptions);

    sections.forEach(section => sectionObserver.observe(section));

    const revealElements = document.querySelectorAll('.reveal');
    const revealObserverOptions = {
        root: null,
        rootMargin: '0px 0px -100px 0px',
        threshold: 0.1
    };

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                revealObserver.unobserve(entry.target);
            }
        });
    }, revealObserverOptions);

    revealElements.forEach(el => revealObserver.observe(el));

    const setupAuthorToggles = () => {
        document.querySelectorAll('.pub-authors').forEach(authors => {
            const existingButton = authors.nextElementSibling;
            if (existingButton && existingButton.classList.contains('author-toggle')) {
                existingButton.remove();
            }

            authors.dataset.toggleReady = 'false';
            authors.classList.remove('collapsible', 'expanded');

            const lineHeight = parseFloat(getComputedStyle(authors).lineHeight);
            const collapseThreshold = lineHeight * 3.2;

            if (authors.scrollHeight <= collapseThreshold) {
                return;
            }

            authors.dataset.toggleReady = 'true';
            authors.classList.add('collapsible');

            const button = document.createElement('button');
            button.type = 'button';
            button.className = 'author-toggle';
            button.setAttribute('aria-expanded', 'false');
            button.textContent = 'Show full author list';

            button.addEventListener('click', () => {
                const isExpanded = authors.classList.toggle('expanded');
                button.setAttribute('aria-expanded', String(isExpanded));
                button.textContent = isExpanded ? 'Show fewer authors' : 'Show full author list';
            });

            authors.insertAdjacentElement('afterend', button);
        });
    };

    let resizeTimer;
    const handleResize = () => {
        window.clearTimeout(resizeTimer);
        resizeTimer = window.setTimeout(setupAuthorToggles, 150);
    };

    if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(setupAuthorToggles);
    } else {
        setupAuthorToggles();
    }

    window.addEventListener('resize', handleResize);
});
