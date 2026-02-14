/**
 * Movieflix - Main JavaScript
 */

// Central Movie Data Store
const MOVIE_DATABASE = [
    // Comedy
    { id: '1', name: 'The Laugh Factory', cat: 'comedy', ext: 'jpeg' },
    { id: '11', name: 'Comedy Central', cat: 'comedy', ext: 'jpeg' },
    { id: '21', name: 'Stand Up Special', cat: 'comedy', ext: 'jpg' },
    { id: '31', name: 'Hilarious Hits', cat: 'comedy', ext: 'png' },
    // Action
    { id: '2', name: 'Rapid Fire', cat: 'action', ext: 'jpeg' },
    { id: '12', name: 'Stealth Mission', cat: 'action', ext: 'jpg' },
    { id: '22', name: 'Edge of Glory', cat: 'action', ext: 'jpg' },
    { id: '32', name: 'Steel Pulse', cat: 'action', ext: 'jpg' },
    // Romance
    { id: '3', name: 'Eternal Flame', cat: 'romance', ext: 'jpg' },
    { id: '13', name: 'Moonlight Serenade', cat: 'romance', ext: 'jpg' },
    { id: '23', name: 'Heartstrings', cat: 'romance', ext: 'jpeg' },
    { id: '33', name: 'Velvet Sky', cat: 'romance', ext: 'webp' },
    // Anime
    { id: '4', name: 'Spirit Quest', cat: 'anime', ext: 'jpg' },
    { id: '14', name: 'Nexus Core', cat: 'anime', ext: 'jpg' },
    { id: '24', name: 'Blade Runner', cat: 'anime', ext: 'jpeg' },
    { id: '34', name: 'Phantom Wind', cat: 'anime', ext: 'jpeg' },
    // Family
    { id: '5', name: 'Wonder Park', cat: 'family', ext: 'jpg' },
    { id: '15', name: 'Magic Kingdom', cat: 'family', ext: 'jpg' },
    { id: '25', name: 'Forest Friends', cat: 'family', ext: 'jpg' },
    { id: '35', name: 'Home Run', cat: 'family', ext: 'jpeg' },
    // Horror
    { id: '6', name: 'Shadow Realm', cat: 'horror', ext: 'jpg' },
    { id: '16', name: 'Haunted Echo', cat: 'horror', ext: 'jpg' },
    { id: '26', name: 'Midnight Terror', cat: 'horror', ext: 'jpeg' },
    { id: 'rectangle-45', name: 'The Abyss', cat: 'horror', ext: 'png' },
    // Real
    { id: '7', name: 'Triumph', cat: 'real', ext: 'jpg' },
    { id: '17', name: 'The Voyager', cat: 'real', ext: 'jpeg' },
    { id: '27', name: 'Legacy Bound', cat: 'real', ext: 'jpeg' },
    { id: 'rectangle-46', name: 'True North', cat: 'real', ext: 'png' },
    // Series
    { id: '8', name: 'Infinite Loop', cat: 'series', ext: 'jpg' },
    { id: '18', name: 'Broken Mirror', cat: 'series', ext: 'jpg' },
    { id: '28', name: 'Glass Tower', cat: 'series', ext: 'jpeg' },
    { id: 'rectangle-47', name: 'The Grid', cat: 'series', ext: 'png' },
    // 90s
    { id: '9', name: 'Classic Soul', cat: '90s', ext: 'jpeg' },
    { id: '19', name: 'VHS Tape', cat: '90s', ext: 'jpg' },
    { id: '29', name: 'City Lights', cat: '90s', ext: 'jpg' },
    { id: 'rectangle-48', name: 'Retro Vibes', cat: '90s', ext: 'png' },
    // Premium
    { id: '10', name: 'Gold Standard', cat: 'premium', ext: 'jpg' },
    { id: '20', name: 'Diamond Edge', cat: 'premium', ext: 'jpeg' },
    { id: '30', name: 'Platinum Pick', cat: 'premium', ext: 'jpg' },
    { id: 'rectangle-60', name: 'Elite Choice', cat: 'premium', ext: 'png' }
];

document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initSearchFilter();
    initFAQ();

    // Default: Comedy
    const comedyBtn = document.querySelector('.suggestions-list li.active');
    if (comedyBtn) filterCategory('comedy', comedyBtn);
});

function showPage(pageId) {
    const pages = ['interface-page', 'login-page', 'signup-page', 'search-page', 'more-page', 'faq-page'];
    pages.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.style.display = (id === pageId) ? 'block' : 'none';
    });

    if (pageId === 'search-page') {
        const active = document.querySelector('.suggestions-list li.active') || document.querySelector('.suggestions-list li');
        if (active) {
            const cat = active.getAttribute('onclick').match(/'([^']+)'/)[1];
            filterCategory(cat, active);
        }
    }
    window.scrollTo(0, 0);
}

