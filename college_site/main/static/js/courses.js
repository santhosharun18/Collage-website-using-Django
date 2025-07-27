// Course filtering functionality
class CourseFilter {
    constructor() {
        this.filterButtons = document.querySelectorAll('.filter-btn');
        this.courseCards = document.querySelectorAll('.course-card');
        this.currentFilter = 'all';
        
        this.init();
    }
    
    init() {
        this.setupFilterButtons();
        this.setupSearch();
        this.setupSorting();
    }
    
    setupFilterButtons() {
        this.filterButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const filter = button.getAttribute('data-filter');
                this.applyFilter(filter);
                this.updateActiveButton(button);
            });
        });
    }
    
    applyFilter(filter) {
        this.currentFilter = filter;
        
        this.courseCards.forEach(card => {
            const category = card.getAttribute('data-category');
            
            if (filter === 'all' || category === filter) {
                this.showCard(card);
            } else {
                this.hideCard(card);
            }
        });
        
        this.updateResultsCount();
    }
    
    showCard(card) {
        card.style.display = 'block';
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, 100);
    }
    
    hideCard(card) {
        card.style.opacity = '0';
        card.style.transform = 'translateY(-20px)';
        
        setTimeout(() => {
            card.style.display = 'none';
        }, 300);
    }
    
    updateActiveButton(activeButton) {
        this.filterButtons.forEach(button => {
            button.classList.remove('active');
        });
        activeButton.classList.add('active');
    }
    
    updateResultsCount() {
        const visibleCards = Array.from(this.courseCards).filter(card => 
            card.style.display !== 'none'
        );
        
        // Create or update results counter
        let counter = document.querySelector('.results-counter');
        if (!counter) {
            counter = document.createElement('div');
            counter.className = 'results-counter';
            counter.style.cssText = `
                text-align: center;
                margin: 20px 0;
                color: var(--gray-600);
                font-weight: 500;
            `;
            
            const container = document.querySelector('.courses-container');
            container.parentNode.insertBefore(counter, container);
        }
        
        const filterText = this.currentFilter === 'all' ? 'All Courses' : 
                          this.currentFilter.charAt(0).toUpperCase() + this.currentFilter.slice(1);
        counter.textContent = `Showing ${visibleCards.length} ${filterText}`;
    }
    
    setupSearch() {
        // Create search input if it doesn't exist
        let searchContainer = document.querySelector('.course-search');
        if (!searchContainer) {
            searchContainer = document.createElement('div');
            searchContainer.className = 'course-search';
            searchContainer.style.cssText = `
                max-width: 400px;
                margin: 0 auto 30px auto;
                position: relative;
            `;
            
            const searchInput = document.createElement('input');
            searchInput.type = 'text';
            searchInput.placeholder = 'Search courses...';
            searchInput.style.cssText = `
                width: 100%;
                padding: 12px 16px 12px 40px;
                border: 2px solid var(--gray-200);
                border-radius: var(--border-radius);
                font-size: 1rem;
                transition: var(--transition);
            `;
            
            const searchIcon = document.createElement('i');
            searchIcon.className = 'fas fa-search';
            searchIcon.style.cssText = `
                position: absolute;
                left: 12px;
                top: 50%;
                transform: translateY(-50%);
                color: var(--gray-400);
            `;
            
            searchContainer.appendChild(searchIcon);
            searchContainer.appendChild(searchInput);
            
            const filtersContainer = document.querySelector('.category-filters');
            filtersContainer.parentNode.insertBefore(searchContainer, filtersContainer.nextSibling);
            
            // Setup search functionality
            searchInput.addEventListener('input', (e) => {
                this.handleSearch(e.target.value);
            });
            
            searchInput.addEventListener('focus', () => {
                searchInput.style.borderColor = 'var(--primary-color)';
                searchInput.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
            });
            
            searchInput.addEventListener('blur', () => {
                searchInput.style.borderColor = 'var(--gray-200)';
                searchInput.style.boxShadow = 'none';
            });
        }
    }
    
    handleSearch(query) {
        const searchTerm = query.toLowerCase().trim();
        
        this.courseCards.forEach(card => {
            const title = card.querySelector('h3').textContent.toLowerCase();
            const description = card.querySelector('p').textContent.toLowerCase();
            const category = card.getAttribute('data-category').toLowerCase();
            
            const matches = title.includes(searchTerm) || 
                          description.includes(searchTerm) || 
                          category.includes(searchTerm);
            
            if (searchTerm === '' || matches) {
                // Apply current filter
                if (this.currentFilter === 'all' || card.getAttribute('data-category') === this.currentFilter) {
                    this.showCard(card);
                }
            } else {
                this.hideCard(card);
            }
        });
        
        this.updateResultsCount();
    }
    
    setupSorting() {
        // Create sort dropdown
        const sortContainer = document.createElement('div');
        sortContainer.className = 'course-sort';
        sortContainer.style.cssText = `
            display: flex;
            align-items: center;
            gap: 10px;
            margin-bottom: 20px;
            justify-content: flex-end;
        `;
        
        const sortLabel = document.createElement('label');
        sortLabel.textContent = 'Sort by:';
        sortLabel.style.cssText = `
            font-weight: 500;
            color: var(--gray-700);
        `;
        
        const sortSelect = document.createElement('select');
        sortSelect.style.cssText = `
            padding: 8px 12px;
            border: 2px solid var(--gray-200);
            border-radius: var(--border-radius);
            background: white;
            cursor: pointer;
        `;
        
        sortSelect.innerHTML = `
            <option value="default">Default</option>
            <option value="name">Name (A-Z)</option>
            <option value="name-desc">Name (Z-A)</option>
            <option value="duration">Duration</option>
            <option value="price">Price (Low to High)</option>
            <option value="price-desc">Price (High to Low)</option>
        `;
        
        sortContainer.appendChild(sortLabel);
        sortContainer.appendChild(sortSelect);
        
        const coursesContainer = document.querySelector('.courses-container');
        coursesContainer.parentNode.insertBefore(sortContainer, coursesContainer);
        
        // Setup sort functionality
        sortSelect.addEventListener('change', (e) => {
            this.sortCourses(e.target.value);
        });
    }
    
    sortCourses(sortBy) {
        const container = document.querySelector('.courses-container');
        const cards = Array.from(this.courseCards);
        
        cards.sort((a, b) => {
            switch(sortBy) {
                case 'name':
                    return a.querySelector('h3').textContent.localeCompare(b.querySelector('h3').textContent);
                case 'name-desc':
                    return b.querySelector('h3').textContent.localeCompare(a.querySelector('h3').textContent);
                case 'duration':
                    const aDuration = parseInt(a.querySelector('.course-details span').textContent);
                    const bDuration = parseInt(b.querySelector('.course-details span').textContent);
                    return aDuration - bDuration;
                case 'price':
                    const aPrice = parseInt(a.querySelector('.course-details span:last-child').textContent.replace(/\D/g, ''));
                    const bPrice = parseInt(b.querySelector('.course-details span:last-child').textContent.replace(/\D/g, ''));
                    return aPrice - bPrice;
                case 'price-desc':
                    const aPriceDesc = parseInt(a.querySelector('.course-details span:last-child').textContent.replace(/\D/g, ''));
                    const bPriceDesc = parseInt(b.querySelector('.course-details span:last-child').textContent.replace(/\D/g, ''));
                    return bPriceDesc - aPriceDesc;
                default:
                    return 0;
            }
        });
        
        // Re-append sorted cards
        cards.forEach(card => {
            container.appendChild(card);
        });
        
        // Re-apply current filter and search
        this.applyFilter(this.currentFilter);
    }
}

