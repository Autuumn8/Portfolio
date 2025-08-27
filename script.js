// Global variables
let currentSection = 'home';
let isLoading = true;
let animationsInitialized = false;
let sidebarOpen = false;
let touchStartX = 0;
let touchStartY = 0;
let touchStartTime = 0;
let isDragging = false;
let startSwipeX = 0;

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
    initializeSwipeGesture();
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
        }, 500);
    }, 1000);
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

// Sidebar functionality for mobile (Updated)
function initializeSidebar() {
    // Remove old sidebar toggle if it exists
    const existingSidebarToggle = document.querySelector('.sidebar-toggle');
    if (existingSidebarToggle) {
        existingSidebarToggle.remove();
    }
    
    // Create sidebar overlay
    let sidebarOverlay = document.querySelector('.sidebar-overlay');
    if (!sidebarOverlay) {
        sidebarOverlay = document.createElement('div');
        sidebarOverlay.className = 'sidebar-overlay';
        document.body.appendChild(sidebarOverlay);
    }
    
    const sidebar = document.querySelector('.profile-sidebar');
    
    if (sidebar) {
        // Close sidebar when clicking overlay
        sidebarOverlay.addEventListener('click', () => {
            closeSidebar();
        });
        
        // Close sidebar on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && sidebarOpen) {
                closeSidebar();
            }
        });
    }
}

// New swipe gesture functionality
function initializeSwipeGesture() {
    const swipeIndicator = document.querySelector('.swipe-indicator');
    const sidebar = document.querySelector('.profile-sidebar');
    const sidebarOverlay = document.querySelector('.sidebar-overlay');
    
    if (!swipeIndicator || !sidebar) return;
    
    let isSwipeActive = false;
    let swipeStartX = 0;
    let swipeCurrentX = 0;
    let swipeProgress = 0;
    
    // Touch events for swipe gesture
    document.addEventListener('touchstart', handleTouchStart, { passive: true });
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleTouchEnd, { passive: true });
    
    // Swipe indicator click event
    swipeIndicator.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!sidebarOpen) {
            openSidebar();
        }
    });
    
    function handleTouchStart(e) {
        if (window.innerWidth > 768) return; // Only on mobile
        
        const touch = e.touches[0];
        touchStartX = touch.clientX;
        touchStartY = touch.clientY;
        touchStartTime = Date.now();
        
        // Check if touch started from the left edge (within 30px)
        if (touchStartX <= 30 && !sidebarOpen) {
            isSwipeActive = true;
            swipeStartX = touchStartX;
            swipeIndicator.classList.add('active');
            
            // Add haptic feedback simulation
            if (navigator.vibrate) {
                navigator.vibrate(10);
            }
        }
        
        // If sidebar is open and touch started outside sidebar
        if (sidebarOpen && !sidebar.contains(e.target) && !swipeIndicator.contains(e.target)) {
            isSwipeActive = true;
            swipeStartX = touchStartX;
        }
    }
    
    function handleTouchMove(e) {
        if (!isSwipeActive || window.innerWidth > 768) return;
        
        const touch = e.touches[0];
        swipeCurrentX = touch.clientX;
        const deltaX = swipeCurrentX - swipeStartX;
        const deltaY = Math.abs(touch.clientY - touchStartY);
        
        // Check if it's a horizontal swipe (not vertical scroll)
        if (deltaY > 50) {
            isSwipeActive = false;
            swipeIndicator.classList.remove('active');
            return;
        }
        
        e.preventDefault(); // Prevent scrolling during swipe
        
        if (!sidebarOpen && deltaX > 0) {
            // Opening swipe (left to right)
            swipeProgress = Math.min(deltaX / 200, 1); // 200px to fully open
            
            if (swipeProgress > 0.1) {
                sidebar.style.transform = `translateX(${-100 + (swipeProgress * 100)}%)`;
                sidebarOverlay.style.opacity = swipeProgress * 0.5;
                sidebarOverlay.classList.add('show');
                
                // Update swipe indicator
                swipeIndicator.classList.add('swiping');
                swipeIndicator.style.transform = `translateX(${deltaX}px)`;
            }
        } else if (sidebarOpen && deltaX < 0) {
            // Closing swipe (right to left)
            swipeProgress = Math.max(1 + (deltaX / 200), 0);
            
            sidebar.style.transform = `translateX(${-100 + (swipeProgress * 100)}%)`;
            sidebarOverlay.style.opacity = swipeProgress * 0.5;
        }
    }
    
    function handleTouchEnd(e) {
        if (!isSwipeActive || window.innerWidth > 768) return;
        
        const touchEndTime = Date.now();
        const touchDuration = touchEndTime - touchStartTime;
        const deltaX = swipeCurrentX - swipeStartX;
        const swipeVelocity = Math.abs(deltaX) / touchDuration;
        
        isSwipeActive = false;
        swipeIndicator.classList.remove('active', 'swiping');
        swipeIndicator.style.transform = '';
        
        // Determine if we should open or close the sidebar
        if (!sidebarOpen) {
            if (swipeProgress > 0.3 || (swipeVelocity > 0.5 && deltaX > 50)) {
                openSidebar();
            } else {
                // Reset sidebar position
                sidebar.style.transform = '';
                sidebarOverlay.classList.remove('show');
                sidebarOverlay.style.opacity = '';
            }
        } else {
            if (swipeProgress < 0.7 || (swipeVelocity > 0.5 && deltaX < -50)) {
                closeSidebar();
            } else {
                // Keep sidebar open
                sidebar.style.transform = '';
                sidebarOverlay.style.opacity = '';
            }
        }
        
        // Reset variables
        swipeProgress = 0;
        swipeCurrentX = 0;
        swipeStartX = 0;
    }
}

