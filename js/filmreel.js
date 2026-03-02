// ==========================================
// HARSHIT - FILMMAKER PORTFOLIO
// js/filmreel.js — Horizontal Film Reel Divider
// ==========================================

(function initFilmReel() {

    const CONFIG = {
        frameCount: 18,         // frames per reel strip
        frameWidth: 88,         // px
        frameHeight: 56,        // px
        sprocketH: 10,          // px height of sprocket row
        sprocketCount: 4,       // holes per row
        speed: 0.6,             // px per animation frame
        // Where to inject dividers — between these section pairs
        dividers: [
            { after: 'hero',         direction: 'left'  },
            { after: 'iifi',         direction: 'right' },
            { after: 'about',        direction: 'left'  },
            { after: 'works',        direction: 'right' },
            { after: 'gallery',      direction: 'left'  },
            { after: 'achievements', direction: 'right' },
        ],
    };

    // --- Inject CSS once ---
    const style = document.createElement('style');
    style.textContent = `
        /* ── Reel Divider Container ── */
        .reel-divider {
            width: 100%;
            overflow: hidden;
            height: ${CONFIG.frameHeight + CONFIG.sprocketH * 2}px;
            background: #0d0d0d;
            border-top: 1px solid rgba(255,255,255,0.04);
            border-bottom: 1px solid rgba(255,255,255,0.04);
            position: relative;
            z-index: 10;
        }

        /* ── Moving track (doubled for seamless loop) ── */
        .reel-track {
            display: flex;
            align-items: stretch;
            height: 100%;
            width: max-content;
            will-change: transform;
        }

        /* ── One film frame cell ── */
        .reel-frame {
            width: ${CONFIG.frameWidth}px;
            flex-shrink: 0;
            display: flex;
            flex-direction: column;
            border-right: 1px solid rgba(255,255,255,0.07);
        }

        /* Sprocket strip (top & bottom) */
        .reel-sprockets {
            height: ${CONFIG.sprocketH}px;
            background: rgba(255,255,255,0.04);
            display: flex;
            align-items: center;
            justify-content: space-evenly;
            padding: 0 6px;
            flex-shrink: 0;
        }

        .reel-hole {
            width: ${CONFIG.sprocketH - 3}px;
            height: ${CONFIG.sprocketH - 3}px;
            border-radius: 2px;
            background: #0a0a0a;
            border: 1px solid rgba(255,255,255,0.12);
        }

        /* Inner image area */
        .reel-inner {
            flex: 1;
            position: relative;
            overflow: hidden;
            background: rgba(255,255,255,0.02);
            display: flex;
            align-items: center;
            justify-content: center;
        }

        /* Subtle gradient tint — alternates red / cyan / dark */
        .reel-frame:nth-child(6n+1)  .reel-inner { background: rgba(255, 0, 85, 0.07); }
        .reel-frame:nth-child(6n+2)  .reel-inner { background: rgba(255,255,255,0.02); }
        .reel-frame:nth-child(6n+3)  .reel-inner { background: rgba(0, 212,255, 0.05); }
        .reel-frame:nth-child(6n+4)  .reel-inner { background: rgba(255,255,255,0.02); }
        .reel-frame:nth-child(6n+5)  .reel-inner { background: rgba(255,184,  0, 0.04); }
        .reel-frame:nth-child(6n+6)  .reel-inner { background: rgba(255,255,255,0.02); }

        /* Frame number */
        .reel-num {
            font-family: 'Courier New', monospace;
            font-size: 9px;
            color: rgba(255,255,255,0.18);
            letter-spacing: 1px;
            user-select: none;
        }

        /* Vertical edge burn lines (classic film look) */
        .reel-inner::before,
        .reel-inner::after {
            content: '';
            position: absolute;
            top: 0; bottom: 0;
            width: 1px;
            background: rgba(255,255,255,0.05);
        }
        .reel-inner::before { left: 6px; }
        .reel-inner::after  { right: 6px; }

        /* Hover: entire divider pauses + brightens slightly */
        .reel-divider:hover .reel-track {
            animation-play-state: paused;
        }
        .reel-divider:hover .reel-inner {
            filter: brightness(1.4);
        }
        .reel-divider:hover .reel-hole {
            border-color: rgba(255, 0, 85, 0.5);
        }
    `;
    document.head.appendChild(style);

    // --- Build one set of frames (cloned × 2 for seamless loop) ---
    function buildFrames(direction, instanceId) {
        const frames = [];
        // We build CONFIG.frameCount × 2 so we can loop seamlessly
        for (let i = 0; i < CONFIG.frameCount * 2; i++) {
            const num = String((i % CONFIG.frameCount) + 1).padStart(3, '0');

            frames.push(`
                <div class="reel-frame">
                    <div class="reel-sprockets">
                        ${'<div class="reel-hole"></div>'.repeat(CONFIG.sprocketCount)}
                    </div>
                    <div class="reel-inner">
                        <span class="reel-num">${num}</span>
                    </div>
                    <div class="reel-sprockets">
                        ${'<div class="reel-hole"></div>'.repeat(CONFIG.sprocketCount)}
                    </div>
                </div>
            `);
        }
        return frames.join('');
    }

    // --- Create a single reel divider element ---
    function createDivider(direction, instanceId) {
        const wrap = document.createElement('div');
        wrap.className = 'reel-divider';
        wrap.dataset.reelId = instanceId;
        wrap.dataset.direction = direction;

        const track = document.createElement('div');
        track.className = 'reel-track';
        track.innerHTML = buildFrames(direction, instanceId);

        wrap.appendChild(track);
        return { wrap, track };
    }

    // --- Animation loop (all reels share one rAF) ---
    const reels = [];   // { track, offset, direction, totalWidth }

    function animate() {
        reels.forEach(reel => {
            const move = reel.direction === 'left' ? -CONFIG.speed : CONFIG.speed;
            reel.offset += move;

            // Seamless loop: reset when scrolled one full set width
            const halfWidth = reel.totalWidth / 2;
            if (reel.direction === 'left'  && reel.offset <= -halfWidth) reel.offset = 0;
            if (reel.direction === 'right' && reel.offset >=  halfWidth) reel.offset = 0;

            reel.track.style.transform = `translateX(${reel.offset}px)`;
        });

        requestAnimationFrame(animate);
    }

    // --- Inject dividers after specified sections ---
    function inject() {
        CONFIG.dividers.forEach((cfg, i) => {
            const section = document.getElementById(cfg.after);
            if (!section) return;

            const { wrap, track } = createDivider(cfg.direction, i);
            section.after(wrap);

            // Measure total track width after paint
            requestAnimationFrame(() => {
                const totalWidth = track.scrollWidth;
                reels.push({
                    track,
                    offset: cfg.direction === 'right' ? -(totalWidth / 2) : 0,
                    direction: cfg.direction,
                    totalWidth,
                });
            });
        });

        // Start loop after a short paint delay
        setTimeout(animate, 100);
    }

    // --- Wait for DOM ---
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', inject);
    } else {
        inject();
    }

    // --- Pause when tab hidden ---
    let paused = false;
    document.addEventListener('visibilitychange', () => {
        paused = document.hidden;
    });

})();