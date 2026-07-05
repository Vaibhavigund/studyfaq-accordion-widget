/* ===================================
   StudyFAQ - JavaScript Functionality
   Student Learning Help Center
   =================================== */

// ===================================
// 1. GLOBAL STATE & VARIABLES
// ===================================

const state = {
    currentCategory: 'all',
    darkMode: false,
    lastOpenedFAQ: null
};

// DOM Elements
const elements = {
    // Navigation
    navLinks: document.querySelectorAll('.nav-links a'),
    mobileMenuToggle: document.getElementById('mobileMenuToggle'),
    
    // Theme Toggle
    themeToggle: document.getElementById('themeToggle'),
    
    // Category Filters
    categoryButtons: document.querySelectorAll('.category-btn'),
    
    // FAQ Controls
    expandAllBtn: document.getElementById('expandAll'),
    collapseAllBtn: document.getElementById('collapseAll'),
    
    // FAQ Cards
    faqCards: document.querySelectorAll('.faq-card'),
    faqContainer: document.getElementById('faqContainer'),
    emptyState: document.getElementById('emptyState'),
    
    // Scroll to Top
    scrollTopBtn: document.getElementById('scrollTop')
};

// ===================================
// 2. INITIALIZATION
// ===================================

document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});

function initializeApp() {
    // Load saved preferences
    loadDarkMode();
    loadLastOpenedFAQ();
    
    // Initialize event listeners
    initFAQAccordion();
    initCategoryFilter();
    initExpandCollapse();
    initDarkMode();
    initSmoothScrolling();
    initScrollToTop();
    initKeyboardAccessibility();
    
    console.log('✅ StudyFAQ initialized successfully!');
}

// ===================================
// 3. FAQ ACCORDION FUNCTIONALITY
// ===================================

function initFAQAccordion() {
    elements.faqCards.forEach(card => {
        const question = card.querySelector('.faq-question');
        const toggle = card.querySelector('.faq-toggle');
        
        // Click handler
        question.addEventListener('click', () => {
            toggleFAQ(card);
        });
        
        // Keyboard handler for toggle button
        toggle.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleFAQ(card);
            }
        });
    });
}

function toggleFAQ(card) {
    const isActive = card.classList.contains('active');
    
    if (isActive) {
        // Close this FAQ
        closeFAQ(card);
        state.lastOpenedFAQ = null;
        localStorage.removeItem('lastOpenedFAQ');
    } else {
        // Close all other FAQs (accordion behavior - only one open at a time)
        elements.faqCards.forEach(otherCard => {
            if (otherCard !== card && otherCard.classList.contains('active')) {
                closeFAQ(otherCard);
            }
        });
        
        // Open this FAQ
        openFAQ(card);
        
        // Save to localStorage
        const questionText = card.querySelector('.faq-header h3').textContent;
        state.lastOpenedFAQ = questionText;
        localStorage.setItem('lastOpenedFAQ', questionText);
    }
}

function openFAQ(card) {
    const answer = card.querySelector('.faq-answer');
    const toggle = card.querySelector('.faq-toggle');
    
    // Add active class
    card.classList.add('active');
    
    // Update ARIA
    toggle.setAttribute('aria-expanded', 'true');
    
    // Smooth height animation
    answer.style.maxHeight = answer.scrollHeight + 'px';
}

function closeFAQ(card) {
    const answer = card.querySelector('.faq-answer');
    const toggle = card.querySelector('.faq-toggle');
    
    // Remove active class
    card.classList.remove('active');
    
    // Update ARIA
    toggle.setAttribute('aria-expanded', 'false');
    
    // Smooth height animation
    answer.style.maxHeight = '0';
}

// ===================================
// 4. CATEGORY FILTER FUNCTIONALITY
// ===================================

function initCategoryFilter() {
    elements.categoryButtons.forEach(button => {
        button.addEventListener('click', () => {
            const category = button.getAttribute('data-category');
            setActiveCategory(category);
        });
    });
}

function setActiveCategory(category) {
    state.currentCategory = category;
    
    // Update active button
    elements.categoryButtons.forEach(button => {
        if (button.getAttribute('data-category') === category) {
            button.classList.add('active');
        } else {
            button.classList.remove('active');
        }
    });
    
    // Filter FAQs by category only
    filterFAQs();
}

function filterFAQs() {
    let visibleCount = 0;
    
    elements.faqCards.forEach(card => {
        const category = card.getAttribute('data-category');
        
        // Check if matches category filter
        const matchesCategory = state.currentCategory === 'all' || category === state.currentCategory;
        
        // Show or hide card
        if (matchesCategory) {
            card.style.display = 'block';
            visibleCount++;
        } else {
            card.style.display = 'none';
        }
    });
    
    // Show/hide empty state
    if (visibleCount === 0) {
        elements.emptyState.style.display = 'block';
        elements.faqContainer.style.display = 'none';
    } else {
        elements.emptyState.style.display = 'none';
        elements.faqContainer.style.display = 'flex';
    }
}

// ===================================
// 5. EXPAND ALL / COLLAPSE ALL
// ===================================

function initExpandCollapse() {
    elements.expandAllBtn.addEventListener('click', expandAllFAQs);
    elements.collapseAllBtn.addEventListener('click', collapseAllFAQs);
}

