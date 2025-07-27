// Mobile navigation functionality
class MobileNavigation {
    constructor() {
        this.hamburger = document.querySelector('.hamburger');
        this.navMenu = document.querySelector('.nav-menu');
        this.navLinks = document.querySelectorAll('.nav-link');
        this.isOpen = false;
        
        this.init();
    }
    
    init() {
        if (this.hamburger && this.navMenu) {
            this.hamburger.addEventListener('click', () => this.toggleMenu());
            
            // Close menu when clicking on nav links
            this.navLinks.forEach(link => {
                link.addEventListener('click', () => this.closeMenu());
            });
            
            // Close menu when clicking outside
            document.addEventListener('click', (e) => {
                if (!e.target.closest('.nav') && this.isOpen) {
                    this.closeMenu();
                }
            });
            
            // Handle window resize
            window.addEventListener('resize', () => {
                if (window.innerWidth > 768 && this.isOpen) {
                    this.closeMenu();
                }
            });
        }
    }
    
    toggleMenu() {
        this.isOpen = !this.isOpen;
        this.hamburger.classList.toggle('active');
        this.navMenu.classList.toggle('active');
        
        // Prevent body scroll when menu is open
        document.body.style.overflow = this.isOpen ? 'hidden' : '';
    }
    
    closeMenu() {
        this.isOpen = false;
        this.hamburger.classList.remove('active');
        this.navMenu.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// Active navigation highlighting
class NavigationHighlighter {
    constructor() {
        this.navLinks = document.querySelectorAll('.nav-link');
        this.currentPage = window.location.pathname.split('/').pop() || 'index.html';
        
        this.init();
    }
    
    init() {
        this.highlightCurrentPage();
        this.setupScrollSpy();
    }
    
    highlightCurrentPage() {
        this.navLinks.forEach(link => {
            const href = link.getAttribute('href');
            link.classList.remove('active');
            
            if (href === this.currentPage || 
                (this.currentPage === '' && href === 'index.html') ||
                (this.currentPage === '/' && href === 'index.html')) {
                link.classList.add('active');
            }
        });
    }
    
    setupScrollSpy() {
        // Only setup scroll spy on single page with sections
        if (this.currentPage === 'index.html' || this.currentPage === '') {
            const sections = document.querySelectorAll('section[id]');
            
            if (sections.length > 0) {
                const observer = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            const id = entry.target.getAttribute('id');
                            this.updateActiveLink(id);
                        }
                    });
                }, {
                    threshold: 0.3,
                    rootMargin: '-100px 0px -100px 0px'
                });
                
