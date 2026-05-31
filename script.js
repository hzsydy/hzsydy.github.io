document.addEventListener('DOMContentLoaded', () => {
    
    // --- Header Scrolled Effect ---
    const header = document.getElementById('header');
    const handleScroll = () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check

    // --- Active Link Highlight on Scroll ---
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');
    
    const observerOptions = {
        root: null,
        rootMargin: '-20% 0px -60% 0px', // Trigger when section occupies the main viewport area
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

    // --- Scroll Reveal Animations ---
    const revealElements = document.querySelectorAll('.reveal');
    const revealObserverOptions = {
        root: null,
        rootMargin: '0px 0px -100px 0px', // Reveal slightly before entering viewport
        threshold: 0.1
    };

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                revealObserver.unobserve(entry.target); // Animate only once
            }
        });
    }, revealObserverOptions);

    revealElements.forEach(el => revealObserver.observe(el));

    // --- Publication Dynamic Category Filter ---
    const filterButtons = document.querySelectorAll('.filter-btn');
    const pubCards = document.querySelectorAll('.pub-card');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active to current button
            button.classList.add('active');

            const filter = button.getAttribute('data-filter');

            pubCards.forEach(card => {
                const categories = card.getAttribute('data-category').split(' ');
                
                // Add fade-out transition
                card.style.opacity = '0';
                card.style.transform = 'scale(0.95)';
                
                setTimeout(() => {
                    if (filter === 'all' || categories.includes(filter)) {
                        card.style.display = 'grid';
                        // Force a reflow to trigger transition
                        card.offsetHeight;
                        card.style.opacity = '1';
                        card.style.transform = 'scale(1)';
                    } else {
                        card.style.display = 'none';
                    }
                }, 300);
            });
        });
    });

    // --- Premium BibTeX Citation Modal ---
    const citeModal = document.getElementById('citeModal');
    const citeCodeElement = document.getElementById('citeCodeElement');
    const citeCloseBtn = document.getElementById('citeCloseBtn');
    const citeCopyBtn = document.getElementById('citeCopyBtn');
    const citeTriggers = document.querySelectorAll('.cite-trigger');

    let currentCiteText = '';

    citeTriggers.forEach(trigger => {
        trigger.addEventListener('click', (e) => {
            e.preventDefault();
            const bibtex = trigger.getAttribute('data-cite');
            currentCiteText = bibtex.trim();
            citeCodeElement.textContent = currentCiteText;
            citeModal.classList.add('active');
            document.body.style.overflow = 'hidden'; // Lock background scrolling
        });
    });

    const closeModal = () => {
        citeModal.classList.remove('active');
        document.body.style.overflow = 'auto'; // Unlock background scrolling
        // Reset copy button text
        citeCopyBtn.textContent = 'Copy to Clipboard';
        citeCopyBtn.classList.remove('btn-primary');
        citeCopyBtn.classList.add('btn-secondary');
    };

    citeCloseBtn.addEventListener('click', closeModal);
    
    // Close modal on click outside of the content box
    citeModal.addEventListener('click', (e) => {
        if (e.target === citeModal) {
            closeModal();
        }
    });

    // Close modal on Escape key press
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && citeModal.classList.contains('active')) {
            closeModal();
        }
    });

    // Copy to clipboard with premium status feedback
    citeCopyBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(currentCiteText).then(() => {
            citeCopyBtn.textContent = 'Citation Copied!';
            citeCopyBtn.classList.remove('btn-secondary');
            citeCopyBtn.classList.add('btn-primary');
            
            // Revert back after 2 seconds
            setTimeout(() => {
                citeCopyBtn.textContent = 'Copy to Clipboard';
                citeCopyBtn.classList.remove('btn-primary');
                citeCopyBtn.classList.add('btn-secondary');
            }, 2000);
        }).catch(err => {
            console.error('Could not copy BibTeX: ', err);
            citeCopyBtn.textContent = 'Copy Failed';
        });
    });
});
