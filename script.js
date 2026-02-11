// Main JavaScript for Portfolio Website

document.addEventListener('DOMContentLoaded', function () {
    // Typewriter effect for the hero section title
    const heroTitleText = 'Hi, my name is Asad';
    let typewriterActive = false;
    let typewriterCompleted = false;

    function typeWriter(elementId, text, speed) {
        if (typewriterActive || typewriterCompleted) return;
        typewriterActive = true;

        const targetElement = document.getElementById(elementId);
        if (!targetElement) {
            console.error(`Element with ID "${elementId}" not found.`);
            typewriterActive = false;
            return;
        }

        if (targetElement.textContent === '') {
            targetElement.textContent = '';
        }

        let i = 0;
        function type() {
            if (i < text.length) {
                targetElement.textContent += text.charAt(i);
                i++;
                setTimeout(type, speed);
            } else {
                typewriterActive = false;
                typewriterCompleted = true;
                document.body.classList.add('typewriter-complete');
            }
        }
        setTimeout(type, 100);
    }

    typeWriter('hero-title', heroTitleText, 120);

    // Theme toggle functionality
    const themeToggle = document.getElementById('themeToggle');
    const body = document.body;

    const savedTheme = localStorage.getItem('theme') ||
        (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');

    body.setAttribute('data-theme', savedTheme);
    updateThemeButton(savedTheme);

    if (themeToggle) {
        themeToggle.addEventListener('click', function () {
            const currentTheme = body.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            body.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            updateThemeButton(newTheme);
        });
    } else {
        console.error('Theme toggle button not found.');
    }

    function updateThemeButton(theme) {
        const icon = themeToggle.querySelector('i');
        const text = document.getElementById('themeToggleText');

        if (icon && text) {
            if (theme === 'dark') {
                icon.classList.remove('fa-moon');
                icon.classList.add('fa-sun');
                text.textContent = 'Light Mode';
                themeToggle.classList.remove('btn-outline-secondary');
                themeToggle.classList.add('btn-light');
            } else {
                icon.classList.remove('fa-sun');
                icon.classList.add('fa-moon');
                text.textContent = 'Dark Mode';
                themeToggle.classList.remove('btn-light');
                themeToggle.classList.add('btn-outline-secondary');
            }
        } else {
            console.error('Theme toggle icon or text element not found.');
        }
    }

    // Update current year in footer
    document.getElementById('currentYear').textContent = new Date().getFullYear();

    // Navbar scroll effect - only change after hero section
    const navbar = document.querySelector('.navbar');
    const heroSection = document.getElementById('home');

    window.addEventListener('scroll', function () {
        const heroBottom = heroSection.offsetTop + heroSection.offsetHeight;

        if (window.scrollY > heroBottom - 70) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Update active nav link based on scroll position
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.navbar .nav-link');

    window.addEventListener('scroll', function () {
        let current = '';
        const scrollPosition = window.scrollY + (window.innerHeight / 3);

        sections.forEach(section => {
            if (scrollPosition >= section.offsetTop) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href');
            if (href === `#${current}`) {
                link.classList.add('active');
            }
        });
    });

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            if (this.getAttribute('href') === '#') {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
                return;
            }

            const targetElement = document.querySelector(this.getAttribute('href'));
            if (targetElement) {
                e.preventDefault();

                const navbarCollapse = document.querySelector('.navbar-collapse');
                if (navbarCollapse.classList.contains('show')) {
                    const bsCollapse = new bootstrap.Collapse(navbarCollapse, {
                        toggle: false
                    });
                    bsCollapse.hide();
                }

                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Form submission handling - CORRECTED VERSION
    const contactForm = document.getElementById('contactForm');
    const sendBtn = document.getElementById('sendBtn');
    const alertBox = document.getElementById('formAlert');

    if (contactForm && sendBtn && alertBox) {
        // Initialize EmailJS with your public key
        emailjs.init("Kde46UZjmGuosX7u6");

        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            // Show loading state
            sendBtn.disabled = true;
            sendBtn.innerHTML = `<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Sending...`;

            // Prepare form data
            const formData = {
                user_name: document.getElementById('name').value,
                user_email: document.getElementById('email').value,
                subject: document.getElementById('subject').value,
                message: document.getElementById('message').value
            };

            // Send email using EmailJS
            emailjs.send("service_2c83wls", "template_zf7m5xn", formData)
                .then(function (response) {
                    console.log('Email sent successfully!', response.status, response.text);
                    // Show success message
                    alertBox.className = "alert alert-success mt-3";
                    alertBox.textContent = "Your message has been sent successfully!";
                    alertBox.style.display = "block";
                    
                    // Reset form
                    contactForm.reset();
                    
                    // Hide alert after 5 seconds
                    setTimeout(() => {
                        alertBox.style.display = "none";
                    }, 5000);
                }, function (error) {
                    console.error('Email sending failed:', error);
                    // Show error message
                    alertBox.className = "alert alert-danger mt-3";
                    alertBox.textContent = "Oops! Something went wrong. Please try again.";
                    alertBox.style.display = "block";
                })
                .finally(function () {
                    // Reset button state
                    sendBtn.disabled = false;
                    sendBtn.innerHTML = 'Send Message';
                });
        });
    }
});