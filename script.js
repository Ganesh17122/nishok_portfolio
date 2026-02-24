/* ============================================================
   NISHOK KANNA — PORTFOLIO SCRIPTS
   Smooth animations, navbar, scroll effects, form handling
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

    // ── DOM References ──
    const navbar      = document.getElementById('navbar');
    const navToggle   = document.getElementById('navToggle');
    const navMenu     = document.getElementById('navMenu');
    const navLinks    = document.querySelectorAll('.nav-link[data-section]');
    const sections    = document.querySelectorAll('.section, .hero');
    const contactForm = document.getElementById('contactForm');
    const statNumbers = document.querySelectorAll('.stat-number[data-count]');

    // ── Navbar: Scroll Background ──
    let lastScroll = 0;

    function handleNavScroll() {
        const scrollY = window.scrollY;

        if (scrollY > 60) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        lastScroll = scrollY;
    }

    window.addEventListener('scroll', handleNavScroll, { passive: true });

    // ── Navbar: Mobile Toggle ──
    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('open');
        document.body.style.overflow = navMenu.classList.contains('open') ? 'hidden' : '';
    });

    // Close mobile menu on link click
    navMenu.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            navMenu.classList.remove('open');
            document.body.style.overflow = '';
        });
    });

    // ── Navbar: Active Section Highlight on Scroll ──
    function highlightNavLink() {
        let current = '';
        const scrollY = window.scrollY + 200;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;

            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('data-section') === current) {
                link.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', highlightNavLink, { passive: true });

    // ── Scroll Animations (Intersection Observer) ──
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -60px 0px',
        threshold: 0.1
    };

    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Don't unobserve — keep it visible
            }
        });
    }, observerOptions);

    document.querySelectorAll('.animate-on-scroll').forEach(el => {
        scrollObserver.observe(el);
    });

    // ── Counter Animation ──
    let countersAnimated = false;

    function animateCounters() {
        if (countersAnimated) return;

        const statsSection = document.querySelector('.hero-stats');
        if (!statsSection) return;

        const rect = statsSection.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
            countersAnimated = true;

            statNumbers.forEach(num => {
                const target = parseInt(num.getAttribute('data-count'), 10);
                let current = 0;
                const duration = 1500;
                const stepTime = Math.max(Math.floor(duration / target), 50);

                const counter = setInterval(() => {
                    current++;
                    num.textContent = current;
                    if (current >= target) {
                        clearInterval(counter);
                    }
                }, stepTime);
            });
        }
    }

    window.addEventListener('scroll', animateCounters, { passive: true });
    // Check on load in case hero is visible
    setTimeout(animateCounters, 500);

    // ── Smooth Scroll for anchor links ──
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                e.preventDefault();
                const offsetTop = target.offsetTop - 70; // navbar height
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ── Contact Form Handling ──
    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const submitBtn = document.getElementById('submitBtn');
            const originalHTML = submitBtn.innerHTML;

            // Show loading state
            submitBtn.innerHTML = `
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="spin">
                    <path d="M21 12a9 9 0 1 1-6.219-8.56"></path>
                </svg>
                <span>Sending...</span>
            `;
            submitBtn.disabled = true;
            submitBtn.style.opacity = '0.7';

            // Simulate sending (replace with actual API)
            setTimeout(() => {
                submitBtn.innerHTML = `
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M20 6L9 17l-5-5"></path>
                    </svg>
                    <span>Message Sent!</span>
                `;
                submitBtn.style.opacity = '1';
                submitBtn.style.background = '#16a34a';

                // Reset form
                contactForm.reset();

                // Restore button after delay
                setTimeout(() => {
                    submitBtn.innerHTML = originalHTML;
                    submitBtn.disabled = false;
                    submitBtn.style.background = '';
                }, 3000);
            }, 1500);
        });
    }

    // ── Typing Effect for Code Window ──
    const codeBlock = document.querySelector('.code-window-body code');
    if (codeBlock) {
        const fullHTML = codeBlock.innerHTML;
        codeBlock.innerHTML = '';
        codeBlock.style.opacity = '1';

        let i = 0;
        const speed = 12;
        let isTag = false;
        let tagBuffer = '';

        function typeCode() {
            if (i < fullHTML.length) {
                const char = fullHTML[i];

                if (char === '<') {
                    isTag = true;
                    tagBuffer = '<';
                } else if (char === '>' && isTag) {
                    isTag = false;
                    tagBuffer += '>';
                    codeBlock.innerHTML += tagBuffer;
                    tagBuffer = '';
                } else if (isTag) {
                    tagBuffer += char;
                } else {
                    codeBlock.innerHTML += char;
                }

                i++;
                requestAnimationFrame(() => setTimeout(typeCode, speed));
            }
        }

        // Start typing when hero is visible
        setTimeout(typeCode, 800);
    }

    // ── Add spin animation style ──
    const style = document.createElement('style');
    style.textContent = `
        @keyframes spin {
            from { transform: rotate(0deg); }
            to   { transform: rotate(360deg); }
        }
        .spin {
            animation: spin 1s linear infinite;
        }
    `;
    document.head.appendChild(style);

    // ── Parallax-like effect for hero glows ──
    window.addEventListener('mousemove', (e) => {
        const glows = document.querySelectorAll('.hero-glow');
        const x = (e.clientX / window.innerWidth - 0.5) * 20;
        const y = (e.clientY / window.innerHeight - 0.5) * 20;

        glows.forEach((glow, index) => {
            const factor = index === 0 ? 1 : -1;
            glow.style.transform = `translate(${x * factor}px, ${y * factor}px)`;
        });
    }, { passive: true });

});
