// Global variables
let currentSection = 'home';
let isLoading = true;
let animationsInitialized = false;

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// Initialize application
function initializeApp() {
    initializeLoader();
    initializeNavigation();
    initializeCursor();
    initializeMobileNav();
    initializeSidebar();
    initializeScrollIndicator();
    initializeFloatingElements();
    initializeProfileStats();
    initializeSkillBars();
    initializeContactForm();
    initializeProjectFilters();
    initializeModal();
    initializeIntersectionObserver();
    initializeTouchOptimizations();
    initializeTypingEffect();
    
    // Hide loader after initialization
    setTimeout(() => {
        hideLoader();
        // Start typing effect after loader is hidden
        setTimeout(() => {
            startTypingEffect();
        }, 1000);
    }, 2000);
}

// Loader functionality
function initializeLoader() {
    const loader = document.getElementById('loader');
    if (loader) {
        loader.classList.remove('hidden');
    }
}

function hideLoader() {
    const loader = document.getElementById('loader');
    if (loader) {
        loader.classList.add('hidden');
        isLoading = false;
        
        // Initialize animations after loader is hidden
        if (!animationsInitialized) {
            initializeAnimations();
            animationsInitialized = true;
        }
    }
}

// Navigation functionality
function initializeNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetSection = this.getAttribute('data-section');
            switchSection(targetSection);
            updateActiveNav(this);
        });
    });
}

function switchSection(sectionId) {
    // Hide current section
    const currentSectionEl = document.querySelector('.section.active');
    if (currentSectionEl) {
        currentSectionEl.classList.remove('active');
    }
    
    // Show target section
    const targetSectionEl = document.getElementById(sectionId);
    if (targetSectionEl) {
        setTimeout(() => {
            targetSectionEl.classList.add('active');
            currentSection = sectionId;
            
            // Trigger section-specific animations
            triggerSectionAnimations(sectionId);
        }, 300);
    }
}

function updateActiveNav(activeLink) {
    // Remove active class from all nav links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    
    // Add active class to clicked link
    activeLink.classList.add('active');
}

function scrollToSection(sectionId) {
    switchSection(sectionId);
    const targetNav = document.querySelector(`[data-section="${sectionId}"]`);
    if (targetNav) {
        updateActiveNav(targetNav);
    }
}

// Custom cursor functionality
function initializeCursor() {
    // Disable cursor on touch devices
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0 || window.innerWidth <= 768) {
        const cursor = document.querySelector('.cursor');
        const cursorFollower = document.querySelector('.cursor-follower');
        if (cursor) cursor.style.display = 'none';
        if (cursorFollower) cursorFollower.style.display = 'none';
        document.body.style.cursor = 'auto';
        return;
    }
    
    const cursor = document.querySelector('.cursor');
    const cursorFollower = document.querySelector('.cursor-follower');
    
    if (!cursor || !cursorFollower) return;
    
    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;
    let followerX = 0;
    let followerY = 0;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });
    
    function animateCursor() {
        // Smooth cursor movement
        cursorX += (mouseX - cursorX) * 0.9;
        cursorY += (mouseY - cursorY) * 0.9;
        
        followerX += (mouseX - followerX) * 0.1;
        followerY += (mouseY - followerY) * 0.1;
        
        cursor.style.transform = `translate(${cursorX - 5}px, ${cursorY - 5}px)`;
        cursorFollower.style.transform = `translate(${followerX - 20}px, ${followerY - 20}px)`;
        
        requestAnimationFrame(animateCursor);
    }
    
    animateCursor();
    
    // Cursor hover effects
    const hoverElements = document.querySelectorAll('a, button, .project-card, .nav-link');
    
    hoverElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.classList.add('is-link');
            cursorFollower.classList.add('is-link');
        });
        
        el.addEventListener('mouseleave', () => {
            cursor.classList.remove('is-link');
            cursorFollower.classList.remove('is-link');
        });
    });
}

// Mobile navigation
function initializeMobileNav() {
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (navToggle && navLinks) {
        navToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            navToggle.classList.toggle('active');
            navLinks.classList.toggle('open');
        });
        
        // Close mobile nav when clicking on a link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navToggle.classList.remove('active');
                navLinks.classList.remove('open');
            });
        });
        
        // Close mobile nav when clicking outside
        document.addEventListener('click', (e) => {
            if (!navLinks.contains(e.target) && !navToggle.contains(e.target)) {
                navToggle.classList.remove('active');
                navLinks.classList.remove('open');
            }
        });
    }
}

