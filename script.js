// ==========================================
// HARSHIT - FILMMAKER PORTFOLIO
// script.js - UPDATED VERSION
// ==========================================

// === INITIALIZE AOS (Animate On Scroll) ===
AOS.init({
    duration: 800,
    once: true,
    offset: 100,
    easing: 'ease-out'
});

// === PAGE LOADER ===
window.addEventListener('load', () => {
    setTimeout(() => {
        const loader = document.getElementById('loader');
        loader.classList.add('hidden');
    }, 2000);
});

// === NAVIGATION SCROLL EFFECT ===
const navbar = document.getElementById('navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    lastScroll = currentScroll;
});

// === MOBILE MENU TOGGLE ===
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');

hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    
    const spans = hamburger.querySelectorAll('span');
    if (navMenu.classList.contains('active')) {
        spans[0].style.transform = 'rotate(45deg) translateY(10px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translateY(-10px)';
    } else {
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
    }
});

// Close menu when clicking on nav link
document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        const spans = hamburger.querySelectorAll('span');
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
    });
});

// === SMOOTH SCROLL FOR ANCHOR LINKS ===
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// === SCROLL INDICATOR CLICK ===
const scrollIndicator = document.querySelector('.scroll-indicator');
if (scrollIndicator) {
    scrollIndicator.addEventListener('click', () => {
        const nextSection = document.getElementById('iifi') || document.getElementById('about');
        nextSection.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    });
}

// === PARALLAX EFFECT ON HERO ===
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const heroContent = document.querySelector('.hero-content');
    const floatingClappers = document.querySelectorAll('.floating-clapper');
    
    if (heroContent && scrolled < window.innerHeight) {
        heroContent.style.transform = `translateY(${scrolled * 0.5}px)`;
        heroContent.style.opacity = 1 - (scrolled / 500);
    }
    
    floatingClappers.forEach((clapper, index) => {
        const speed = 0.2 + (index * 0.1);
        clapper.style.transform = `translateY(${scrolled * speed}px) rotate(${scrolled * 0.05}deg)`;
    });
});

// === TOGGLE SYNOPSIS (EXPANDABLE TEXT) ===
function toggleSynopsis(button) {
    const synopsis = button.nextElementSibling;
    const buttonText = button.querySelector('span');
    
    button.classList.toggle('active');
    synopsis.classList.toggle('show');
    
    if (synopsis.classList.contains('show')) {
        buttonText.textContent = 'Hide Synopsis';
    } else {
        buttonText.textContent = 'Read Full Synopsis';
    }
}

// === WORK VIDEO HOVER EFFECT ===
document.querySelectorAll('.work-video').forEach(video => {
    video.addEventListener('mouseenter', function() {
        const overlay = this.querySelector('.video-overlay');
        if (overlay) {
            overlay.style.opacity = '0';
        }
    });
    
    video.addEventListener('mouseleave', function() {
        const overlay = this.querySelector('.video-overlay');
        if (overlay) {
            overlay.style.opacity = '1';
        }
    });
});

// === STATISTICS COUNTER ANIMATION ===
const observerOptions = {
    threshold: 0.5,
    rootMargin: '0px'
};

const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const statNumbers = entry.target.querySelectorAll('.stat-number');
            statNumbers.forEach(stat => {
                const target = parseInt(stat.textContent);
                animateCounter(stat, 0, target, 2000);
            });
            statsObserver.unobserve(entry.target);
        }
    });
}, observerOptions);

const statsSection = document.querySelector('.stats');
if (statsSection) {
    statsObserver.observe(statsSection);
}

function animateCounter(element, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const current = Math.floor(progress * (end - start) + start);
        element.textContent = current + (element.textContent.includes('+') ? '+' : '');
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}

