// ==========================================
// HARSHIT - FILMMAKER PORTFOLIO
// js/intro.js — Aperture Iris Intro Animation
// ==========================================

(function initIrisIntro() {

    // --- CONFIG ---
    const CONFIG = {
        bladeCount:      10,      // aperture blades (more = smoother iris)
        openDuration:    1100,    // ms — how long iris takes to open
        openDelay:       300,     // ms — pause before opening starts
        holdDuration:    200,     // ms — hold fully open before fading overlay
        fadeDuration:    600,     // ms — overlay fade out
        ringPulses:      2,       // concentric rings that ripple outward
        skipAfter:       6000,    // ms — auto-skip if something stalls
    };

    // --- Only run on first visit per session ---
    // Comment out these 3 lines if you want it every page load
    // if (sessionStorage.getItem('iris-shown')) return;
    // sessionStorage.setItem('iris-shown', '1');

    // --- Inject CSS ---
    const style = document.createElement('style');
    style.textContent = `
        /* ── Iris overlay — sits above everything ── */
        #iris-intro {
            position: fixed;
            inset: 0;
            z-index: 99999;
            background: #000;
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: hidden;
            cursor: pointer;
        }

        #iris-intro.fading {
            transition: opacity ${CONFIG.fadeDuration}ms cubic-bezier(0.4, 0, 0.2, 1);
            opacity: 0;
            pointer-events: none;
        }

        #iris-intro.gone {
            display: none;
        }

        /* ── SVG canvas fills the screen ── */
        #iris-svg {
            position: absolute;
            inset: 0;
            width: 100%;
            height: 100%;
        }

        /* ── Center branding ── */
        .iris-brand {
            position: relative;
            z-index: 2;
            text-align: center;
            pointer-events: none;
            opacity: 1;
            transition: opacity 0.3s ease;
        }

        .iris-brand-name {
            font-family: 'Bebas Neue', cursive;
            font-size: clamp(3rem, 8vw, 7rem);
            letter-spacing: 10px;
            color: #fff;
            display: block;
            line-height: 1;
            margin-bottom: 0.5rem;
            text-shadow: 0 0 60px rgba(255, 0, 85, 0.4);
        }

        .iris-brand-sub {
            font-family: 'Space Grotesk', sans-serif;
            font-size: clamp(0.6rem, 1.5vw, 0.9rem);
            letter-spacing: 5px;
            color: rgba(255, 255, 255, 0.45);
            text-transform: uppercase;
            display: block;
        }

        /* ── Red accent line under name ── */
        .iris-brand-line {
            width: 0;
            height: 2px;
            background: linear-gradient(90deg, transparent, #ff0055, transparent);
            margin: 0.6rem auto 0;
            transition: width 0.6s ease 0.2s;
        }

        .iris-brand-line.expanded {
            width: clamp(80px, 15vw, 160px);
        }

        /* ── Skip hint ── */
        .iris-skip {
            position: absolute;
            bottom: 2rem;
            right: 2.5rem;
            font-family: 'Space Grotesk', sans-serif;
            font-size: 0.7rem;
            letter-spacing: 2px;
            color: rgba(255, 255, 255, 0.2);
            text-transform: uppercase;
            z-index: 3;
            transition: color 0.3s;
        }

        #iris-intro:hover .iris-skip {
            color: rgba(255, 255, 255, 0.5);
        }

        /* ── Scanline texture ── */
        .iris-scan {
            position: absolute;
            inset: 0;
            background: repeating-linear-gradient(
                0deg,
                transparent 0px,
                transparent 3px,
                rgba(0, 0, 0, 0.08) 3px,
                rgba(0, 0, 0, 0.08) 4px
            );
            pointer-events: none;
            z-index: 1;
        }

        /* ── Vignette ── */
        .iris-vignette {
            position: absolute;
            inset: 0;
            background: radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.7) 100%);
            pointer-events: none;
            z-index: 1;
        }
    `;
    document.head.appendChild(style);

    // --- Build overlay HTML ---
    const overlay = document.createElement('div');
    overlay.id = 'iris-intro';
    overlay.title = 'Click to skip';
    overlay.innerHTML = `
        <svg id="iris-svg" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice"></svg>
        <div class="iris-scan"></div>
        <div class="iris-vignette"></div>
        <div class="iris-brand">
            <span class="iris-brand-name">HARSHIT</span>
            <span class="iris-brand-sub">Filmmaker · Storyteller · Visual Artist</span>
            <div class="iris-brand-line" id="iris-line"></div>
        </div>
        <div class="iris-skip">Tap to skip</div>
    `;
    document.body.insertBefore(overlay, document.body.firstChild);

    // --- Build SVG iris ---
    const svg    = document.getElementById('iris-svg');
    const NS     = 'http://www.w3.org/2000/svg';
    const CX     = 50, CY = 50;  // center in viewBox units
    const MAX_R  = 85;           // radius large enough to cover corners

    // Dark background rect
    const bg = document.createElementNS(NS, 'rect');
    bg.setAttribute('width', '100');
    bg.setAttribute('height', '100');
    bg.setAttribute('fill', '#000');
    svg.appendChild(bg);

    // Subtle radial glow at center (shows before iris opens)
    const defs = document.createElementNS(NS, 'defs');
    defs.innerHTML = `
        <radialGradient id="iris-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stop-color="rgba(255,0,85,0.12)"/>
            <stop offset="100%" stop-color="rgba(0,0,0,0)"/>
        </radialGradient>
        <radialGradient id="iris-dark" cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stop-color="#0a0a0a"/>
            <stop offset="60%"  stop-color="#050505"/>
            <stop offset="100%" stop-color="#000"/>
        </radialGradient>
    `;
    svg.appendChild(defs);

    const glowCircle = document.createElementNS(NS, 'circle');
    glowCircle.setAttribute('cx', CX); glowCircle.setAttribute('cy', CY);
    glowCircle.setAttribute('r', '50');
    glowCircle.setAttribute('fill', 'url(#iris-glow)');
    svg.appendChild(glowCircle);

    // --- Create blade group ---
    const bladeGroup = document.createElementNS(NS, 'g');
    bladeGroup.id = 'iris-blades';
    svg.appendChild(bladeGroup);

    const blades = [];
    const bladeAngle = 360 / CONFIG.bladeCount;

    for (let i = 0; i < CONFIG.bladeCount; i++) {
        const baseAngle  = i * bladeAngle;
        const startRad   = (baseAngle - 2)           * Math.PI / 180;
        const endRad     = (baseAngle + bladeAngle + 8) * Math.PI / 180;

        const x1 = CX + MAX_R * Math.cos(startRad);
        const y1 = CY + MAX_R * Math.sin(startRad);
        const x2 = CX + MAX_R * Math.cos(endRad);
        const y2 = CY + MAX_R * Math.sin(endRad);

        const blade = document.createElementNS(NS, 'path');
        blade.setAttribute('d', `M${CX},${CY} L${x1},${y1} A${MAX_R},${MAX_R} 0 0,1 ${x2},${y2} Z`);

        // Alternate slight shade variation for depth
        const shade = i % 2 === 0 ? '#0c0c0c' : '#080808';
        blade.setAttribute('fill', shade);

        // Thin edge highlight
        blade.setAttribute('stroke', 'rgba(255,255,255,0.04)');
        blade.setAttribute('stroke-width', '0.3');

        blade.style.transformOrigin = `${CX}px ${CY}px`;
        blade.style.transition = `transform ${CONFIG.openDuration}ms cubic-bezier(0.4, 0, 0.15, 1)`;
        // Stagger each blade slightly for organic feel
        blade.style.transitionDelay = `${i * (CONFIG.openDuration * 0.02)}ms`;

        bladeGroup.appendChild(blade);
        blades.push({ el: blade, baseAngle });
    }

    // --- Concentric rings (ripple effect) ---
    const ringGroup = document.createElementNS(NS, 'g');
    ringGroup.id = 'iris-rings';
    svg.appendChild(ringGroup);

    const ringEls = [];
    for (let r = 0; r < CONFIG.ringPulses; r++) {
        const ring = document.createElementNS(NS, 'circle');
        ring.setAttribute('cx', CX); ring.setAttribute('cy', CY);
        ring.setAttribute('r', '0');
        ring.setAttribute('fill', 'none');
        ring.setAttribute('stroke', r === 0 ? 'rgba(255,0,85,0.5)' : 'rgba(0,212,255,0.25)');
        ring.setAttribute('stroke-width', '0.4');
        ring.style.transition = `r ${CONFIG.openDuration * 0.9}ms cubic-bezier(0.4, 0, 0.2, 1),
                                  opacity 0.5s ease`;
        ring.style.transitionDelay = `${r * 120}ms`;
        ring.style.opacity = '0';
        ringGroup.appendChild(ring);
        ringEls.push(ring);
    }

    // --- Animate open ---
    function openIris() {
        // Expand the accent line under the name
        setTimeout(() => {
            document.getElementById('iris-line').classList.add('expanded');
        }, 100);

        // After delay, start opening
        setTimeout(() => {
            // Rotate blades outward
            blades.forEach(({ el, baseAngle }, i) => {
                el.style.transform = `rotate(${bladeAngle * 1.5}deg)`;
            });

            // Pulse rings outward
            ringEls.forEach((ring, i) => {
                ring.style.opacity = '1';
                ring.style.r       = String(MAX_R * 0.85);
                // Fade rings as they expand
                setTimeout(() => {
                    ring.style.opacity = '0';
                }, CONFIG.openDuration * 0.6);
            });

            // Fade overlay after iris is open
            setTimeout(() => {
                dismiss();
            }, CONFIG.openDuration + CONFIG.holdDuration);

        }, CONFIG.openDelay);
    }

    // --- Dismiss overlay ---
    function dismiss() {
        overlay.classList.add('fading');
        setTimeout(() => {
            overlay.classList.add('gone');
        }, CONFIG.fadeDuration + 50);
    }

    // --- Click / tap to skip ---
    overlay.addEventListener('click', dismiss);

    // --- Auto-skip safety net ---
    const safetyTimer = setTimeout(dismiss, CONFIG.skipAfter);
    overlay.addEventListener('click', () => clearTimeout(safetyTimer), { once: true });

    // --- Start after DOM is ready ---
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', openIris);
    } else {
        openIris();
    }

})();