function initNavigation() { window.showPage = showPage; }

/**
 * Global Search Filter
 * Filters by movie name across ALL categories.
 */
function initSearchFilter() {
    const searchBar = document.querySelector('.search-bar-modern');
    if (!searchBar) return;

    searchBar.addEventListener('input', (e) => {
        const term = e.target.value.toLowerCase();
        if (term === "") {
            // Revert to current category if search is empty
            const active = document.querySelector('.suggestions-list li.active');
            const cat = active.getAttribute('onclick').match(/'([^']+)'/)[1];
            filterCategory(cat, active);
            return;
        }

        // Search global database
        const results = MOVIE_DATABASE.filter(m => m.name.toLowerCase().includes(term));
        renderMovieGrid(results, `Results for "${term}"`);
    });
}

/**
 * Play Local Video instead of YouTube
 */
function openVideo(videoId) {
    const modal = document.getElementById('video-modal');
    const container = document.getElementById('player-container');
    if (!modal || !container) return;

    // Play local video file
    container.innerHTML = `
        <video controls autoplay width="100%" style="border-radius: 8px;">
            <source src="movies/Movies from the 1990s.mp4" type="video/mp4">
            Your browser does not support the video tag.
        </video>`;

    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeVideo() {
    const modal = document.getElementById('video-modal');
    const container = document.getElementById('player-container');
    if (container) container.innerHTML = '';
    if (modal) modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

/**
 * Category Filtering
 */
function filterCategory(category, element) {
    // Update Sidebar highlight
    const allOptions = document.querySelectorAll('.suggestions-list li');
    allOptions.forEach(opt => opt.classList.remove('active'));
    if (element) element.classList.add('active');

    // Filter data
    const filtered = MOVIE_DATABASE.filter(m => m.cat === category);

    // Update UI title
    const activeText = element ? element.innerText : 'Movies';
    renderMovieGrid(filtered, activeText);
}

/**
 * Core rendering engine for the Movie Grid
 */
function renderMovieGrid(movies, title) {
    const grid = document.getElementById('dynamic-movie-grid');
    const sectionTitle = document.querySelector('.section-title');
    if (!grid || !sectionTitle) return;

    sectionTitle.innerText = title;

    grid.style.opacity = '0';
    setTimeout(() => {
        grid.innerHTML = '';
        if (movies.length === 0) {
            grid.innerHTML = '<p style="color: #666; font-size: 1.5rem; margin-top: 20px;">No movies found.</p>';
        } else {
            movies.forEach(movie => {
                const card = document.createElement('div');
                card.className = 'movie-card';
                card.onclick = () => openVideo();
                card.innerHTML = `
                    <img src="img/${movie.id}.${movie.ext}" alt="${movie.name}">
                    <div class="movie-name-tag">${movie.name}</div>
                `;
                grid.appendChild(card);
            });
        }
        grid.style.opacity = '1';
    }, 200);
}

/**
 * FAQ Logic
 */
function toggleAccordion(button) {
    const faqItem = button.parentElement;
    const isActive = faqItem.classList.contains('active');
    document.querySelectorAll('.faq-item').forEach(item => item.classList.remove('active'));
    if (!isActive) faqItem.classList.add('active');
}

function initFAQ() { }

/**
 * Form Validation and Persistent Storage
 */
function validateAuth(type) {
    if (type === 'signup') {
        const name = document.getElementById('signup-name').value;
        const email = document.getElementById('signup-email').value;
        const password = document.getElementById('signup-password').value;
        const confirm = document.getElementById('signup-confirm').value;

        if (!name || !email || !password) {
            alert('Please fill in all fields.');
            return false;
        }

        if (password.length < 6) {
            alert('Password must be at least 6 characters long.');
            return false;
        }

        if (password !== confirm) {
            alert('Passwords do not match!');
            return false;
        }

        // Store in localStorage
        localStorage.setItem('userEmail', email);
        localStorage.setItem('userPassword', password);
        localStorage.setItem('userName', name);

        alert('Account created successfully! You can now log in.');
        showPage('login-page');
        return true;
    }

    if (type === 'login') {
        const emailInput = document.getElementById('login-email').value;
        const passwordInput = document.getElementById('login-password').value;

        const storedEmail = localStorage.getItem('userEmail');
        const storedPassword = localStorage.getItem('userPassword');

        if (!storedEmail) {
            alert('No account found. Please sign up first.');
            return false;
        }

        if (emailInput === storedEmail && passwordInput === storedPassword) {
            showPage('search-page');
            return true;
        } else {
            alert('Invalid email or password.');
            return false;
        }
    }

    return false;
}

// Global Exports
window.openVideo = openVideo;
window.closeVideo = closeVideo;
window.filterCategory = filterCategory;
window.validateAuth = validateAuth;
window.toggleAccordion = toggleAccordion;
