// ==========================================
// HARSHIT - FILMMAKER PORTFOLIO
// js/titles.js — Film Slate Section Title Reveal
// ==========================================

(function initTitleReveal() {

    // --- CONFIG ---
    const CONFIG = {
        typeSpeed:       55,    // ms per character
        cursorBlinkRate: 530,   // ms cursor blink
        cursorChar:      '|',
        slateFlashDuration: 320, // ms — white flash before typing starts
        revealDelay:     120,   // ms after element enters viewport
    };

    // --- Inject CSS ---
    const style = document.createElement('style');
    style.textContent = `
        /* ── Section title base — hide text until revealed ── */
        .section-title[data-slate] {
            position: relative;
            visibility: visible;
        }

        /* The visible typed text layer */
        .slate-text {
            display: inline;
        }

        /* Blinking cursor */
        .slate-cursor {
            display: inline-block;
            width: 3px;
            background: var(--primary, #ff0055);
            height: 0.85em;
            vertical-align: middle;
            margin-left: 4px;
            border-radius: 1px;
            animation: slate-blink ${CONFIG.cursorBlinkRate * 2}ms step-end infinite;
        }

        @keyframes slate-blink {
            0%, 100% { opacity: 1; }
            50%       { opacity: 0; }
        }

        /* ── Slate flash overlay ── */
        .slate-flash {
            position: fixed;
            inset: 0;
            background: #ffffff;
            z-index: 99999;
            pointer-events: none;
            opacity: 0;
        }

        .slate-flash.active {
            animation: slate-hit ${CONFIG.slateFlashDuration}ms ease-out forwards;
        }

        @keyframes slate-hit {
            0%   { opacity: 0.18; }
            15%  { opacity: 0.10; }
            100% { opacity: 0; }
        }

        /* ── Section number — clap-tick effect ── */
        .section-number[data-clap] {
            display: inline-block;
            transition: transform 0.1s ease, color 0.2s ease;
        }

        .section-number[data-clap].clapping {
            transform: scaleY(-1) translateY(-4px);
            color: var(--primary, #ff0055);
        }

        /* ── Underline — draws in after typing ── */
        .section-underline[data-draw] {
            width: 0 !important;
            transition: width 0.6s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .section-underline[data-draw].drawn {
            width: 100px !important;
        }
    `;
    document.head.appendChild(style);

    // --- Create flash overlay once ---
    const flash = document.createElement('div');
    flash.className = 'slate-flash';
    document.body.appendChild(flash);

    function triggerFlash() {
        flash.classList.remove('active');
        void flash.offsetWidth; // reflow to restart animation
        flash.classList.add('active');
    }

    // --- Typewriter core ---
    function typeText(spanEl, text, onDone) {
        let i = 0;
        spanEl.textContent = '';

        function tick() {
            if (i < text.length) {
                spanEl.textContent += text[i];
                i++;
                setTimeout(tick, CONFIG.typeSpeed + (Math.random() * 20 - 10));
            } else {
                onDone && onDone();
            }
        }
        tick();
    }

    // --- Animate one section header ---
    function revealHeader(header) {
        if (header.dataset.revealed) return;
        header.dataset.revealed = 'true';

        const titleEl      = header.querySelector('.section-title');
        const numberEl     = header.querySelector('.section-number');
        const underlineEl  = header.querySelector('.section-underline');

        if (!titleEl) return;

        const originalText = titleEl.textContent.trim();

        // Mark for styling
        titleEl.setAttribute('data-slate', '');
        if (numberEl)    numberEl.setAttribute('data-clap', '');
        if (underlineEl) underlineEl.setAttribute('data-draw', '');

        // Build inner structure: typed text + cursor
        titleEl.innerHTML = '';
        const textSpan   = document.createElement('span');
        textSpan.className = 'slate-text';
        const cursorSpan = document.createElement('span');
        cursorSpan.className = 'slate-cursor';

        titleEl.appendChild(textSpan);
        titleEl.appendChild(cursorSpan);

        // Step 1 — clap the section number
        if (numberEl) {
            numberEl.classList.add('clapping');
            setTimeout(() => numberEl.classList.remove('clapping'), 200);
        }

        // Step 2 — flash
        setTimeout(() => {
            triggerFlash();

            // Step 3 — type
            setTimeout(() => {
                typeText(textSpan, originalText, () => {

                    // Step 4 — draw underline
                    if (underlineEl) {
                        setTimeout(() => underlineEl.classList.add('drawn'), 100);
                    }

                    // Step 5 — remove cursor after a beat
                    setTimeout(() => {
                        cursorSpan.style.animation = 'none';
                        cursorSpan.style.opacity   = '0';
                    }, 1800);
                });
            }, 80);

        }, CONFIG.revealDelay);
    }

    // --- Observe all .section-header elements ---
    function init() {
        const headers = document.querySelectorAll('.section-header');
        if (!headers.length) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    revealHeader(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.3,
            rootMargin: '0px 0px -60px 0px',
        });

        headers.forEach(h => observer.observe(h));
    }

    // --- Wait for DOM ---
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();