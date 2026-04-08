// Mualaf Portal - Interactive Scripts

document.addEventListener('DOMContentLoaded', () => {
    console.log('Portal Mualaf Initialized');

    // Add scroll effect to navbar
    window.addEventListener('scroll', () => {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            navbar.style.boxShadow = '0 10px 30px rgba(0,0,0,0.5)';
            navbar.style.background = 'rgba(5, 5, 5, 0.9)';
            navbar.style.transform = 'translateX(-50%) translateY(5px)';
        } else {
            navbar.style.boxShadow = 'none';
            navbar.style.background = 'var(--nav-bg)';
            navbar.style.transform = 'translateX(-50%) translateY(0)';
        }
    });

    // Reveal animations on scroll
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    document.querySelectorAll('.feature-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'all 0.6s ease-out';
        observer.observe(card);
    });
});

// Zakat Calculation logic is inline in zakat.html
// Step switching logic is simplified for prototype