// Course comparison functionality
class CourseComparison {
    constructor() {
        this.compareList = [];
        this.maxCompare = 3;
        
        this.init();
    }
    
    init() {
        this.addCompareButtons();
        this.createComparePanel();
    }
    
    addCompareButtons() {
        const courseCards = document.querySelectorAll('.course-card');
        
        courseCards.forEach(card => {
            const compareBtn = document.createElement('button');
            compareBtn.className = 'compare-btn';
            compareBtn.textContent = 'Compare';
            compareBtn.style.cssText = `
                background: var(--secondary-color);
                color: white;
                border: none;
                padding: 8px 16px;
                border-radius: var(--border-radius);
                font-size: 0.875rem;
                cursor: pointer;
                margin-left: 10px;
                transition: var(--transition);
            `;
            
            compareBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.toggleCompare(card, compareBtn);
            });
            
            const btnContainer = card.querySelector('.course-content');
            btnContainer.appendChild(compareBtn);
        });
    }
    
    toggleCompare(card, button) {
        const courseId = card.querySelector('h3').textContent;
        const index = this.compareList.findIndex(item => item.id === courseId);
        
        if (index > -1) {
            // Remove from comparison
            this.compareList.splice(index, 1);
            button.textContent = 'Compare';
            button.style.background = 'var(--secondary-color)';
            card.classList.remove('comparing');
        } else {
            // Add to comparison
            if (this.compareList.length >= this.maxCompare) {
                window.showNotification(`You can only compare up to ${this.maxCompare} courses`, 'warning');
                return;
            }
            
            this.compareList.push({
                id: courseId,
                element: card
            });
            button.textContent = 'Remove';
            button.style.background = 'var(--error-color)';
            card.classList.add('comparing');
        }
        
        this.updateComparePanel();
    }
    
    createComparePanel() {
        const panel = document.createElement('div');
        panel.className = 'compare-panel';
        panel.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: white;
            border-radius: var(--border-radius-lg);
            box-shadow: var(--shadow-xl);
            padding: 20px;
            max-width: 300px;
            z-index: 1000;
            transform: translateY(100px);
            opacity: 0;
            transition: var(--transition);
        `;
        
        panel.innerHTML = `
            <h4 style="margin-bottom: 15px; color: var(--gray-900);">Compare Courses</h4>
            <div class="compare-list"></div>
            <button class="compare-action-btn" style="
                width: 100%;
                background: var(--primary-color);
                color: white;
                border: none;
                padding: 10px;
                border-radius: var(--border-radius);
                cursor: pointer;
                margin-top: 15px;
                display: none;
            ">Compare Selected</button>
        `;
        
        document.body.appendChild(panel);
        this.comparePanel = panel;
        
        // Setup compare action
        panel.querySelector('.compare-action-btn').addEventListener('click', () => {
            this.showComparison();
        });
    }
    
    updateComparePanel() {
        const panel = this.comparePanel;
        const list = panel.querySelector('.compare-list');
        const actionBtn = panel.querySelector('.compare-action-btn');
        
        if (this.compareList.length === 0) {
            panel.style.transform = 'translateY(100px)';
            panel.style.opacity = '0';
            return;
        }
        
        panel.style.transform = 'translateY(0)';
        panel.style.opacity = '1';
        
        list.innerHTML = this.compareList.map(item => `
            <div style="padding: 5px 0; border-bottom: 1px solid var(--gray-200);">
                ${item.id}
            </div>
        `).join('');
        
        actionBtn.style.display = this.compareList.length >= 2 ? 'block' : 'none';
    }
    
    showComparison() {
        // Create comparison modal
        const modal = document.createElement('div');
        modal.className = 'comparison-modal';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.8);
            z-index: 10000;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
        `;
        
        const content = document.createElement('div');
        content.style.cssText = `
            background: white;
            border-radius: var(--border-radius-lg);
            padding: 30px;
            max-width: 90vw;
            max-height: 90vh;
            overflow: auto;
        `;
        
        content.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                <h2>Course Comparison</h2>
                <button class="close-modal" style="
                    background: none;
                    border: none;
                    font-size: 24px;
                    cursor: pointer;
                    color: var(--gray-600);
                ">&times;</button>
            </div>
            <div class="comparison-table">
                ${this.generateComparisonTable()}
            </div>
        `;
        
        modal.appendChild(content);
        document.body.appendChild(modal);
        
        // Close modal functionality
        content.querySelector('.close-modal').addEventListener('click', () => {
            document.body.removeChild(modal);
        });
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                document.body.removeChild(modal);
            }
        });
    }
    
    generateComparisonTable() {
        const features = ['Duration', 'Students', 'Price', 'Category'];
        
        let table = '<table style="width: 100%; border-collapse: collapse;">';
        table += '<thead><tr><th style="padding: 10px; border: 1px solid var(--gray-200);">Feature</th>';
        
        this.compareList.forEach(item => {
            table += `<th style="padding: 10px; border: 1px solid var(--gray-200);">${item.id}</th>`;
        });
        
        table += '</tr></thead><tbody>';
        
        features.forEach(feature => {
            table += `<tr><td style="padding: 10px; border: 1px solid var(--gray-200); font-weight: 600;">${feature}</td>`;
            
            this.compareList.forEach(item => {
                const value = this.extractFeatureValue(item.element, feature);
                table += `<td style="padding: 10px; border: 1px solid var(--gray-200);">${value}</td>`;
            });
            
            table += '</tr>';
        });
        
        table += '</tbody></table>';
        return table;
    }
    
    extractFeatureValue(card, feature) {
        const details = card.querySelectorAll('.course-details span');
        const category = card.querySelector('.course-category');
        
        switch(feature) {
            case 'Duration':
                return details[0]?.textContent || 'N/A';
            case 'Students':
                return details[1]?.textContent || 'N/A';
            case 'Price':
                return details[2]?.textContent || 'N/A';
            case 'Category':
                return category?.textContent || 'N/A';
            default:
                return 'N/A';
        }
    }
}

// Course favorites functionality
class CourseFavorites {
    constructor() {
        this.favorites = JSON.parse(localStorage.getItem('courseFavorites')) || [];
        this.init();
    }
    
    init() {
        this.addFavoriteButtons();
        this.updateFavoriteStates();
    }
    
    addFavoriteButtons() {
        const courseCards = document.querySelectorAll('.course-card');
        
        courseCards.forEach(card => {
            const favoriteBtn = document.createElement('button');
            favoriteBtn.className = 'favorite-btn';
            favoriteBtn.innerHTML = '<i class="far fa-heart"></i>';
            favoriteBtn.style.cssText = `
                position: absolute;
                top: 15px;
                right: 15px;
                background: white;
                border: none;
                width: 40px;
                height: 40px;
                border-radius: 50%;
                cursor: pointer;
                box-shadow: var(--shadow-md);
                transition: var(--transition);
                z-index: 10;
            `;
            
            favoriteBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.toggleFavorite(card, favoriteBtn);
            });
            
            // Make card container relative for absolute positioning
            card.style.position = 'relative';
            card.appendChild(favoriteBtn);
        });
    }
    
    toggleFavorite(card, button) {
        const courseId = card.querySelector('h3').textContent;
        const index = this.favorites.indexOf(courseId);
        
        if (index > -1) {
            this.favorites.splice(index, 1);
            button.innerHTML = '<i class="far fa-heart"></i>';
            button.style.color = 'var(--gray-600)';
        } else {
            this.favorites.push(courseId);
            button.innerHTML = '<i class="fas fa-heart"></i>';
            button.style.color = 'var(--error-color)';
        }
        
        localStorage.setItem('courseFavorites', JSON.stringify(this.favorites));
        window.showNotification(
            index > -1 ? 'Removed from favorites' : 'Added to favorites',
            'success'
        );
    }
    
    updateFavoriteStates() {
        const courseCards = document.querySelectorAll('.course-card');
        
        courseCards.forEach(card => {
            const courseId = card.querySelector('h3').textContent;
            const button = card.querySelector('.favorite-btn');
            
            if (this.favorites.includes(courseId)) {
                button.innerHTML = '<i class="fas fa-heart"></i>';
                button.style.color = 'var(--error-color)';
            }
        });
    }
}

// Initialize course functionality
document.addEventListener('DOMContentLoaded', function() {
    new CourseFilter();
    new CourseComparison();
    new CourseFavorites();
});

// Add CSS for comparing state
const style = document.createElement('style');
style.textContent = `
    .course-card.comparing {
        border: 2px solid var(--secondary-color);
        transform: scale(1.02);
    }
    
    .favorite-btn:hover {
        transform: scale(1.1);
        box-shadow: var(--shadow-lg);
    }
    
    .compare-btn:hover {
        background: var(--secondary-dark) !important;
        transform: translateY(-1px);
    }
`;
document.head.appendChild(style);