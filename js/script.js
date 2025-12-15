// ==========================================
// HARSHIT - FILMMAKER PORTFOLIO
// script.js
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
    }, 2000); // 2 second loader
});

// === NAVIGATION SCROLL EFFECT ===
const navbar = document.getElementById('navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    // Add scrolled class for styling
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
    
    // Animate hamburger to X
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
const offsetTop = target.offsetTop - 80; // Account for fixed navbar
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
document.getElementById('about').scrollIntoView({
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

// Parallax for floating clapperboards
floatingClappers.forEach((clapper, index) => {
    const speed = 0.2 + (index * 0.1);
    clapper.style.transform = `translateY(${scrolled * speed}px) rotate(${scrolled * 0.05}deg)`;
});
});
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
// === CONTACT ITEMS PULSE ON HOVER ===
document.querySelectorAll('.contact-item').forEach(item => {
item.addEventListener('mouseenter', function() {
const icon = this.querySelector('.contact-icon');
icon.style.animation = 'none';
setTimeout(() => {
icon.style.animation = 'pulse 0.5s ease';
}, 10);
});
});
//=== CURSOR TRAIL EFFECT (Optional - Desktop Only) ===
// if (window.innerWidth > 768) {
// const cursor = document.createElement('div');
// cursor.className = 'custom-cursor';
// cursor.style.cssText = position: fixed;         
// width: 10px;         
// height: 10px;        
//  background: var(--primary);         
//  border-radius: 50%;         pointer-events: none;         z-index: 9999;         mix-blend-mode: difference;         transition: transform 0.2s ease;    ;
// document.body.appendChild(cursor);
// document.addEventListener('mousemove', (e) => {
//     cursor.style.left = e.clientX + 'px';
//     cursor.style.top = e.clientY + 'px';
// });

// Enlarge cursor on hover over clickable elements
document.querySelectorAll('a, button, .work-video, .achievement-card').forEach(el => {
    el.addEventListener('mouseenter', () => {
        cursor.style.transform = 'scale(3)';
    });
    el.addEventListener('mouseleave', () => {
        cursor.style.transform = 'scale(1)';
    });
});

// === CONSOLE EASTER EGG ===
// console.log('%c🎬 HARSHIT - FILMMAKER', 'font-size: 20px; font-weight: bold; color: #ff0055;');
// console.log('%cInterested in how this was made? Let's connect!', 'font-size: 14px; color: #00d4ff;');
// console.log('%cPortfolio crafted with passion 🎥', 'font-size: 12px; color: #808080;');
