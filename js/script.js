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
    loadGitHubProjects();

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
// GITHUB PROJECT LOADER
// ========================================
function loadGitHubProjects() {

    const username = "Samsrepo-101";

    const fullGrid = document.getElementById("projects-grid"); // projects.html
    const previewGrid = document.getElementById("projects-preview-grid"); // index.html

    if (!fullGrid && !previewGrid) return;

    fetch(`https://api.github.com/users/${username}/repos`, {
        headers: {
            "Accept": "application/vnd.github.mercy-preview+json"
        }
    })
    .then(response => response.json())
    .then(data => {

        // Remove forks
        const repos = data.filter(repo => !repo.fork);

        // Sort newest first
        repos.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

        // -----------------------------------
        // FULL PROJECTS PAGE
        // -----------------------------------
        if (fullGrid) {
            fullGrid.innerHTML = "";

            repos.forEach(repo => {
                fullGrid.appendChild(createProjectCard(repo));
            });

            initProjectFilter();
        }

        // -----------------------------------
        // HOME PAGE PREVIEW (LIMIT TO 3)
        // -----------------------------------
        if (previewGrid) {
            previewGrid.innerHTML = "";

            repos.slice(0, 3).forEach(repo => {
                previewGrid.appendChild(createProjectCard(repo));
            });
        }

    })
    .catch(error => {
        console.error("GitHub Fetch Error:", error);
    });
}
function createProjectCard(repo) {

    let category = "Individual";
    if (repo.topics && repo.topics.includes("group-project")) {
        category = "Group Project";
    }

    const visibleTags = repo.topics
        ? repo.topics.filter(topic => topic !== "group" && topic !== "individual")
        : [];

    const tagsHTML = visibleTags.map(tag => `<span>${tag}</span>`).join("");

    const imagePath = `images/projects/${repo.name}.png`;

    const projectCard = document.createElement("article");
    projectCard.classList.add("project-card");
    projectCard.setAttribute("data-category", category);

    projectCard.innerHTML = `
        <div class="project-image">
            <img src="${imagePath}"
                 alt="${repo.name}"
                 onerror="this.src='images/projects/default.jpg'">
        </div>
        <div class="project-content">
            <h3>${repo.name}</h3>
            <p>${repo.description ? repo.description : "No description available."}</p>
            <div class="project-tags">
                ${tagsHTML}
            </div>
            <a href="${repo.html_url}"
               target="_blank"
               class="btn btn-primary btn-small">
               View Repository
            </a>
        </div>
    `;

    return projectCard;
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

// ========================================
// TESTIMONIALS.JS
// All testimonials — seed + submitted — render
// into one single grid so layout always stays clean.
// ========================================

document.addEventListener('DOMContentLoaded', function () {

    // --- EmailJS Init ---
    emailjs.init("iSOfqy_S7Z-BxCV9e");

    // ----------------------------------------
    // SEED TESTIMONIALS
    // Edit or remove these freely — the grid
    // will always reflow cleanly on its own.
    // ----------------------------------------
    const SEED_TESTIMONIALS = [
        {
            from_name: "Juan Reyes",
            from_role: "Classmate & Group Project Partner",
            rating: "5",
            message: "Samantha is one of the most dedicated team members I've worked with. She consistently delivers clean, well-structured code and is always willing to help others debug their problems. A true asset to any team!",
            isNew: false
        },
        {
            from_name: "Maria Cruz",
            from_role: "IT Instructor",
            rating: "5",
            message: "Her attention to detail in UI design is remarkable for a student at her level. The barbershop website she contributed to looked incredibly polished and professional. I'm excited to see where her career takes her.",
            isNew: false
        },
        {
            from_name: "Angelo Lim",
            from_role: "Group Project Partner",
            rating: "5",
            message: "Working with Samantha on our Lost and Found app was a great experience. She took ownership of the Android Studio components and made sure everything worked seamlessly. Very reliable and communicative!",
            isNew: false
        }
    ];

    // --- DOM References ---
    const grid         = document.getElementById('testimonials-grid');
    const form         = document.getElementById('testimonial-form');
    const starRatingEl = document.getElementById('star-rating');
    const ratingInput  = document.getElementById('t-rating');
    const textarea     = document.getElementById('t-message');
    const charCount    = document.getElementById('char-count');
    const submitBtn    = document.getElementById('submit-btn');
    const formSuccess  = document.getElementById('form-success');
    const formErrorAlert = document.getElementById('form-error-alert');

    // ----------------------------------------
    // RENDER ALL TESTIMONIALS INTO ONE GRID
    // Seed first, then submitted (newest first)
    // ----------------------------------------
    function renderAllTestimonials() {
        if (!grid) return;
        grid.innerHTML = '';

        // 1. Seed cards
        SEED_TESTIMONIALS.forEach(t => createCard(t, false));

        // 2. Submitted cards from localStorage
        const saved = JSON.parse(localStorage.getItem('portfolio_testimonials') || '[]');
        saved.forEach(t => createCard(t, true));
    }

    function createCard(data, isNew) {
        const initials = data.from_name
            .trim()
            .split(/\s+/)
            .map(w => w[0])
            .join('')
            .toUpperCase()
            .substring(0, 2);

        const ratingNum = parseInt(data.rating) || 5;
        const stars = '★'.repeat(ratingNum) + '☆'.repeat(5 - ratingNum);

        const card = document.createElement('div');
        card.classList.add('testimonial-card');
        if (isNew) card.classList.add('new-testimonial');

        card.innerHTML = `
            ${isNew ? '<span class="new-badge">New</span>' : ''}
            <div class="testimonial-quote">❝</div>
            <p class="testimonial-text">${escapeHTML(data.message)}</p>
            <div class="testimonial-author">
                <div class="author-avatar">${initials}</div>
                <div class="author-info">
                    <span class="author-name">${escapeHTML(data.from_name)}</span>
                    <span class="author-role">${escapeHTML(data.from_role)}</span>
                </div>
                <div class="testimonial-stars">${stars}</div>
            </div>
        `;

        grid.appendChild(card);

        // Fade-in animation
        card.style.opacity = '0';
        card.style.transform = 'translateY(16px)';
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            });
        });
    }

    function escapeHTML(str) {
        const div = document.createElement('div');
        div.appendChild(document.createTextNode(str));
        return div.innerHTML;
    }

    // Initial render
    renderAllTestimonials();

    // ----------------------------------------
    // STAR RATING INTERACTION
    // ----------------------------------------
    if (starRatingEl) {
        const stars = starRatingEl.querySelectorAll('.star');

        stars.forEach(star => {
            star.addEventListener('mouseenter', function () {
                const val = parseInt(this.dataset.value);
                stars.forEach(s => s.classList.toggle('active', parseInt(s.dataset.value) <= val));
            });

            star.addEventListener('click', function () {
                ratingInput.value = this.dataset.value;
                const val = parseInt(this.dataset.value);
                stars.forEach(s => s.classList.toggle('active', parseInt(s.dataset.value) <= val));
                document.getElementById('t-rating-error').textContent = '';
            });
        });

        starRatingEl.addEventListener('mouseleave', function () {
            const selected = parseInt(ratingInput.value) || 0;
            stars.forEach(s => s.classList.toggle('active', parseInt(s.dataset.value) <= selected));
        });
    }

    // ----------------------------------------
    // CHARACTER COUNT
    // ----------------------------------------
    if (textarea && charCount) {
        textarea.addEventListener('input', function () {
            const len = Math.min(this.value.length, 500);
            if (this.value.length > 500) this.value = this.value.substring(0, 500);
            charCount.textContent = `${len} / 500 characters`;
            charCount.classList.toggle('near-limit', len >= 425);
        });
    }

    // ----------------------------------------
    // FORM VALIDATION
    // ----------------------------------------
    function validateForm() {
        let valid = true;

        ['t-name', 't-email', 't-role', 't-message'].forEach(id => {
            const el  = document.getElementById(id);
            const err = document.getElementById(id + '-error');
            if (el)  el.classList.remove('error');
            if (err) err.textContent = '';
        });
        ['t-rating', 't-consent'].forEach(id => {
            const err = document.getElementById(id + '-error');
            if (err) err.textContent = '';
        });

        const name    = document.getElementById('t-name');
        const email   = document.getElementById('t-email');
        const role    = document.getElementById('t-role');
        const message = document.getElementById('t-message');
        const consent = document.getElementById('t-consent');
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!name.value.trim() || name.value.trim().length < 2) {
            showFieldError('t-name', 'Please enter your full name (at least 2 characters).');
            valid = false;
        }
        if (!email.value.trim()) {
            showFieldError('t-email', 'Email is required.');
            valid = false;
        } else if (!emailRegex.test(email.value.trim())) {
            showFieldError('t-email', 'Please enter a valid email address.');
            valid = false;
        }
        if (!role.value.trim()) {
            showFieldError('t-role', 'Your role or relationship is required.');
            valid = false;
        }
        if (!ratingInput.value) {
            document.getElementById('t-rating-error').textContent = 'Please select a star rating.';
            valid = false;
        }
        if (!message.value.trim() || message.value.trim().length < 20) {
            showFieldError('t-message', 'Please write at least 20 characters.');
            valid = false;
        }
        if (!consent.checked) {
            document.getElementById('t-consent-error').textContent = 'You must agree before submitting.';
            valid = false;
        }

        return valid;
    }

    function showFieldError(id, msg) {
        const input = document.getElementById(id);
        const err   = document.getElementById(id + '-error');
        if (input) input.classList.add('error');
        if (err)   err.textContent = msg;
    }

    // ----------------------------------------
    // FORM SUBMISSION
    // ----------------------------------------
    if (form) {
        form.addEventListener('submit', function (e) {
            e.preventDefault();
            if (!validateForm()) return;

            submitBtn.disabled = true;
            submitBtn.querySelector('.btn-text').style.display = 'none';
            submitBtn.querySelector('.btn-loading').style.display = 'inline';
            formErrorAlert.style.display = 'none';

            const formData = {
                from_name:  document.getElementById('t-name').value.trim(),
                from_email: document.getElementById('t-email').value.trim(),
                from_role:  document.getElementById('t-role').value.trim(),
                rating:     ratingInput.value,
                message:    document.getElementById('t-message').value.trim(),
            };

            emailjs.send(
                "service_gcvnfsk",
                "template_i3c8ek8",   // Replace with your testimonial template ID
                {
                    from_name:  formData.from_name,
                    from_email: formData.from_email,
                    from_role:  formData.from_role,
                    rating:     formData.rating + ' / 5 stars',
                    message:    formData.message,
                    subject:    `New Testimonial from ${formData.from_name}`,
                }
            )
            .then(function () {
                // Save to localStorage
                const saved = JSON.parse(localStorage.getItem('portfolio_testimonials') || '[]');
                saved.unshift(formData);
                localStorage.setItem('portfolio_testimonials', JSON.stringify(saved));

                // Re-render entire grid cleanly
                renderAllTestimonials();

                // Show success
                formSuccess.classList.add('show');
                formSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });
                setTimeout(() => formSuccess.classList.remove('show'), 6000);

                // Reset form
                form.reset();
                ratingInput.value = '';
                document.querySelectorAll('.star').forEach(s => s.classList.remove('active'));
                if (charCount) charCount.textContent = '0 / 500 characters';
            })
            .catch(function (error) {
                console.error('EmailJS Error:', error);
                formErrorAlert.style.display = 'flex';
                formErrorAlert.scrollIntoView({ behavior: 'smooth', block: 'center' });
            })
            .finally(function () {
                submitBtn.disabled = false;
                submitBtn.querySelector('.btn-text').style.display = 'inline';
                submitBtn.querySelector('.btn-loading').style.display = 'none';
            });
        });
    }

});