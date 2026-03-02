// ==========================================
// HARSHIT - FILMMAKER PORTFOLIO
// js/grain.js — Cinematic Film Grain Overlay
// ==========================================

(function initGrain() {

    const CONFIG = {
        opacity:        0.038,   // overall grain strength — raise for more grit
        frameRate:      18,      // grain frames per second (lower = more vintage)
        resolution:     0.75,    // canvas resolution scale (perf vs quality)
        grainSize:      1.4,     // pixel radius of each grain speck
        // Sections where grain is heavier (more cinematic feel)
        heavySections:  ['hero', 'iifi', 'works'],
        heavyOpacity:   0.055,
    };

    // --- Create overlay canvas ---
    const canvas  = document.createElement('canvas');
    canvas.id     = 'grain-overlay';
    canvas.style.cssText = `
        position: fixed;
        top: 0; left: 0;
        width: 100vw; height: 100vh;
        z-index: 9998;
        pointer-events: none;
        opacity: ${CONFIG.opacity};
        mix-blend-mode: overlay;
        transition: opacity 0.8s ease;
    `;
    document.body.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    let W, H, imageData, data;
    let animId, lastFrame = 0;
    const interval = 1000 / CONFIG.frameRate;

    // --- Resize ---
    function resize() {
        W = canvas.width  = Math.floor(window.innerWidth  * CONFIG.resolution);
        H = canvas.height = Math.floor(window.innerHeight * CONFIG.resolution);
        imageData = ctx.createImageData(W, H);
        data      = imageData.data;
    }
    window.addEventListener('resize', resize);
    resize();

    // --- Draw one grain frame ---
    function drawGrain() {
        const len = data.length;
        for (let i = 0; i < len; i += 4) {
            const v = Math.random() * 255 | 0;
            data[i]     = v;   // R
            data[i + 1] = v;   // G
            data[i + 2] = v;   // B
            data[i + 3] = 255; // A (opacity handled by canvas CSS)
        }
        ctx.putImageData(imageData, 0, 0);
    }

    // --- Animation loop (throttled to CONFIG.frameRate) ---
    function loop(timestamp) {
        animId = requestAnimationFrame(loop);
        if (timestamp - lastFrame < interval) return;
        lastFrame = timestamp;
        drawGrain();
    }

    // --- Adjust opacity based on which section is in view ---
    const heavySet = new Set(CONFIG.heavySections);

    function trackSection() {
        const sections = document.querySelectorAll('section[id]');
        let current = null;
        const mid = window.innerHeight / 2;

        sections.forEach(sec => {
            const rect = sec.getBoundingClientRect();
            if (rect.top <= mid && rect.bottom >= mid) {
                current = sec.id;
            }
        });

        canvas.style.opacity = heavySet.has(current)
            ? CONFIG.heavyOpacity
            : CONFIG.opacity;
    }

    window.addEventListener('scroll', trackSection, { passive: true });

    // --- Pause when tab hidden ---
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            cancelAnimationFrame(animId);
        } else {
            requestAnimationFrame(loop);
        }
    });

    // --- Reduce grain on low-end / mobile devices ---
    if (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 2) {
        CONFIG.frameRate = 8;
        canvas.style.opacity = CONFIG.opacity * 0.6;
    }

    requestAnimationFrame(loop);

})();