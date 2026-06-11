// The Bakery Buena Park — Script
// "Baked Fresh Daily for Our Neighbors"

document.addEventListener('DOMContentLoaded', () => {

    // ============================================
    // SCROLL PROGRESS BAR
    // ============================================
    const scrollProgress = document.getElementById('scrollProgress');
    function updateScrollProgress() {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        if (docHeight > 0) {
            scrollProgress.style.width = (scrollTop / docHeight) * 100 + '%';
        }
    }
    window.addEventListener('scroll', updateScrollProgress, { passive: true });

    // ============================================
    // NAVBAR SCROLL STATE
    // ============================================
    const navbar = document.getElementById('navbar');
    function updateNavbar() {
        navbar.classList.toggle('scrolled', window.scrollY > 50);
    }
    window.addEventListener('scroll', updateNavbar, { passive: true });

    // ============================================
    // MOBILE MENU TOGGLE
    // ============================================
    const mobileToggle = document.getElementById('mobileToggle');
    const mobileMenu = document.getElementById('mobileMenu');

    function openMobileMenu() {
        mobileToggle.classList.add('active');
        mobileMenu.classList.add('open');
        document.body.style.overflow = 'hidden';
    }

    function closeMobileMenu() {
        mobileToggle.classList.remove('active');
        mobileMenu.classList.remove('open');
        document.body.style.overflow = '';
    }

    mobileToggle.addEventListener('click', () => {
        if (mobileMenu.classList.contains('open')) {
            closeMobileMenu();
        } else {
            openMobileMenu();
        }
    });

    // Close mobile menu on link click
    mobileMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', closeMobileMenu);
    });

    // Close mobile menu on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
            closeMobileMenu();
        }
    });

    // ============================================
    // OPEN/CLOSED STATUS INDICATOR
    // ============================================
    const statusDot = document.getElementById('statusDot');
    const statusText = document.getElementById('statusText');

    function updateOpenStatus() {
        const now = new Date();
        const day = now.getDay(); // 0=Sun, 1=Mon, 2=Tue, ..., 6=Sat
        const time = now.getHours() + now.getMinutes() / 60;
        let isOpen = false;

        // Tue-Sat: 7AM - 6PM (day 2-6)
        if (day >= 2 && day <= 6) {
            isOpen = time >= 7 && time < 18;
        }
        // Sun: 8AM - 3PM (day 0)
        if (day === 0) {
            isOpen = time >= 8 && time < 15;
        }
        // Mon: Closed (day 1)

        if (statusDot && statusText) {
            statusDot.className = isOpen ? 'status-dot' : 'status-dot closed';
            statusText.textContent = isOpen ? 'Open Now' : 'Closed';
            statusText.style.color = isOpen ? '#16a34a' : '#92400e';
        }
    }

    updateOpenStatus();
    setInterval(updateOpenStatus, 60000); // Update every minute

    // ============================================
    // DAILY SPECIALS DATE
    // ============================================
    const boardDate = document.getElementById('boardDate');
    if (boardDate) {
        const now = new Date();
        const options = { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' };
        boardDate.textContent = now.toLocaleDateString('en-US', options);
    }

    // ============================================
    // REVEAL ON SCROLL (Intersection Observer)
    // ============================================
    const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                // Optionally stop observing after reveal
                // revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -60px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));

    // ============================================
    // MOBILE CTA BAR (show after scrolling)
    // ============================================
    const mobileCtaBar = document.getElementById('mobileCtaBar');
    if (mobileCtaBar && window.innerWidth < 1024) {
        function updateMobileCta() {
            mobileCtaBar.classList.toggle('visible', window.scrollY > 500);
        }
        window.addEventListener('scroll', updateMobileCta, { passive: true });
    }

    // ============================================
    // BACK TO TOP BUTTON
    // ============================================
    const backToTop = document.getElementById('backToTop');

    function updateBackToTop() {
        backToTop.classList.toggle('visible', window.scrollY > 600);
    }
    window.addEventListener('scroll', updateBackToTop, { passive: true });

    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // ============================================
    // FORM VALIDATION
    // ============================================
    const form = document.getElementById('contactForm');
    const formSuccess = document.getElementById('formSuccess');

    if (form) {
        const nameInput = form.querySelector('#name');
        const phoneInput = form.querySelector('#phone');
        const emailInput = form.querySelector('#email');
        const nameError = document.getElementById('nameError');
        const phoneError = document.getElementById('phoneError');
        const emailError = document.getElementById('emailError');

        // Real-time validation: remove error on valid input
        function clearFieldError(input, errorEl) {
            input.addEventListener('input', () => {
                if (input.value.trim()) {
                    input.classList.remove('error');
                    if (errorEl) errorEl.style.display = 'none';
                }
            });
            input.addEventListener('focus', () => {
                input.classList.remove('error');
                if (errorEl) errorEl.style.display = 'none';
            });
        }

        clearFieldError(nameInput, nameError);
        clearFieldError(phoneInput, phoneError);
        if (emailInput && emailError) clearFieldError(emailInput, emailError);

        // Validate individual fields
        function validateName() {
            const val = nameInput.value.trim();
            if (!val || val.length < 2) {
                nameInput.classList.add('error');
                if (nameError) nameError.style.display = 'block';
                return false;
            }
            nameInput.classList.remove('error');
            if (nameError) nameError.style.display = 'none';
            return true;
        }

        function validatePhone() {
            const val = phoneInput.value.trim();
            // Basic phone validation: at least 7 digits
            const digits = val.replace(/\D/g, '');
            if (!val || digits.length < 7) {
                phoneInput.classList.add('error');
                if (phoneError) phoneError.style.display = 'block';
                return false;
            }
            phoneInput.classList.remove('error');
            if (phoneError) phoneError.style.display = 'none';
            return true;
        }

        function validateEmail() {
            if (!emailInput) return true;
            const val = emailInput.value.trim();
            // Email is optional — only validate if filled
            if (!val) {
                emailInput.classList.remove('error');
                if (emailError) emailError.style.display = 'none';
                return true;
            }
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(val)) {
                emailInput.classList.add('error');
                if (emailError) emailError.style.display = 'block';
                return false;
            }
            emailInput.classList.remove('error');
            if (emailError) emailError.style.display = 'none';
            return true;
        }

        // Blur validation
        nameInput.addEventListener('blur', validateName);
        phoneInput.addEventListener('blur', validatePhone);
        if (emailInput) emailInput.addEventListener('blur', validateEmail);

        // Form submission
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            const isNameValid = validateName();
            const isPhoneValid = validatePhone();
            const isEmailValid = validateEmail();

            if (!isNameValid || !isPhoneValid || !isEmailValid) {
                // Scroll to first error
                const firstError = form.querySelector('.error');
                if (firstError) {
                    firstError.focus();
                    firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
                return;
            }

            // Success!
            form.style.display = 'none';
            if (formSuccess) {
                formSuccess.classList.add('show');
            }

            // Reset after delay
            setTimeout(() => {
                form.reset();
                form.style.display = '';
                if (formSuccess) formSuccess.classList.remove('show');
            }, 6000);
        });
    }

    // ============================================
    // SMOOTH SCROLL FOR ANCHOR LINKS
    // ============================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            const target = document.querySelector(anchor.getAttribute('href'));
            if (target) {
                e.preventDefault();
                const navHeight = navbar.offsetHeight;
                const targetPos = target.getBoundingClientRect().top + window.scrollY - navHeight - 16;
                window.scrollTo({ top: targetPos, behavior: 'smooth' });
            }
        });
    });

    // ============================================
    // ACTIVE NAV LINK HIGHLIGHTING
    // ============================================
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a:not(.nav-cta)');

    function updateActiveNav() {
        const scrollY = window.scrollY + 120;
        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');
            if (scrollY >= top && scrollY < top + height) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === '#' + id) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
    window.addEventListener('scroll', updateActiveNav, { passive: true });

    // ============================================
    // THROTTLED SCROLL HANDLER
    // ============================================
    let ticking = false;
    function onScroll() {
        if (!ticking) {
            requestAnimationFrame(() => {
                updateScrollProgress();
                updateNavbar();
                updateBackToTop();
                updateMobileCta && updateMobileCta();
                updateActiveNav();
                ticking = false;
            });
            ticking = true;
        }
    }
    // Override individual listeners with throttled version
    window.removeEventListener('scroll', updateScrollProgress);
    window.removeEventListener('scroll', updateNavbar);
    window.removeEventListener('scroll', updateBackToTop);
    window.addEventListener('scroll', onScroll, { passive: true });

});