// === ACHIEVEMENT CARDS TILT EFFECT ===
document.querySelectorAll('.achievement-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 10;
        const rotateY = (centerX - x) / 10;
        
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-15px) scale(1.02)`;
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = '';
    });
});

// === GALLERY IMAGE CLICK (for future lightbox) ===
document.querySelectorAll('.gallery-item, .gallery-item-small').forEach(item => {
    item.addEventListener('click', function() {
        // When you add real images, you can implement a lightbox here
        console.log('Image clicked - implement lightbox here');
    });
});

// === LIGHTBOX GALLERY ===
let currentImageIndex = 0;
const galleryImages = [
    // Add your image paths here
    'images/bts-1.jpg',
    'images/bts-2.jpg',
    'images/bts-3.jpg',
    'images/bts-4.jpg',
    'images/bts-5.jpg',
    'images/bts-6.jpg',
    // Add more images...
];

function openLightbox(index) {
    currentImageIndex = index;
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const caption = document.getElementById('lightbox-caption');
    
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevent scrolling
    
    // Check if we have actual images or placeholders
    const galleryItem = document.querySelectorAll('.gallery-item-main')[index];
    const img = galleryItem.querySelector('img');
    
    if (img) {
        lightboxImg.src = img.src;
    } else {
        // Placeholder mode
        lightboxImg.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600"><rect width="800" height="600" fill="%23ff0055" opacity="0.1"/><text x="50%" y="50%" text-anchor="middle" fill="%23ffffff" font-size="24" font-family="Arial">Photo ' + (index + 1) + '</text></svg>';
    }
    
    caption.textContent = `Photo ${index + 1} of ${document.querySelectorAll('.gallery-item-main').length}`;
}

function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    lightbox.classList.remove('active');
    document.body.style.overflow = ''; // Restore scrolling
}

function changeImage(direction) {
    const totalImages = document.querySelectorAll('.gallery-item-main').length;
    currentImageIndex += direction;
    
    // Loop around
    if (currentImageIndex >= totalImages) {
        currentImageIndex = 0;
    } else if (currentImageIndex < 0) {
        currentImageIndex = totalImages - 1;
    }
    
    openLightbox(currentImageIndex);
}

// Close lightbox on ESC key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeLightbox();
    } else if (e.key === 'ArrowRight') {
        changeImage(1);
    } else if (e.key === 'ArrowLeft') {
        changeImage(-1);
    }
});

// Close lightbox when clicking outside the image
document.getElementById('lightbox')?.addEventListener('click', (e) => {
    if (e.target.id === 'lightbox') {
        closeLightbox();
    }
});

// === VIEW ALL PHOTOS - OPEN LIGHTBOX ===
document.querySelector('.view-all-btn')?.addEventListener('click', function() {
    openLightbox(0); // Opens lightbox at first photo
});

// === VIEW ALL PHOTOS FUNCTIONALITY ===
// document.querySelector('.view-all-btn')?.addEventListener('click', function() {
//     const galleryGrid = document.querySelector('.gallery-grid-main');
//     const hiddenItems = galleryGrid.querySelectorAll('.gallery-item-main.hidden-item');
//     const buttonText = this.querySelector('span');
    
//     if (hiddenItems.length > 0) {
//         // Show hidden items
//         hiddenItems.forEach(item => {
//             item.classList.remove('hidden-item');
//             item.style.animation = 'fadeInUp 0.5s ease forwards';
//         });
//         buttonText.textContent = 'Show Less';
//     } else {
//         // Hide items after 6th
//         const allItems = galleryGrid.querySelectorAll('.gallery-item-main');
//         allItems.forEach((item, index) => {
//             if (index >= 6) {
//                 item.classList.add('hidden-item');
//             }
//         });
//         buttonText.textContent = 'View All Photos';
        
//         // Scroll back to gallery
//         document.getElementById('gallery').scrollIntoView({ behavior: 'smooth', block: 'start' });
//     }
// });

// Add CSS animation for fade in
// const style = document.createElement('style');
// style.textContent = `
//     @keyframes fadeInUp {
//         from {
//             opacity: 0;
//             transform: translateY(30px);
//         }
//         to {
//             opacity: 1;
//             transform: translateY(0);
//         }
//     }
    
//     .gallery-item-main.hidden-item {
//         display: none;
//     }
// `;
// document.head.appendChild(style);

// === CONSOLE EASTER EGG ===
console.log('%c🎬 HARSHIT - FILMMAKER', 'font-size: 20px; font-weight: bold; color: #ff0055;');
console.log('%cInterested in how this was made? Let\'s connect!', 'font-size: 14px; color: #00d4ff;');
console.log('%cPortfolio crafted with passion 🎥', 'font-size: 12px; color: #808080;');