// Sidebar functionality for mobile
function initializeSidebar() {
    // Create sidebar toggle button
    const sidebarToggle = document.createElement('button');
    sidebarToggle.className = 'sidebar-toggle';
    sidebarToggle.innerHTML = '<i class="fas fa-user"></i>';
    sidebarToggle.title = 'View Profile';
    document.body.appendChild(sidebarToggle);
    
    // Create sidebar overlay
    const sidebarOverlay = document.createElement('div');
    sidebarOverlay.className = 'sidebar-overlay';
    document.body.appendChild(sidebarOverlay);
    
    const sidebar = document.querySelector('.profile-sidebar');
    
    if (sidebarToggle && sidebar) {
        sidebarToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            sidebar.classList.toggle('open');
            sidebarOverlay.classList.toggle('show');
            
            if (sidebar.classList.contains('open')) {
                sidebarToggle.innerHTML = '<i class="fas fa-times"></i>';
                document.body.style.overflow = 'hidden';
            } else {
                sidebarToggle.innerHTML = '<i class="fas fa-user"></i>';
                document.body.style.overflow = 'auto';
            }
        });
        
        // Close sidebar when clicking overlay
        sidebarOverlay.addEventListener('click', () => {
            sidebar.classList.remove('open');
            sidebarOverlay.classList.remove('show');
            sidebarToggle.innerHTML = '<i class="fas fa-user"></i>';
            document.body.style.overflow = 'auto';
        });
        
        // Close sidebar on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && sidebar.classList.contains('open')) {
                sidebar.classList.remove('open');
                sidebarOverlay.classList.remove('show');
                sidebarToggle.innerHTML = '<i class="fas fa-user"></i>';
                document.body.style.overflow = 'auto';
            }
        });
    }
}

// Scroll indicator functionality
function initializeScrollIndicator() {
    const scrollIndicator = document.querySelector('.scroll-indicator');
    
    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', () => {
            scrollToSection('about');
        });
    }
}

// Floating elements animation
function initializeFloatingElements() {
    // Disable floating elements on mobile for performance
    if (window.innerWidth <= 768) {
        const floatingElements = document.querySelector('.floating-elements');
        if (floatingElements) {
            floatingElements.style.display = 'none';
        }
        return;
    }
    
    const floatItems = document.querySelectorAll('.float-item');
    
    floatItems.forEach((item, index) => {
        const speed = parseFloat(item.getAttribute('data-speed')) || 0.5;
        
        // Initial random position
        const randomX = Math.random() * 100;
        const randomY = Math.random() * 100;
        
        item.style.left = randomX + '%';
        item.style.top = randomY + '%';
        
        // Continuous floating animation
        setInterval(() => {
            const newX = Math.random() * 80 + 10; // Keep within bounds
            const newY = Math.random() * 80 + 10;
            
            item.style.transition = `all ${2 + speed}s ease-in-out`;
            item.style.left = newX + '%';
            item.style.top = newY + '%';
        }, (3000 + index * 500) / speed);
    });
}

// Profile statistics counter animation
function initializeProfileStats() {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    statNumbers.forEach(stat => {
        const target = parseInt(stat.getAttribute('data-target'));
        animateCounter(stat, target);
    });
}

function animateCounter(element, target) {
    let current = 0;
    const increment = target / 100; // Adjust speed
    const timer = setInterval(() => {
        current += increment;
        element.textContent = Math.floor(current);
        
        if (current >= target) {
            element.textContent = target;
            clearInterval(timer);
        }
    }, 20);
}

// Skill bars animation
function initializeSkillBars() {
    // This will be triggered when about section becomes active
}

function animateSkillBars() {
    const skillBars = document.querySelectorAll('.skill-progress');
    
    skillBars.forEach((bar, index) => {
        const width = bar.getAttribute('data-width');
        
        setTimeout(() => {
            bar.style.width = width;
        }, index * 200);
    });
}

// Contact form functionality
function initializeContactForm() {
    const form = document.getElementById('contactForm');
    
    if (form) {
        form.addEventListener('submit', handleFormSubmit);
        
        // Add input focus effects
        const formInputs = form.querySelectorAll('input, textarea');
        formInputs.forEach(input => {
            input.addEventListener('focus', (e) => {
                e.target.parentElement.classList.add('focused');
            });
            
            input.addEventListener('blur', (e) => {
                if (!e.target.value) {
                    e.target.parentElement.classList.remove('focused');
                }
            });
        });
    }
}

