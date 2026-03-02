// ==========================================
// HARSHIT - FILMMAKER PORTFOLIO
// js/cursor.js — Cinematic Custom Cursor
// ==========================================

(function initCursor() {

    // --- Skip on touch devices (no cursor needed) ---
    if (window.matchMedia('(hover: none)').matches) return;

    // --- CONFIG ---
    const CONFIG = {
        trailLength:     12,      // number of trail dots
        trailFade:       0.75,    // opacity multiplier per step (0–1)
        trailScale:      0.82,    // size multiplier per step
        lerpSpeed:       0.18,    // cursor smoothing (0 = no movement, 1 = instant)
        dotSize:         8,       // px — main cursor dot
        ringSize:        36,      // px — outer ring
        ringLerpSpeed:   0.10,    // ring lags behind more than dot
        trailDotSize:    6,       // px — trail starting size
        // Colors
        dotColor:        '#ff0055',
        ringColor:       'rgba(255, 0, 85, 0.35)',
        ringHoverColor:  'rgba(0, 212, 255, 0.5)',
        trailColors: [
            'rgba(255, 0, 85,   IDX)',
            'rgba(255, 80, 120, IDX)',
            'rgba(0, 212, 255,  IDX)',
        ],
    };

    // --- Inject CSS ---
    const style = document.createElement('style');
    style.textContent = `
        /* Hide default cursor everywhere */
        *, *::before, *::after {
            cursor: none !important;
        }

        /* ── Main dot ── */
        #cursor-dot {
            position: fixed;
            width: ${CONFIG.dotSize}px;
            height: ${CONFIG.dotSize}px;
            background: ${CONFIG.dotColor};
            border-radius: 50%;
            pointer-events: none;
            z-index: 999999;
            transform: translate(-50%, -50%);
            mix-blend-mode: screen;
            box-shadow: 0 0 8px ${CONFIG.dotColor}, 0 0 16px rgba(255,0,85,0.4);
            transition: width 0.2s, height 0.2s, background 0.2s;
        }

        /* ── Outer ring ── */
        #cursor-ring {
            position: fixed;
            width: ${CONFIG.ringSize}px;
            height: ${CONFIG.ringSize}px;
            border: 1.5px solid ${CONFIG.ringColor};
            border-radius: 50%;
            pointer-events: none;
            z-index: 999998;
            transform: translate(-50%, -50%);
            transition: width 0.25s cubic-bezier(0.4,0,0.2,1),
                        height 0.25s cubic-bezier(0.4,0,0.2,1),
                        border-color 0.25s,
                        border-width 0.25s;
        }

        /* ── Trail dots ── */
        .cursor-trail {
            position: fixed;
            border-radius: 50%;
            pointer-events: none;
            z-index: 999997;
            transform: translate(-50%, -50%);
            mix-blend-mode: screen;
        }

        /* ── States ── */

        /* Hovering a link / button */
        body.cursor-hover #cursor-dot {
            width: ${CONFIG.dotSize * 1.6}px;
            height: ${CONFIG.dotSize * 1.6}px;
            background: #00d4ff;
            box-shadow: 0 0 12px #00d4ff, 0 0 24px rgba(0,212,255,0.5);
        }
        body.cursor-hover #cursor-ring {
            width: ${CONFIG.ringSize * 1.6}px;
            height: ${CONFIG.ringSize * 1.6}px;
            border-color: ${CONFIG.ringHoverColor};
            border-width: 2px;
        }

        /* Hovering a video / iframe */
        body.cursor-play #cursor-dot {
            width: 0;
            height: 0;
            background: transparent;
            box-shadow: none;
        }
        body.cursor-play #cursor-ring {
            width: ${CONFIG.ringSize * 2}px;
            height: ${CONFIG.ringSize * 2}px;
            border-color: rgba(255,0,85,0.7);
            border-width: 2px;
        }

        /* Clicking */
        body.cursor-click #cursor-dot {
            width: ${CONFIG.dotSize * 0.6}px;
            height: ${CONFIG.dotSize * 0.6}px;
        }
        body.cursor-click #cursor-ring {
            width: ${CONFIG.ringSize * 0.7}px;
            height: ${CONFIG.ringSize * 0.7}px;
            border-color: rgba(255,0,85,0.9);
        }

        /* Film frame cursor on gallery items */
        body.cursor-gallery #cursor-ring {
            border-radius: 3px;
            width: ${CONFIG.ringSize * 1.4}px;
            height: ${CONFIG.ringSize * 1.4 * 0.75}px;
            border-color: rgba(255,255,255,0.5);
        }
    `;
    document.head.appendChild(style);

    // --- Build DOM elements ---
    const dot  = document.createElement('div');
    dot.id = 'cursor-dot';
    document.body.appendChild(dot);

    const ring = document.createElement('div');
    ring.id = 'cursor-ring';
    document.body.appendChild(ring);

    // Trail dots
    const trail = [];
    for (let i = 0; i < CONFIG.trailLength; i++) {
        const t = document.createElement('div');
        t.className = 'cursor-trail';
        const size    = CONFIG.trailDotSize * Math.pow(CONFIG.trailScale, i);
        const opacity = Math.pow(CONFIG.trailFade, i + 1) * 0.6;
        // Cycle through trail colors
        const colorTemplate = CONFIG.trailColors[i % CONFIG.trailColors.length];
        const color = colorTemplate.replace('IDX', opacity.toFixed(2));
        t.style.cssText = `
            width: ${size}px;
            height: ${size}px;
            background: ${color};
            opacity: 1;
        `;
        document.body.appendChild(t);
        trail.push({ el: t, x: 0, y: 0 });
    }

    // --- State ---
    let mouseX = -200, mouseY = -200;
    let dotX   = -200, dotY   = -200;
    let ringX  = -200, ringY  = -200;

    // --- Track mouse ---
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    // --- Cursor state detection ---
    const body = document.body;

    // Interactive elements → hover state
    document.addEventListener('mouseover', (e) => {
        const el = e.target.closest('a, button, .hero-cta, .read-more-btn, .view-all-btn, .choose-btn, .nav-menu a, .logo, .hamburger, .lightbox-prev, .lightbox-next, .lightbox-close, .contact-item');
        if (el) body.classList.add('cursor-hover');
    });
    document.addEventListener('mouseout', (e) => {
        const el = e.target.closest('a, button, .hero-cta, .read-more-btn, .view-all-btn, .choose-btn, .nav-menu a, .logo, .hamburger, .lightbox-prev, .lightbox-next, .lightbox-close, .contact-item');
        if (el) body.classList.remove('cursor-hover');
    });

    // Video / iframe areas → play state
    document.addEventListener('mouseover', (e) => {
        if (e.target.closest('.work-video, .iifi-video')) body.classList.add('cursor-play');
    });
    document.addEventListener('mouseout', (e) => {
        if (e.target.closest('.work-video, .iifi-video')) body.classList.remove('cursor-play');
    });

    // Gallery items → film-frame cursor
    document.addEventListener('mouseover', (e) => {
        if (e.target.closest('.gallery-item-main')) body.classList.add('cursor-gallery');
    });
    document.addEventListener('mouseout', (e) => {
        if (e.target.closest('.gallery-item-main')) body.classList.remove('cursor-gallery');
    });

    // Click feedback
    document.addEventListener('mousedown', () => body.classList.add('cursor-click'));
    document.addEventListener('mouseup',   () => body.classList.remove('cursor-click'));

    // Hide when leaving window
    document.addEventListener('mouseleave', () => {
        dot.style.opacity  = '0';
        ring.style.opacity = '0';
        trail.forEach(t => t.el.style.opacity = '0');
    });
    document.addEventListener('mouseenter', () => {
        dot.style.opacity  = '1';
        ring.style.opacity = '1';
    });

    // --- lerp helper ---
    function lerp(a, b, t) { return a + (b - a) * t; }

    // --- Animation loop ---
    function loop() {
        // Smooth dot follows mouse closely
        dotX = lerp(dotX, mouseX, CONFIG.lerpSpeed);
        dotY = lerp(dotY, mouseY, CONFIG.lerpSpeed);

        // Ring lags further behind
        ringX = lerp(ringX, mouseX, CONFIG.ringLerpSpeed);
        ringY = lerp(ringY, mouseY, CONFIG.ringLerpSpeed);

        dot.style.left = `${dotX}px`;
        dot.style.top  = `${dotY}px`;

        ring.style.left = `${ringX}px`;
        ring.style.top  = `${ringY}px`;

        // Trail — each dot follows the one before it
        if (trail.length > 0) {
            // First trail dot follows the cursor dot
            trail[0].x = lerp(trail[0].x, dotX, CONFIG.lerpSpeed * 0.8);
            trail[0].y = lerp(trail[0].y, dotY, CONFIG.lerpSpeed * 0.8);
            trail[0].el.style.left = `${trail[0].x}px`;
            trail[0].el.style.top  = `${trail[0].y}px`;

            // Each subsequent dot follows the one before
            for (let i = 1; i < trail.length; i++) {
                trail[i].x = lerp(trail[i].x, trail[i-1].x, CONFIG.lerpSpeed * 0.75);
                trail[i].y = lerp(trail[i].y, trail[i-1].y, CONFIG.lerpSpeed * 0.75);
                trail[i].el.style.left = `${trail[i].x}px`;
                trail[i].el.style.top  = `${trail[i].y}px`;
            }
        }

        requestAnimationFrame(loop);
    }

    // Pause when tab hidden
    document.addEventListener('visibilitychange', () => {
        if (!document.hidden) requestAnimationFrame(loop);
    });

    requestAnimationFrame(loop);

})();