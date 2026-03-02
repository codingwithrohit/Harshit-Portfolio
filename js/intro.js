// ==========================================
// HARSHIT - FILMMAKER PORTFOLIO
// js/intro.js — Aperture Iris Intro (Fixed)
// ==========================================

(function initIrisIntro() {

    const CONFIG = {
        bladeCount:      10,
        openDuration:    1000,
        openDelay:       400,
        holdDuration:    200,
        fadeDuration:    500,
        skipAfter:       8000,
    };

    // --- Inject CSS immediately (sync) ---
    const style = document.createElement('style');
    style.textContent = `
        #iris-intro {
            position: fixed;
            inset: 0;
            z-index: 999999;
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
        #iris-intro.gone { display: none; }
        #iris-svg {
            position: absolute;
            inset: 0; width: 100%; height: 100%;
        }
        .iris-brand {
            position: relative; z-index: 2;
            text-align: center; pointer-events: none;
        }
        .iris-brand-name {
            font-family: 'Bebas Neue', 'Arial Narrow', sans-serif;
            font-size: clamp(3rem, 8vw, 7rem);
            letter-spacing: 10px; color: #fff;
            display: block; line-height: 1; margin-bottom: 0.5rem;
            text-shadow: 0 0 60px rgba(255, 0, 85, 0.4);
        }
        .iris-brand-sub {
            font-family: 'Space Grotesk', 'Segoe UI', sans-serif;
            font-size: clamp(0.6rem, 1.5vw, 0.9rem);
            letter-spacing: 5px; color: rgba(255,255,255,0.45);
            text-transform: uppercase; display: block;
        }
        .iris-brand-line {
            width: 0; height: 2px;
            background: linear-gradient(90deg, transparent, #ff0055, transparent);
            margin: 0.6rem auto 0;
            transition: width 0.6s ease 0.2s;
        }
        .iris-brand-line.expanded { width: clamp(80px, 15vw, 160px); }
        .iris-skip {
            position: absolute; bottom: 2rem; right: 2.5rem;
            font-family: 'Space Grotesk', sans-serif;
            font-size: 0.7rem; letter-spacing: 2px;
            color: rgba(255,255,255,0.2); text-transform: uppercase; z-index: 3;
            transition: color 0.3s;
        }
        #iris-intro:hover .iris-skip { color: rgba(255,255,255,0.5); }
        .iris-scan {
            position: absolute; inset: 0;
            background: repeating-linear-gradient(
                0deg, transparent 0px, transparent 3px,
                rgba(0,0,0,0.08) 3px, rgba(0,0,0,0.08) 4px
            );
            pointer-events: none; z-index: 1;
        }
        .iris-vignette {
            position: absolute; inset: 0;
            background: radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.7) 100%);
            pointer-events: none; z-index: 1;
        }
        /* Lock scroll while iris is active */
        body.iris-active { overflow: hidden !important; }
    `;
    document.head.appendChild(style);

    // --- Build overlay ---
    function buildOverlay() {
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
        return overlay;
    }

    // --- Build SVG blades ---
    function buildSVG() {
        const svg   = document.getElementById('iris-svg');
        const NS    = 'http://www.w3.org/2000/svg';
        const CX    = 50, CY = 50, MAX_R = 85;

        const bg = document.createElementNS(NS, 'rect');
        bg.setAttribute('width','100'); bg.setAttribute('height','100');
        bg.setAttribute('fill','#000');
        svg.appendChild(bg);

        const defs = document.createElementNS(NS, 'defs');
        defs.innerHTML = `<radialGradient id="iris-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stop-color="rgba(255,0,85,0.12)"/>
            <stop offset="100%" stop-color="rgba(0,0,0,0)"/>
        </radialGradient>`;
        svg.appendChild(defs);

        const glow = document.createElementNS(NS, 'circle');
        glow.setAttribute('cx',CX); glow.setAttribute('cy',CY);
        glow.setAttribute('r','50'); glow.setAttribute('fill','url(#iris-glow)');
        svg.appendChild(glow);

        const bladeGroup = document.createElementNS(NS, 'g');
        svg.appendChild(bladeGroup);

        const blades = [];
        const bladeAngle = 360 / CONFIG.bladeCount;

        for (let i = 0; i < CONFIG.bladeCount; i++) {
            const base     = i * bladeAngle;
            const startRad = (base - 2)               * Math.PI / 180;
            const endRad   = (base + bladeAngle + 8)   * Math.PI / 180;
            const x1 = CX + MAX_R * Math.cos(startRad);
            const y1 = CY + MAX_R * Math.sin(startRad);
            const x2 = CX + MAX_R * Math.cos(endRad);
            const y2 = CY + MAX_R * Math.sin(endRad);

            const blade = document.createElementNS(NS, 'path');
            blade.setAttribute('d', `M${CX},${CY} L${x1},${y1} A${MAX_R},${MAX_R} 0 0,1 ${x2},${y2} Z`);
            blade.setAttribute('fill', i % 2 === 0 ? '#0c0c0c' : '#080808');
            blade.setAttribute('stroke','rgba(255,255,255,0.04)');
            blade.setAttribute('stroke-width','0.3');
            blade.style.transformOrigin = `${CX}px ${CY}px`;
            blade.style.transition = `transform ${CONFIG.openDuration}ms cubic-bezier(0.4,0,0.15,1)`;
            blade.style.transitionDelay = `${i * (CONFIG.openDuration * 0.02)}ms`;
            bladeGroup.appendChild(blade);
            blades.push(blade);
        }

        const ringGroup = document.createElementNS(NS, 'g');
        svg.appendChild(ringGroup);
        const ringEls = [];

        for (let r = 0; r < 2; r++) {
            const ring = document.createElementNS(NS, 'circle');
            ring.setAttribute('cx',CX); ring.setAttribute('cy',CY);
            ring.setAttribute('r','0'); ring.setAttribute('fill','none');
            ring.setAttribute('stroke', r === 0 ? 'rgba(255,0,85,0.5)' : 'rgba(0,212,255,0.25)');
            ring.setAttribute('stroke-width','0.4');
            ring.style.transition = `r ${CONFIG.openDuration*0.9}ms cubic-bezier(0.4,0,0.2,1), opacity 0.5s ease`;
            ring.style.transitionDelay = `${r * 120}ms`;
            ring.style.opacity = '0';
            ringGroup.appendChild(ring);
            ringEls.push(ring);
        }

        return { blades, ringEls, bladeAngle, MAX_R };
    }

    // --- Dismiss ---
    function dismiss(overlay) {
        document.body.classList.remove('iris-active');
        overlay.classList.add('fading');
        setTimeout(() => overlay.classList.add('gone'), CONFIG.fadeDuration + 50);
    }

    // --- Start opening sequence ---
    function startSequence(overlay, blades, ringEls, bladeAngle, MAX_R, safetyTimer) {
        clearTimeout(safetyTimer);

        const line = document.getElementById('iris-line');
        if (line) line.classList.add('expanded');

        setTimeout(() => {
            blades.forEach(blade => {
                blade.style.transform = `rotate(${bladeAngle * 1.5}deg)`;
            });

            ringEls.forEach(ring => {
                ring.style.opacity = '1';
                ring.setAttribute('r', String(MAX_R * 0.85));
                setTimeout(() => { ring.style.opacity = '0'; }, CONFIG.openDuration * 0.6);
            });

            setTimeout(() => dismiss(overlay), CONFIG.openDuration + CONFIG.holdDuration);

        }, CONFIG.openDelay);
    }

    // --- Main init ---
    function init() {
        document.body.classList.add('iris-active');

        const overlay = buildOverlay();
        const { blades, ringEls, bladeAngle, MAX_R } = buildSVG();

        // Skip on click
        overlay.addEventListener('click', () => dismiss(overlay));

        // Safety net
        const safetyTimer = setTimeout(() => dismiss(overlay), CONFIG.skipAfter);

        // ── KEY FIX: wait for Bebas Neue before opening ──
        // This ensures the name renders in the correct font
        // before the iris starts opening, eliminating the
        // cursive flash entirely.
        if (document.fonts && document.fonts.load) {
            Promise.all([
                document.fonts.load('1em "Bebas Neue"'),
                document.fonts.load('400 1em "Space Grotesk"'),
            ]).then(() => {
                startSequence(overlay, blades, ringEls, bladeAngle, MAX_R, safetyTimer);
            }).catch(() => {
                setTimeout(() => startSequence(overlay, blades, ringEls, bladeAngle, MAX_R, safetyTimer), 800);
            });
        } else {
            setTimeout(() => startSequence(overlay, blades, ringEls, bladeAngle, MAX_R, safetyTimer), 1000);
        }
    }

    // Run as soon as body is available
    if (document.body) {
        init();
    } else {
        document.addEventListener('DOMContentLoaded', init);
    }

})();