function handleFormSubmit(e) {
    e.preventDefault();
    
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    
    // Show loading state
    submitBtn.classList.add('loading');
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> <span>Sending...</span>';
    
    // Simulate form submission
    setTimeout(() => {
        submitBtn.classList.remove('loading');
        submitBtn.innerHTML = '<i class="fas fa-check"></i> <span>Message Sent!</span>';
        
        // Reset form
        setTimeout(() => {
            e.target.reset();
            submitBtn.innerHTML = originalText;
            showNotification('Message sent successfully!', 'success');
        }, 2000);
        
    }, 2000);
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
        <span>${message}</span>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: var(--bg-tertiary);
        color: var(--text-primary);
        padding: 1rem 1.5rem;
        border-radius: 10px;
        border: 1px solid var(--primary-color);
        box-shadow: var(--shadow-light);
        z-index: 9999;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        display: flex;
        align-items: center;
        gap: 0.5rem;
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Project filters functionality
function initializeProjectFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const filter = btn.getAttribute('data-filter');
            
            // Update active filter button
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Filter projects
            projectCards.forEach(card => {
                const category = card.getAttribute('data-category');
                
                if (filter === 'all' || category === filter) {
                    card.style.display = 'block';
                    card.style.animation = 'fadeInUp 0.5s ease forwards';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
}

// Modal functionality
function initializeModal() {
    const modal = document.getElementById('projectModal');
    const closeBtn = modal?.querySelector('.close');
    
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            modal.classList.remove('show');
        });
    }
    
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('show');
            }
        });
    }
}

// Project actions
function viewProject(projectId) {
    const projectData = {
        'ecommerce': {
            title: 'E-commerce Platform',
            description: 'A comprehensive e-commerce solution built with modern technologies...',
            image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=400&fit=crop',
            tech: ['React', 'Node.js', 'MongoDB', 'Stripe API'],
            features: ['User Authentication', 'Payment Processing', 'Admin Dashboard', 'Responsive Design']
        },
        'banking': {
            title: 'Banking App UI Design',
            description: 'Modern and secure banking application interface...',
            image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=400&fit=crop',
            tech: ['Figma', 'UI/UX', 'Prototyping'],
            features: ['User Research', 'Wireframing', 'Prototyping', 'User Testing']
        },
        'taskmanager': {
            title: 'Task Management App',
            description: 'Collaborative task management tool with real-time updates...',
            image: 'https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=800&h=400&fit=crop',
            tech: ['Vue.js', 'Firebase', 'PWA'],
            features: ['Real-time Updates', 'Team Collaboration', 'Offline Support', 'Push Notifications']
        },
        'weather': {
            title: 'Weather Forecast App',
            description: 'Beautiful weather application with location-based forecasts...',
            image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&h=400&fit=crop',
            tech: ['React Native', 'API Integration', 'Geolocation'],
            features: ['Location Detection', '7-day Forecast', 'Weather Maps', 'Severe Weather Alerts']
        }
    };
    
    const project = projectData[projectId];
    if (!project) return;
    
    const modal = document.getElementById('projectModal');
    const modalBody = modal.querySelector('.modal-body');
    
    modalBody.innerHTML = `
        <img src="${project.image}" alt="${project.title}" style="width: 100%; height: 300px; object-fit: cover; border-radius: 10px; margin-bottom: 2rem;">
        <h2 style="color: var(--text-primary); margin-bottom: 1rem;">${project.title}</h2>
        <p style="color: var(--text-secondary); line-height: 1.6; margin-bottom: 2rem;">${project.description}</p>
        
        <h3 style="color: var(--primary-color); margin-bottom: 1rem;">Technologies Used</h3>
        <div style="display: flex; gap: 0.5rem; flex-wrap: wrap; margin-bottom: 2rem;">
            ${project.tech.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
        </div>
        
        <h3 style="color: var(--primary-color); margin-bottom: 1rem;">Key Features</h3>
        <ul style="color: var(--text-secondary); line-height: 1.8;">
            ${project.features.map(feature => `<li>${feature}</li>`).join('')}
        </ul>
        
        <div style="margin-top: 2rem; display: flex; gap: 1rem;">
            <button class="btn btn-primary" onclick="window.open('#', '_blank')">
                <i class="fas fa-external-link-alt"></i> Live Demo
            </button>
            <button class="btn btn-secondary" onclick="openGithub('${projectId}')">
                <i class="fab fa-github"></i> View Code
            </button>
        </div>
    `;
    
    modal.classList.add('show');
}