                sections.forEach(section => observer.observe(section));
            }
        }
    }
    
    updateActiveLink(sectionId) {
        this.navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${sectionId}`) {
                link.classList.add('active');
            }
        });
    }
}

// Breadcrumb navigation
class BreadcrumbNavigation {
    constructor() {
        this.breadcrumbContainer = document.querySelector('.breadcrumb');
        this.currentPage = window.location.pathname.split('/').pop() || 'index.html';
        
        if (this.breadcrumbContainer) {
            this.init();
        }
    }
    
    init() {
        this.generateBreadcrumb();
    }
    
    generateBreadcrumb() {
        const pageMap = {
            'index.html': 'Home',
            'about.html': 'About',
            'courses.html': 'Courses',
            'placements.html': 'Placements',
            'students.html': 'Students',
            'contact.html': 'Contact'
        };
        
        const breadcrumbHTML = `
            <div class="container">
                <nav class="breadcrumb-nav">
                    <a href="index.html">Home</a>
                    ${this.currentPage !== 'index.html' ? `<span>/</span><span>${pageMap[this.currentPage] || 'Page'}</span>` : ''}
                </nav>
            </div>
        `;
        
        this.breadcrumbContainer.innerHTML = breadcrumbHTML;
    }
}

// Navigation search functionality
class NavigationSearch {
    constructor() {
        this.searchInput = document.querySelector('.nav-search input');
        this.searchResults = document.querySelector('.search-results');
        this.searchData = this.buildSearchIndex();
        
        if (this.searchInput) {
            this.init();
        }
    }
    
    init() {
        this.searchInput.addEventListener('input', (e) => {
            this.handleSearch(e.target.value);
        });
        
        // Close search results when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.nav-search')) {
                this.hideResults();
            }
        });
    }
    
    buildSearchIndex() {
        return [
            { title: 'Home', url: 'index.html', keywords: 'home main landing' },
            { title: 'About Us', url: 'about.html', keywords: 'about history mission vision leadership' },
            { title: 'Courses', url: 'courses.html', keywords: 'courses programs education engineering business science' },
            { title: 'Placements', url: 'placements.html', keywords: 'placements jobs careers recruitment companies' },
            { title: 'Students', url: 'students.html', keywords: 'students life campus testimonials clubs activities' },
            { title: 'Contact', url: 'contact.html', keywords: 'contact address phone email location' }
        ];
    }
    
    handleSearch(query) {
        if (query.length < 2) {
            this.hideResults();
            return;
        }
        
        const results = this.searchData.filter(item => 
            item.title.toLowerCase().includes(query.toLowerCase()) ||
            item.keywords.toLowerCase().includes(query.toLowerCase())
        );
        
        this.showResults(results);
    }
    
    showResults(results) {
        if (!this.searchResults) return;
        
        if (results.length === 0) {
            this.searchResults.innerHTML = '<div class="no-results">No results found</div>';
        } else {
            const resultsHTML = results.map(result => 
                `<a href="${result.url}" class="search-result-item">${result.title}</a>`
            ).join('');
            
            this.searchResults.innerHTML = resultsHTML;
        }
        
        this.searchResults.style.display = 'block';
    }
    
    hideResults() {
        if (this.searchResults) {
            this.searchResults.style.display = 'none';
        }
    }
}

// Navigation accessibility
class NavigationAccessibility {
    constructor() {
        this.init();
    }
    
    init() {
        this.setupKeyboardNavigation();
        this.setupAriaLabels();
        this.setupFocusManagement();
    }
    
    setupKeyboardNavigation() {
        const navLinks = document.querySelectorAll('.nav-link');
        
        navLinks.forEach((link, index) => {
            link.addEventListener('keydown', (e) => {
                switch(e.key) {
                    case 'ArrowRight':
                        e.preventDefault();
                        const nextLink = navLinks[index + 1] || navLinks[0];
                        nextLink.focus();
                        break;
                    case 'ArrowLeft':
                        e.preventDefault();
                        const prevLink = navLinks[index - 1] || navLinks[navLinks.length - 1];
                        prevLink.focus();
                        break;
                    case 'Escape':
                        link.blur();
                        break;
                }
            });
        });
    }
    
    setupAriaLabels() {
        const hamburger = document.querySelector('.hamburger');
        if (hamburger) {
            hamburger.setAttribute('aria-label', 'Toggle navigation menu');
            hamburger.setAttribute('aria-expanded', 'false');
            
            hamburger.addEventListener('click', () => {
                const isExpanded = hamburger.getAttribute('aria-expanded') === 'true';
                hamburger.setAttribute('aria-expanded', !isExpanded);
            });
        }
    }
    
    setupFocusManagement() {
        // Skip to main content link
        const skipLink = document.createElement('a');
        skipLink.href = '#main';
        skipLink.textContent = 'Skip to main content';
        skipLink.className = 'skip-link';
        skipLink.style.cssText = `
            position: absolute;
            top: -40px;
            left: 6px;
            background: var(--primary-color);
            color: white;
            padding: 8px;
            text-decoration: none;
            border-radius: 4px;
            z-index: 10000;
            transition: top 0.3s;
        `;
        
        skipLink.addEventListener('focus', () => {
            skipLink.style.top = '6px';
        });
        
        skipLink.addEventListener('blur', () => {
            skipLink.style.top = '-40px';
        });
        
        document.body.insertBefore(skipLink, document.body.firstChild);
        
        // Add main landmark if it doesn't exist
        const main = document.querySelector('main');
        if (main && !main.id) {
            main.id = 'main';
        }
    }
}

// Initialize navigation functionality
document.addEventListener('DOMContentLoaded', function() {
    new MobileNavigation();
    new NavigationHighlighter();
    new BreadcrumbNavigation();
    new NavigationSearch();
    new NavigationAccessibility();
});

// Handle navigation state on page load
window.addEventListener('load', function() {
    // Remove any loading states
    const nav = document.querySelector('.nav');
    if (nav) {
        nav.classList.add('loaded');
    }
});

// Handle navigation during page transitions
window.addEventListener('beforeunload', function() {
    // Add loading state for page transitions
    const nav = document.querySelector('.nav');
    if (nav) {
        nav.classList.add('loading');
    }
});

// Export for use in other scripts if needed
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        MobileNavigation,
        NavigationHighlighter,
        BreadcrumbNavigation,
        NavigationSearch,
        NavigationAccessibility
    };
}