function expandAllFAQs() {
    elements.faqCards.forEach(card => {
        if (card.style.display !== 'none') {
            openFAQ(card);
        }
    });
}

function collapseAllFAQs() {
    elements.faqCards.forEach(card => {
        closeFAQ(card);
    });
    
    // Clear saved FAQ
    state.lastOpenedFAQ = null;
    localStorage.removeItem('lastOpenedFAQ');
}

// ===================================
// 6. DARK MODE FUNCTIONALITY
// ===================================

function initDarkMode() {
    elements.themeToggle.addEventListener('click', toggleDarkMode);
}

function toggleDarkMode() {
    state.darkMode = !state.darkMode;
    applyDarkMode();
    saveDarkMode();
}

function applyDarkMode() {
    if (state.darkMode) {
        document.body.classList.add('dark-mode');
        elements.themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    } else {
        document.body.classList.remove('dark-mode');
        elements.themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    }
}

function saveDarkMode() {
    localStorage.setItem('darkMode', state.darkMode ? 'enabled' : 'disabled');
}

function loadDarkMode() {
    const savedMode = localStorage.getItem('darkMode');
    state.darkMode = savedMode === 'enabled';
    applyDarkMode();
}

// ===================================
// 7. REMEMBER LAST OPENED FAQ
// ===================================

function loadLastOpenedFAQ() {
    const savedFAQ = localStorage.getItem('lastOpenedFAQ');
    
    if (savedFAQ) {
        // Find and open the saved FAQ
        elements.faqCards.forEach(card => {
            const questionText = card.querySelector('.faq-header h3').textContent;
            if (questionText === savedFAQ) {
                // Small delay to ensure smooth animation
                setTimeout(() => {
                    openFAQ(card);
                    // Scroll to the FAQ
                    card.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }, 500);
            }
        });
    }
}

// ===================================
// 8. SMOOTH SCROLLING & ACTIVE NAV
// ===================================

function initSmoothScrolling() {
    // Navigation link smooth scrolling
    elements.navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Update active link
                updateActiveNavLink(link);
            }
        });
    });
    
    // Update active nav on scroll
    window.addEventListener('scroll', throttle(updateNavOnScroll, 100));
}

function updateActiveNavLink(activeLink) {
    elements.navLinks.forEach(link => {
        link.classList.remove('active');
    });
    activeLink.classList.add('active');
}

function updateNavOnScroll() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPosition = window.scrollY + 100;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            elements.navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

// ===================================
// 9. SCROLL TO TOP BUTTON
// ===================================

function initScrollToTop() {
    window.addEventListener('scroll', throttle(toggleScrollTopButton, 100));
    
    elements.scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

function toggleScrollTopButton() {
    if (window.scrollY > 300) {
        elements.scrollTopBtn.classList.add('visible');
    } else {
        elements.scrollTopBtn.classList.remove('visible');
    }
}

// ===================================
// 10. KEYBOARD ACCESSIBILITY
// ===================================

function initKeyboardAccessibility() {
    // FAQ Cards - Enter/Space to toggle
    elements.faqCards.forEach(card => {
        const question = card.querySelector('.faq-question');
        
        question.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleFAQ(card);
            }
        });
        
        // Make question focusable
        question.setAttribute('tabindex', '0');
        question.setAttribute('role', 'button');
    });
    
    // Category Buttons - Enter/Space to activate
    elements.categoryButtons.forEach(button => {
        button.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                button.click();
            }
        });
    });
    
    // Expand/Collapse Buttons
    [elements.expandAllBtn, elements.collapseAllBtn].forEach(button => {
        button.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                button.click();
            }
        });
    });
    
    // Escape key to close all FAQs
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            collapseAllFAQs();
        }
    });
}

// ===================================
// 11. UTILITY FUNCTIONS
// ===================================

// Throttle function for performance
function throttle(func, wait) {
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

// ===================================
// 12. MOBILE MENU
// ===================================

if (elements.mobileMenuToggle) {
    elements.mobileMenuToggle.addEventListener('click', () => {
        const navLinks = document.querySelector('.nav-links');
        navLinks.classList.toggle('mobile-active');
        
        // Toggle icon
        const icon = elements.mobileMenuToggle.querySelector('i');
        if (navLinks.classList.contains('mobile-active')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
        } else {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });
    
    // Close menu when clicking a link
    elements.navLinks.forEach(link => {
        link.addEventListener('click', () => {
            const navLinks = document.querySelector('.nav-links');
            navLinks.classList.remove('mobile-active');
            const icon = elements.mobileMenuToggle.querySelector('i');
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        });
    });
}

// ===================================
// 13. PERFORMANCE MONITORING
// ===================================

window.addEventListener('load', () => {
    const perfData = window.performance.timing;
    const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
    console.log(`📊 Page Load Time: ${pageLoadTime}ms`);
});

// ===================================
// 14. ERROR HANDLING
// ===================================

window.addEventListener('error', (e) => {
    console.error('❌ JavaScript Error:', e.message);
});

// ===================================
// END OF MAIN.JS
// ===================================

console.log('✨ StudyFAQ JavaScript loaded successfully!');