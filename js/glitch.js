// ==========================================
// HARSHIT - FILMMAKER PORTFOLIO
// js/glitch.js — Cinematic Glitch Text Effect
// ==========================================

(function initGlitch() {

    // --- CONFIG ---
    const CONFIG = {
        // How often a glitch burst fires (ms between bursts)
        burstInterval:    2800,
        burstIntervalRand: 1800,   // + random up to this

        // How long a single burst lasts
        burstDuration:    600,

        // Number of rapid frames during a burst
        burstFrames:      8,

        // Characters used during glitch scramble
        glitchChars: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*<>?/|\\[]{}',

        // Original text to restore after glitch
        originalText: 'HARSHIT',

        // Clip distortion intensity (px)
        clipIntensity: 12,
    };

    // --- Wait for DOM ---
    document.addEventListener('DOMContentLoaded', () => {
        const title = document.querySelector('.hero-title');
        if (!title) return;

        // --- Wrap each letter in a span for individual control ---
        const letters = CONFIG.originalText.split('');
        title.innerHTML = letters
            .map((l, i) => `<span class="glitch-letter" data-index="${i}">${l}</span>`)
            .join('');

        // --- Inject glitch CSS ---
        const style = document.createElement('style');
        style.textContent = `
            .hero-title {
                position: relative;
            }

            /* Pseudo-layer clones for RGB-split effect */
            .hero-title::before,
            .hero-title::after {
                content: attr(data-text);
                position: absolute;
                top: 0; left: 0;
                width: 100%;
                font-family: inherit;
                font-size: inherit;
                letter-spacing: inherit;
                pointer-events: none;
                opacity: 0;
            }

            .hero-title::before {
                color: #00d4ff;
                clip-path: polygon(0 0, 100% 0, 100% 33%, 0 33%);
            }

            .hero-title::after {
                color: #ff0055;
                clip-path: polygon(0 66%, 100% 66%, 100% 100%, 0 100%);
            }

            /* Active glitch state */
            .hero-title.glitching::before,
            .hero-title.glitching::after {
                opacity: 1;
                animation: glitch-layers 0.08s steps(1) infinite;
            }

            @keyframes glitch-layers {
                0%   { transform: translate(0px,   0px);  }
                20%  { transform: translate(-4px,  2px);  }
                40%  { transform: translate(4px,  -2px);  }
                60%  { transform: translate(-2px,  4px);  }
                80%  { transform: translate(3px,  -3px);  }
                100% { transform: translate(0px,   0px);  }
            }

            .glitch-letter {
                display: inline-block;
                transition: color 0.05s;
            }

            .glitch-letter.scrambling {
                color: #00d4ff;
                text-shadow: 2px 0 #ff0055, -2px 0 #00d4ff;
            }

            /* Horizontal slice distortion bar */
            .glitch-slice {
                position: absolute;
                left: 0;
                width: 100%;
                background: rgba(255, 0, 85, 0.15);
                pointer-events: none;
                opacity: 0;
                mix-blend-mode: screen;
            }

            .glitch-slice.active {
                opacity: 1;
                animation: slice-move 0.1s steps(2) forwards;
            }

            @keyframes slice-move {
                0%   { transform: translateX(0px); }
                50%  { transform: translateX(${CONFIG.clipIntensity}px); }
                100% { transform: translateX(-${CONFIG.clipIntensity / 2}px); opacity: 0; }
            }
        `;
        document.head.appendChild(style);

        // Set data-text for CSS pseudo-elements
        title.setAttribute('data-text', CONFIG.originalText);

        // --- Create slice element ---
        const slice = document.createElement('div');
        slice.className = 'glitch-slice';
        title.appendChild(slice);

        // --- Glitch burst function ---
        function triggerGlitch() {
            const letterSpans = title.querySelectorAll('.glitch-letter');
            let frame = 0;

            title.classList.add('glitching');

            // Position slice at random vertical position
            const titleH = title.offsetHeight;
            const sliceH = 8 + Math.random() * 16;
            const sliceY = Math.random() * (titleH - sliceH);
            slice.style.height  = `${sliceH}px`;
            slice.style.top     = `${sliceY}px`;
            slice.classList.add('active');

            const burstInterval = setInterval(() => {
                frame++;

                // Scramble random letters
                letterSpans.forEach((span, i) => {
                    if (Math.random() < 0.4) {
                        span.classList.add('scrambling');
                        span.textContent = CONFIG.glitchChars[
                            Math.floor(Math.random() * CONFIG.glitchChars.length)
                        ];
                    } else {
                        span.classList.remove('scrambling');
                        span.textContent = CONFIG.originalText[i];
                    }
                });

                // End burst
                if (frame >= CONFIG.burstFrames) {
                    clearInterval(burstInterval);
                    restore(letterSpans);
                }
            }, CONFIG.burstDuration / CONFIG.burstFrames);
        }

        // --- Restore original text ---
        function restore(letterSpans) {
            letterSpans.forEach((span, i) => {
                span.classList.remove('scrambling');
                span.textContent = CONFIG.originalText[i];
            });
            title.classList.remove('glitching');
            slice.classList.remove('active');

            // Schedule next burst
            scheduleNext();
        }

        // --- Schedule next burst ---
        function scheduleNext() {
            const delay = CONFIG.burstInterval + Math.random() * CONFIG.burstIntervalRand;
            setTimeout(triggerGlitch, delay);
        }

        // --- Trigger on hover too ---
        title.addEventListener('mouseenter', triggerGlitch);

        // --- Initial delay before first glitch (let page load settle) ---
        setTimeout(scheduleNext, 2500);
    });

})();