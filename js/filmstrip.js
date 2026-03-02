// ==========================================
// HARSHIT - FILMMAKER PORTFOLIO
// js/filmstrip.js — Scroll-Driven Film Strip
// ==========================================

(function initFilmStrip() {

    // --- CONFIG ---
    const CONFIG = {
        stripCount: 2,          // One strip each side
        frameCount: 12,         // Frames per strip (visible at once)
        frameSymbols: ['🎬', '🎥', '🎞️', '📽️', '🎦', '🎭'],
        scrollSpeed: 0.4,       // How fast strip moves with scroll
        frameWidth: 70,         // px
        frameHeight: 90,        // px
        sprocketSize: 8,        // px — the little square holes
    };

    // --- Inject CSS ---
    const style = document.createElement('style');
    style.textContent = `
        /* ── Film Strip Wrapper ── */
        .filmstrip-rail {
            position: fixed;
            top: 0;
            height: 100vh;
            width: ${CONFIG.frameWidth + 20}px;
            overflow: hidden;
            z-index: 999;
            pointer-events: none;
            opacity: 0;
            transition: opacity 0.6s ease;
        }

        .filmstrip-rail.visible {
            opacity: 1;
        }

        .filmstrip-rail.left  { left: 0; }
        .filmstrip-rail.right { right: 0; }

        /* ── Scrolling inner track ── */
        .filmstrip-track {
            position: absolute;
            top: 0;
            left: 50%;
            transform: translateX(-50%);
            display: flex;
            flex-direction: column;
            will-change: transform;
        }

        /* ── Single frame ── */
        .film-frame {
            width: ${CONFIG.frameWidth}px;
            height: ${CONFIG.frameHeight}px;
            background: rgba(15, 15, 15, 0.85);
            border: 1.5px solid rgba(255, 255, 255, 0.08);
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: space-between;
            padding: 4px 3px;
            position: relative;
            backdrop-filter: blur(2px);
            flex-shrink: 0;
        }

        /* Sprocket holes row */
        .sprockets {
            display: flex;
            justify-content: space-around;
            width: 100%;
        }

        .sprocket {
            width: ${CONFIG.sprocketSize}px;
            height: ${CONFIG.sprocketSize}px;
            background: rgba(255,255,255,0.06);
            border: 1px solid rgba(255,255,255,0.12);
            border-radius: 2px;
        }

        /* Frame content area */
        .frame-content {
            flex: 1;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.6rem;
            opacity: 0.45;
            filter: grayscale(40%);
        }

        /* Frame number label */
        .frame-number {
            font-size: 0.5rem;
            color: rgba(255, 0, 85, 0.5);
            letter-spacing: 1px;
            font-family: 'Courier New', monospace;
        }

        /* Subtle red accent on left edge */
        .filmstrip-rail.left .film-frame::before {
            content: '';
            position: absolute;
            left: 0; top: 0;
            width: 2px; height: 100%;
            background: linear-gradient(to bottom, transparent, rgba(255,0,85,0.4), transparent);
        }

        /* Subtle cyan accent on right edge */
        .filmstrip-rail.right .film-frame::after {
            content: '';
            position: absolute;
            right: 0; top: 0;
            width: 2px; height: 100%;
            background: linear-gradient(to bottom, transparent, rgba(0,212,255,0.4), transparent);
        }

        /* Hide on small screens — don't crowd mobile */
        @media (max-width: 900px) {
            .filmstrip-rail { display: none; }
        }
    `;
    document.head.appendChild(style);

    // --- Build a strip ---
    function buildStrip(side) {
        const rail = document.createElement('div');
        rail.className = `filmstrip-rail ${side}`;

        const track = document.createElement('div');
        track.className = 'filmstrip-track';

        // Build enough frames to fill viewport height × 2 (for seamless scroll)
        const totalFrames = Math.ceil((window.innerHeight * 2.5) / CONFIG.frameHeight) + CONFIG.frameCount;

        for (let i = 0; i < totalFrames; i++) {
            const frame = document.createElement('div');
            frame.className = 'film-frame';

            const symbol = CONFIG.frameSymbols[i % CONFIG.frameSymbols.length];
            const frameNum = String(i + 1).padStart(3, '0');

            frame.innerHTML = `
                <div class="sprockets">
                    <div class="sprocket"></div>
                    <div class="sprocket"></div>
                    <div class="sprocket"></div>
                </div>
                <div class="frame-content">${symbol}</div>
                <div class="frame-number">${frameNum}</div>
                <div class="sprockets">
                    <div class="sprocket"></div>
                    <div class="sprocket"></div>
                    <div class="sprocket"></div>
                </div>
            `;

            track.appendChild(frame);
        }

        rail.appendChild(track);
        document.body.appendChild(rail);

        return { rail, track };
    }

    // --- Wait for DOM ---
    document.addEventListener('DOMContentLoaded', () => {

        const leftStrip  = buildStrip('left');
        const rightStrip = buildStrip('right');

        let lastScrollY  = 0;
        let currentY     = 0;
        let targetY      = 0;
        let rafId;

        // Show strips after a short delay
        setTimeout(() => {
            leftStrip.rail.classList.add('visible');
            rightStrip.rail.classList.add('visible');
        }, 1800);

        // --- Smooth scroll-driven movement ---
        function onScroll() {
            targetY = window.pageYOffset * CONFIG.scrollSpeed;
        }

        function lerp(a, b, t) {
            return a + (b - a) * t;
        }

        function loop() {
            currentY = lerp(currentY, targetY, 0.08);

            // Left strip moves DOWN with scroll
            leftStrip.track.style.transform  = `translateX(-50%) translateY(-${currentY}px)`;

            // Right strip moves UP (opposite direction = cinematic tension)
            rightStrip.track.style.transform = `translateX(-50%) translateY(${currentY * 0.6 - (window.innerHeight * 0.3)}px)`;

            rafId = requestAnimationFrame(loop);
        }

        window.addEventListener('scroll', onScroll, { passive: true });

        // Pause when tab hidden
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                cancelAnimationFrame(rafId);
            } else {
                loop();
            }
        });

        loop();
    });

})();