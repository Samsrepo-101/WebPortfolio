// ========================================
// DOM CONTENT LOADED
// ========================================
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all features
    initThemeToggle();
    initMobileMenu();
    initNavbarScroll();
    initTypewriter();
    initSkillBars();
    initProjectFilter();
    initContactForm();
    initScrollAnimations();
    initBackToTop();
    setCurrentYear();

    // ========================================
    // EMAILJS API INTEGRATION
    // ========================================

    emailjs.init("iSOfqy_S7Z-BxCV9e");

    const contactForm = document.getElementById("contact-form-page");

    if (contactForm) {
        contactForm.addEventListener("submit", function(event) {
            event.preventDefault();

            emailjs.sendForm(
                "service_gcvnfsk",
                "template_glm4stq",
                this
            )
            .then(function() {
                const successDiv = document.getElementById("form-success");
                if (successDiv) {
                    successDiv.classList.add("show");
                    setTimeout(() => successDiv.classList.remove("show"), 5000);
                }
                contactForm.reset();
            })
            .catch(function(error) {
                console.error("EmailJS Error:", error);
                alert("Failed to send message. Check console.");
            });
        });
    }
});

// ========================================
// THEME TOGGLE (JavaScript Feature #1)
// ========================================
function initThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;

    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        body.classList.add('dark-mode');
    }

    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            body.classList.toggle('dark-mode');

            // Save preference
            if (body.classList.contains('dark-mode')) {
                localStorage.setItem('theme', 'dark');
            } else {
                localStorage.setItem('theme', 'light');
            }
        });
    }
}

// ========================================
// MOBILE MENU
// ========================================
function initMobileMenu() {
    const menuToggle = document.getElementById('menu-toggle');
    const navMenu = document.getElementById('nav-menu');

    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', function() {
            menuToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Close menu when clicking on a link
        const navLinks = navMenu.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                menuToggle.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }
}

// ========================================
// NAVBAR SCROLL EFFECT
// ========================================
function initNavbarScroll() {
    const navbar = document.getElementById('navbar');

    if (navbar) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }
}

// ========================================
// TYPEWRITER EFFECT
// ========================================
function initTypewriter() {
    const typewriter = document.getElementById('typewriter');

    if (typewriter) {
        const words = ['IT Student', 'Web Developer', 'Problem Solver'];
        let wordIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let typeSpeed = 100;

        function type() {
            const currentWord = words[wordIndex];

            if (isDeleting) {
                typewriter.textContent = currentWord.substring(0, charIndex - 1);
                charIndex--;
                typeSpeed = 50;
            } else {
                typewriter.textContent = currentWord.substring(0, charIndex + 1);
                charIndex++;
                typeSpeed = 100;
            }

            if (!isDeleting && charIndex === currentWord.length) {
                typeSpeed = 2000; // Pause at end
                isDeleting = true;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                wordIndex = (wordIndex + 1) % words.length;
                typeSpeed = 500; // Pause before next word
            }

            setTimeout(type, typeSpeed);
        }

        type();
    }
}

// ========================================
// SKILL BARS ANIMATION
// ========================================
function initSkillBars() {
    const skillBars = document.querySelectorAll('.skill-progress');

    const animateSkillBars = () => {
        skillBars.forEach(bar => {
            const rect = bar.getBoundingClientRect();
            const windowHeight = window.innerHeight;

            if (rect.top < windowHeight - 100) {
                const width = bar.getAttribute('data-width');
                bar.style.width = width + '%';
            }
        });
    };

    // Initial check
    animateSkillBars();

    // Check on scroll
    window.addEventListener('scroll', animateSkillBars);
}