function openSidebar() {
    const sidebar = document.querySelector('.profile-sidebar');
    const sidebarOverlay = document.querySelector('.sidebar-overlay');
    const swipeIndicator = document.querySelector('.swipe-indicator');
    
    if (sidebar && sidebarOverlay) {
        sidebar.classList.add('open');
        sidebarOverlay.classList.add('show');
        swipeIndicator.classList.add('hidden');
        document.body.style.overflow = 'hidden';
        sidebarOpen = true;
        
        // Reset any transform styles
        sidebar.style.transform = '';
        sidebarOverlay.style.opacity = '';
        
        // Haptic feedback
        if (navigator.vibrate) {
            navigator.vibrate(20);
        }
    }
}

function closeSidebar() {
    const sidebar = document.querySelector('.profile-sidebar');
    const sidebarOverlay = document.querySelector('.sidebar-overlay');
    const swipeIndicator = document.querySelector('.swipe-indicator');
    
    if (sidebar && sidebarOverlay) {
        sidebar.classList.remove('open');
        sidebarOverlay.classList.remove('show');
        swipeIndicator.classList.remove('hidden');
        document.body.style.overflow = 'auto';
        sidebarOpen = false;
        
        // Reset any transform styles
        sidebar.style.transform = '';
        sidebarOverlay.style.opacity = '';
        
        // Haptic feedback
        if (navigator.vibrate) {
            navigator.vibrate(10);
        }
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
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    // Hide notification after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
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
            
            // Filter project cards
            projectCards.forEach(card => {
                const category = card.getAttribute('data-category');
                
                if (filter === 'all' || category === filter) {
                    card.style.display = 'block';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 100);
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

// Modal functionality (placeholder)
function initializeModal() {
    // Modal functionality for project details
    const projectCards = document.querySelectorAll('.project-card');
    
    projectCards.forEach(card => {
        card.addEventListener('click', () => {
            // Add project modal functionality here
            console.log('Project card clicked');
        });
    });
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
                
                // Trigger specific animations for different elements
                if (entry.target.classList.contains('skill-item')) {
                    animateSkillBars();
                }
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    document.querySelectorAll('.skill-item, .project-card, .education-item').forEach(el => {
        observer.observe(el);
    });
}

// Touch optimizations
function initializeTouchOptimizations() {
    // Prevent zoom on double tap
    let lastTouchEnd = 0;
    document.addEventListener('touchend', function (event) {
        const now = (new Date()).getTime();
        if (now - lastTouchEnd <= 300) {
            event.preventDefault();
        }
        lastTouchEnd = now;
    }, false);
    
    // Improve touch responsiveness
    document.addEventListener('touchstart', function() {}, { passive: true });
}

// Typing effect
function initializeTypingEffect() {
    // This will be called after loader is hidden
}

function startTypingEffect() {
    const typingElement = document.getElementById('typingText');
    if (!typingElement) return;
    
    const texts = [
        'Frontend Developer',
        'UI/UX Designer',
    ];
    
    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    
    function typeText() {
        const currentText = texts[textIndex];
        
        if (isDeleting) {
            typingElement.textContent = currentText.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typingElement.textContent = currentText.substring(0, charIndex + 1);
            charIndex++;
        }
        
        let typeSpeed = 100;
        
        if (isDeleting) {
            typeSpeed /= 2;
        }
        
        if (!isDeleting && charIndex === currentText.length) {
            typeSpeed = 2000;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            textIndex = (textIndex + 1) % texts.length;
            typeSpeed = 500;
        }
        
        setTimeout(typeText, typeSpeed);
    }
    
    typeText();
}

// Section-specific animations
function triggerSectionAnimations(sectionId) {
    if (sectionId === 'about') {
        setTimeout(() => {
            animateSkillBars();
        }, 500);
    }
}

// General animations initialization
function initializeAnimations() {
    console.log('Animations initialized');
    
    // Add any general animations here
    const animatedElements = document.querySelectorAll('.animate-in');
    animatedElements.forEach(el => {
        el.classList.add('animate-in');
    });
}

// Project functionality placeholders
function viewProject(projectId) {
    console.log('Viewing project:', projectId);
    // Add project viewing logic here
}

function openGithub(projectId) {
    console.log('Opening GitHub for project:', projectId);
    // Add GitHub link logic here
}

function openFigma(projectId) {
    console.log('Opening Figma for project:', projectId);
    // Add Figma link logic here
}

function downloadResume() {
    console.log('Downloading resume...');
    // Add resume download logic here
}

// Handle resize events
window.addEventListener('resize', () => {
    // Reinitialize floating elements if needed
    if (window.innerWidth > 768) {
        initializeFloatingElements();
    }
    
    // Close sidebar on desktop
    if (window.innerWidth > 768 && sidebarOpen) {
        closeSidebar();
    }
});
