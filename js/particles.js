// ==========================================
// HARSHIT - FILMMAKER PORTFOLIO
// js/particles.js — Film Grain Particle System
// ==========================================

(function initParticles() {

    // --- Create canvas and insert into #hero ---
    const canvas = document.createElement('canvas');
    canvas.id = 'particle-canvas';
    canvas.style.cssText = `
        position: absolute;
        top: 0; left: 0;
        width: 100%; height: 100%;
        z-index: 0;
        pointer-events: none;
        opacity: 0.85;
    `;

    const hero = document.getElementById('hero');
    if (!hero) return;
    hero.style.position = 'relative';
    hero.insertBefore(canvas, hero.firstChild);

    const ctx = canvas.getContext('2d');

    // --- Config ---
    const CONFIG = {
        particleCount: 120,
        primaryColor:   '255, 0, 85',    // --primary  #ff0055
        secondaryColor: '0, 212, 255',   // --secondary #00d4ff
        accentColor:    '255, 184, 0',   // --accent   #ffb800
        minRadius: 0.5,
        maxRadius: 2.2,
        minSpeed:  0.15,
        maxSpeed:  0.55,
        connectionDistance: 130,
        grainOpacityMin: 0.08,
        grainOpacityMax: 0.55,
    };

    let particles = [];
    let animationId;
    let W, H;

    // --- Resize handler ---
    function resize() {
        W = canvas.width  = canvas.offsetWidth;
        H = canvas.height = canvas.offsetHeight;
    }
    window.addEventListener('resize', resize);
    resize();

    // --- Particle class ---
    class Particle {
        constructor() { this.reset(true); }

        reset(initial = false) {
            this.x  = Math.random() * W;
            this.y  = initial ? Math.random() * H : H + 5;
            this.r  = CONFIG.minRadius + Math.random() * (CONFIG.maxRadius - CONFIG.minRadius);
            this.vx = (Math.random() - 0.5) * CONFIG.maxSpeed;
            this.vy = -(CONFIG.minSpeed + Math.random() * (CONFIG.maxSpeed - CONFIG.minSpeed));

            // Assign color
            const roll = Math.random();
            if (roll < 0.55)      this.color = CONFIG.primaryColor;
            else if (roll < 0.80) this.color = CONFIG.secondaryColor;
            else                  this.color = CONFIG.accentColor;

            this.opacity      = CONFIG.grainOpacityMin + Math.random() * (CONFIG.grainOpacityMax - CONFIG.grainOpacityMin);
            this.twinkleSpeed = 0.005 + Math.random() * 0.02;
            this.twinkleDir   = Math.random() > 0.5 ? 1 : -1;

            // Film-grain flicker
            this.flickerTimer    = Math.random() * 60;
            this.flickerInterval = 20 + Math.random() * 80;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            // Twinkle
            this.opacity += this.twinkleSpeed * this.twinkleDir;
            if (this.opacity >= CONFIG.grainOpacityMax) this.twinkleDir = -1;
            if (this.opacity <= CONFIG.grainOpacityMin) this.twinkleDir =  1;

            // Flicker (film grain effect)
            this.flickerTimer++;
            if (this.flickerTimer >= this.flickerInterval) {
                this.opacity = Math.random() * CONFIG.grainOpacityMax;
                this.flickerTimer    = 0;
                this.flickerInterval = 20 + Math.random() * 80;
            }

            // Wrap horizontal
            if (this.x < 0) this.x = W;
            if (this.x > W) this.x = 0;

            // Reset when off top
            if (this.y < -5) this.reset();
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${this.color}, ${this.opacity})`;
            ctx.fill();
        }
    }

    // --- Init particles ---
    function init() {
        particles = [];
        for (let i = 0; i < CONFIG.particleCount; i++) {
            particles.push(new Particle());
        }
    }

    // --- Draw connections between nearby particles ---
    function drawConnections() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx   = particles[i].x - particles[j].x;
                const dy   = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < CONFIG.connectionDistance) {
                    const alpha = (1 - dist / CONFIG.connectionDistance) * 0.12;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(${particles[i].color}, ${alpha})`;
                    ctx.lineWidth   = 0.5;
                    ctx.stroke();
                }
            }
        }
    }

    // --- Scanline overlay (classic film look) ---
    function drawScanlines() {
        ctx.save();
        for (let y = 0; y < H; y += 4) {
            ctx.fillStyle = 'rgba(0,0,0,0.03)';
            ctx.fillRect(0, y, W, 1);
        }
        ctx.restore();
    }

    // --- Main loop ---
    function animate() {
        ctx.clearRect(0, 0, W, H);

        drawConnections();

        particles.forEach(p => {
            p.update();
            p.draw();
        });

        drawScanlines();

        animationId = requestAnimationFrame(animate);
    }

    // --- Pause when tab is hidden (performance) ---
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            cancelAnimationFrame(animationId);
        } else {
            animate();
        }
    });

    // --- Reduce particles on mobile ---
    function adaptToDevice() {
        if (window.innerWidth < 768) {
            CONFIG.particleCount = 55;
            CONFIG.connectionDistance = 80;
        }
        init();
    }

    adaptToDevice();
    animate();

})();