function openGithub(projectId) {
    // Replace with actual GitHub URLs
    const githubUrls = {
        'ecommerce': 'https://github.com/zian/ecommerce-platform',
        'taskmanager': 'https://github.com/zian/task-manager',
        'weather': 'https://github.com/zian/weather-app'
    };
    
    const url = githubUrls[projectId] || 'https://github.com/zian';
    window.open(url, '_blank');
}

function openFigma(projectId) {
    // Replace with actual Figma URLs
    window.open('https://figma.com/zian/banking-app', '_blank');
}

// Typing effect functionality
function initializeTypingEffect() {
    // Just prepare the element, actual typing will start from startTypingEffect
    const typingElement = document.getElementById('typingText');
    if (typingElement) {
        // Add a cursor for typing effect
        typingElement.style.borderRight = '2px solid var(--primary-color)';
        typingElement.style.animation = 'blink 1s infinite';
    }
}

function startTypingEffect() {
    const typingElement = document.getElementById('typingText');
    if (!typingElement) {
        console.log('Typing element not found');
        return;
    }
    
    console.log('Starting typing effect');
    
    const texts = ['Frontend Developer', 'UI/UX Enthusiast'];
    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    
    function typeEffect() {
        const currentText = texts[textIndex];
        
        if (isDeleting) {
            // Remove characters
            typingElement.textContent = currentText.substring(0, charIndex - 1);
            charIndex--;
        } else {
            // Add characters
            typingElement.textContent = currentText.substring(0, charIndex + 1);
            charIndex++;
        }
        
        // Calculate typing speed
        let typeSpeed = isDeleting ? 75 : 120;
        
        // If word is complete
        if (!isDeleting && charIndex === currentText.length) {
            // Pause at end
            typeSpeed = 2000;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            textIndex = (textIndex + 1) % texts.length;
            typeSpeed = 300;
        }
        
        setTimeout(typeEffect, typeSpeed);
    }
    
    // Clear the initial text and start typing
    typingElement.textContent = '';
    typeEffect();
}

// Download resume functionality
function downloadResume() {
    // Create a temporary link element
    const link = document.createElement('a');
    link.href = '#'; // Replace with actual resume URL
    link.download = 'Zian_Resume.pdf';
    link.click();
    
    showNotification('Resume download started!', 'success');
}

// Intersection Observer for animations
function initializeIntersectionObserver() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                
                // Trigger specific animations based on section
                const sectionId = entry.target.id;
                if (sectionId) {
                    triggerSectionAnimations(sectionId);
                }
            }
        });
    }, observerOptions);
    
    // Observe all sections
    document.querySelectorAll('.section').forEach(section => {
        observer.observe(section);
    });
}

// Section-specific animations
function triggerSectionAnimations(sectionId) {
    switch (sectionId) {
        case 'about':
            animateSkillBars();
            break;
        case 'education':
            animateTimeline();
            break;
        case 'works':
            animateProjects();
            break;
        case 'contact':
            animateContactForm();
            break;
    }
}

function animateTimeline() {
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    timelineItems.forEach((item, index) => {
        setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
        }, index * 200);
    });
}

function animateProjects() {
    const projectCards = document.querySelectorAll('.project-card');
    
    projectCards.forEach((card, index) => {
        setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 100);
    });
}

function animateContactForm() {
    const formElements = document.querySelectorAll('.contact-method, .form-group');
    
    formElements.forEach((element, index) => {
        setTimeout(() => {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }, index * 100);
    });
}

// Initialize animations
function initializeAnimations() {
    // Set initial states for animated elements
    const animatedElements = document.querySelectorAll('.timeline-item, .project-card, .contact-method, .form-group');
    
    animatedElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });
}

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    if (isLoading) return;
    
    const sections = ['home', 'about', 'education', 'works', 'contact'];
    const currentIndex = sections.indexOf(currentSection);
    
    switch (e.key) {
        case 'ArrowDown':
        case 'ArrowRight':
            e.preventDefault();
            if (currentIndex < sections.length - 1) {
                scrollToSection(sections[currentIndex + 1]);
            }
            break;
        case 'ArrowUp':
        case 'ArrowLeft':
            e.preventDefault();
            if (currentIndex > 0) {
                scrollToSection(sections[currentIndex - 1]);
            }
            break;
        case 'Home':
            e.preventDefault();
            scrollToSection('home');
            break;
        case 'End':
            e.preventDefault();
            scrollToSection('contact');
            break;
    }
});