// ========================================
// PROJECT FILTER (JavaScript Feature #2)
// ========================================
function initProjectFilter() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    // Make all cards visible initially
    projectCards.forEach(card => {
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
    });

    if (filterBtns.length > 0 && projectCards.length > 0) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                // Update active button
                filterBtns.forEach(b => b.classList.remove('active'));
                this.classList.add('active');

                const filter = this.getAttribute('data-filter');

                projectCards.forEach((card, index) => {
                    const category = card.getAttribute('data-category');

                    if (filter === 'all' || category === filter) {
                        card.style.display = 'block';
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'translateY(0)';
                        }, index * 50);
                    } else {
                        card.style.opacity = '0';
                        card.style.transform = 'translateY(20px)';
                        setTimeout(() => {
                            card.style.display = 'none';
                        }, 300);
                    }
                });
            });
        });
    }
}

// ========================================
// CONTACT FORM VALIDATION
// ========================================
function initContactForm() {
    const form = document.getElementById('contact-form');

    if (form) {
        const nameInput = document.getElementById('name');
        const emailInput = document.getElementById('email');
        const subjectInput = document.getElementById('subject');
        const messageInput = document.getElementById('message');
        const formSuccess = document.getElementById('form-success');

        form.addEventListener('submit', function(e) {
            e.preventDefault();

            // Reset errors
            clearErrors();

            let isValid = true;

            // Validate name
            if (!nameInput.value.trim()) {
                showError('name', 'Name is required');
                isValid = false;
            }

            // Validate email
            if (!emailInput.value.trim()) {
                showError('email', 'Email is required');
                isValid = false;
            } else if (!isValidEmail(emailInput.value)) {
                showError('email', 'Please enter a valid email');
                isValid = false;
            }

            // Validate subject (if exists)
            if (subjectInput && !subjectInput.value.trim()) {
                showError('subject', 'Subject is required');
                isValid = false;
            }

            // Validate message
            if (!messageInput.value.trim()) {
                showError('message', 'Message is required');
                isValid = false;
            } else if (messageInput.value.trim().length < 10) {
                showError('message', 'Message must be at least 10 characters');
                isValid = false;
            }

            if (isValid) {
                // Show success message
                formSuccess.classList.add('show');

                // Reset form
                form.reset();

                // Hide success after 5 seconds
                setTimeout(() => {
                    formSuccess.classList.remove('show');
                }, 5000);
            }
        });

        function showError(field, message) {
            const input = document.getElementById(field);
            const errorSpan = document.getElementById(field + '-error');

            if (input) input.classList.add('error');
            if (errorSpan) errorSpan.textContent = message;
        }

        function clearErrors() {
            const inputs = form.querySelectorAll('input, textarea');
            const errorSpans = form.querySelectorAll('.error-message');

            inputs.forEach(input => input.classList.remove('error'));
            errorSpans.forEach(span => span.textContent = '');
        }

        function isValidEmail(email) {
            const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return regex.test(email);
        }
    }
}

// ========================================
// SCROLL ANIMATIONS
// ========================================
function initScrollAnimations() {
    const fadeElements = document.querySelectorAll('.fade-in');

    const checkFade = () => {
        fadeElements.forEach(element => {
            const rect = element.getBoundingClientRect();
            const windowHeight = window.innerHeight;

            if (rect.top < windowHeight - 100) {
                element.classList.add('visible');
            }
        });
    };

    // Initial check
    checkFade();

    // Check on scroll
    window.addEventListener('scroll', checkFade);
}

// ========================================
// BACK TO TOP
// ========================================
function initBackToTop() {
    const backToTop = document.getElementById('back-to-top');

    if (backToTop) {
        backToTop.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

// ========================================
// SET CURRENT YEAR
// ========================================
function setCurrentYear() {
    const yearSpan = document.getElementById('current-year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }
}

// ========================================
// SMOOTH SCROLL FOR ANCHOR LINKS
// ========================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');

        // Only prevent default and scroll for valid anchors
        if (href && href.length > 1 && href !== '#') {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                const navbar = document.getElementById('navbar');
                const navbarHeight = navbar ? navbar.offsetHeight : 80;
                const targetPosition = target.offsetTop - navbarHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        }
    });
});