// Smooth scroll behavior for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Performance optimization: Debounce scroll events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Window resize handler
window.addEventListener('resize', debounce(() => {
    // Reinitialize cursor on resize
    initializeCursor();
    
    // Handle floating elements on resize
    initializeFloatingElements();
    
    // Close mobile nav on resize
    if (window.innerWidth > 768) {
        const navToggle = document.querySelector('.nav-toggle');
        const navLinks = document.querySelector('.nav-links');
        const sidebar = document.querySelector('.profile-sidebar');
        const sidebarOverlay = document.querySelector('.sidebar-overlay');
        
        if (navToggle && navLinks) {
            navToggle.classList.remove('active');
            navLinks.classList.remove('open');
        }
        
        if (sidebar && sidebarOverlay) {
            sidebar.classList.remove('open');
            sidebarOverlay.classList.remove('show');
            document.body.style.overflow = 'auto';
        }
    }
}, 250));

// Page visibility API for performance
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Pause animations when page is not visible
        document.body.style.animationPlayState = 'paused';
    } else {
        // Resume animations when page becomes visible
        document.body.style.animationPlayState = 'running';
    }
});

// Touch and mobile optimizations
function initializeTouchOptimizations() {
    // Add touch-friendly classes
    document.body.classList.add('touch-optimized');
    
    // Prevent zoom on double tap for iOS
    let lastTouchEnd = 0;
    document.addEventListener('touchend', (e) => {
        const now = new Date().getTime();
        if (now - lastTouchEnd <= 300) {
            e.preventDefault();
        }
        lastTouchEnd = now;
    }, false);
    
    // Handle touch events for project cards
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach(card => {
        let touchStartTime = 0;
        
        card.addEventListener('touchstart', (e) => {
            touchStartTime = new Date().getTime();
        });
        
        card.addEventListener('touchend', (e) => {
            const touchEndTime = new Date().getTime();
            const touchDuration = touchEndTime - touchStartTime;
            
            // If touch duration is short (tap), trigger click
            if (touchDuration < 500) {
                e.preventDefault();
                const projectId = card.getAttribute('data-project-id') || 'ecommerce';
                viewProject(projectId);
            }
        });
    });
    
    // Smooth scrolling for mobile
    if ('scrollBehavior' in document.documentElement.style) {
        document.documentElement.style.scrollBehavior = 'smooth';
    }
    
    // Viewport height fix for mobile browsers
    function setViewportHeight() {
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    }
    
    setViewportHeight();
    window.addEventListener('resize', setViewportHeight);
    window.addEventListener('orientationchange', () => {
        setTimeout(setViewportHeight, 100);
    });
}

// Add CSS animations and mobile styles
const style = document.createElement('style');
style.textContent = `
    :root {
        --vh: 1vh;
    }
    
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .animate-in {
        animation: fadeInUp 0.6s ease forwards;
    }
    
    .notification {
        animation: slideInRight 0.3s ease forwards;
    }
    
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
        }
        to {
            transform: translateX(0);
        }
    }
    
    /* Mobile-specific styles */
    @media (max-width: 768px) {
        .section {
            min-height: calc(var(--vh, 1vh) * 100);
        }
        
        /* Larger touch targets */
        .btn, .nav-link, .filter-btn, .action-btn {
            min-height: 44px;
            min-width: 44px;
        }
        
        /* Better spacing for touch */
        .nav-link {
            padding: 1rem;
            margin: 0.5rem 0;
        }
        
        /* Improved form inputs for mobile */
        .form-group input,
        .form-group textarea {
            font-size: 16px; /* Prevent zoom on iOS */
        }
        
        /* Touch-friendly project cards */
        .project-card {
            cursor: pointer;
            -webkit-tap-highlight-color: rgba(0, 212, 255, 0.2);
        }
        
        /* Remove hover effects on touch devices */
        @media (hover: none) {
            .project-card:hover,
            .highlight-item:hover,
            .contact-method:hover,
            .cert-item:hover {
                transform: none;
                box-shadow: none;
            }
        }
    }
`;

document.head.appendChild(style);

// Initialize everything when page loads
window.addEventListener('load', () => {
    // Additional load-specific initialization
    console.log('Portfolio loaded successfully!');
});
