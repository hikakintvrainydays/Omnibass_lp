// Company Page JavaScript - Professional Lake Biwa × Digital Interactions

// Hamburger Menu Toggle
function initHamburgerMenu() {
    const hamburger = document.getElementById('hamburger');
    const nav = document.getElementById('nav');

    if (!hamburger || !nav) return;

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        nav.classList.toggle('active');
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!hamburger.contains(e.target) && !nav.contains(e.target)) {
            hamburger.classList.remove('active');
            nav.classList.remove('active');
        }
    });

    // Close menu when clicking a link
    const navLinks = nav.querySelectorAll('a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            nav.classList.remove('active');
        });
    });
}

// Add digital grid overlay to hero section
function addHeroGrid() {
    const heroSection = document.querySelector('.company-hero');
    if (!heroSection) return;

    const gridOverlay = document.createElement('div');
    gridOverlay.className = 'hero-grid';
    heroSection.appendChild(gridOverlay);
}

// Create abstract data flow lines
function createDataLines() {
    const heroSection = document.querySelector('.company-hero');
    if (!heroSection) return;

    const dataLinesContainer = document.createElement('div');
    dataLinesContainer.className = 'data-lines';

    // Create multiple flowing lines
    for (let i = 0; i < 5; i++) {
        const line = document.createElement('div');
        line.className = 'data-line';
        line.style.top = `${20 + i * 15}%`;
        line.style.width = `${40 + Math.random() * 30}%`;
        line.style.animationDelay = `${i * 1.5}s`;
        line.style.animationDuration = `${8 + Math.random() * 4}s`;
        dataLinesContainer.appendChild(line);
    }

    heroSection.appendChild(dataLinesContainer);
}

// Enhanced Intersection Observer for scroll animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0) scale(1)';
                entry.target.classList.add('animated');
            }
        });
    }, observerOptions);

    // Animate section titles
    const sectionTitles = document.querySelectorAll('.section-title');
    sectionTitles.forEach(title => {
        title.style.opacity = '0';
        title.style.transform = 'translateY(-30px) scale(0.95)';
        title.style.transition = 'opacity 1s ease, transform 1s cubic-bezier(0.34, 1.56, 0.64, 1)';
        observer.observe(title);
    });

    // Animate section subtitles
    const sectionSubtitles = document.querySelectorAll('.section-subtitle');
    sectionSubtitles.forEach(subtitle => {
        subtitle.style.opacity = '0';
        subtitle.style.transform = 'translateY(20px)';
        subtitle.style.transition = 'opacity 0.8s ease 0.2s, transform 0.8s ease 0.2s';
        observer.observe(subtitle);
    });

    // Animate info rows with wave effect
    const infoRows = document.querySelectorAll('.info-row');
    infoRows.forEach((row, index) => {
        row.style.opacity = '0';
        row.style.transform = 'translateX(-40px) scale(0.95)';
        row.style.transition = `opacity 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) ${index * 0.08}s, transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) ${index * 0.08}s`;
        observer.observe(row);
    });

    // Animate map container
    const mapContainer = document.querySelector('.map-container');
    if (mapContainer) {
        mapContainer.style.opacity = '0';
        mapContainer.style.transform = 'scale(0.9) rotateY(10deg)';
        mapContainer.style.transition = 'opacity 1.2s ease, transform 1.2s cubic-bezier(0.34, 1.56, 0.64, 1)';
        observer.observe(mapContainer);
    }
}


// Create fish groups that swim across sections
function createFishSchool() {
    const sections = document.querySelectorAll('.mvv-section, .company-info-section');

    sections.forEach((section, sectionIndex) => {
        // Create canvas for this section
        const canvas = document.createElement('canvas');
        canvas.className = 'fish-school-canvas';
        canvas.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 0;
            opacity: 0.8;
        `;

        section.style.position = 'relative';
        section.appendChild(canvas);

        const ctx = canvas.getContext('2d');
        let width = canvas.width = section.offsetWidth;
        let height = canvas.height = section.offsetHeight;

        window.addEventListener('resize', () => {
            width = canvas.width = section.offsetWidth;
            height = canvas.height = section.offsetHeight;
        });

        // Create fish group that crosses the section
        function createFishGroup() {
            const numFish = Math.floor(Math.random() * 15) + 12; // 12-26匹に増加
            const startY = Math.random() * height;
            const direction = Math.random() > 0.5 ? 1 : -1; // 左右どちらから来るか
            const startX = direction > 0 ? -150 : width + 150;
            const speed = (Math.random() * 2 + 2) * direction; // 速度を上げる

            const fishes = [];

            for (let i = 0; i < numFish; i++) {
                const colors = ['#60A5FA', '#38BDF8', '#818CF8', '#93C5FD'];
                const isRare = Math.random() < 0.12; // レア魚の確率を上げる

                fishes.push({
                    x: startX + (Math.random() * 120 - 60), // 横の分散を広げる
                    y: startY + (Math.random() * 200 - 100), // 縦の分散を大幅に広げる
                    offsetX: Math.random() * 150 - 75, // オフセットを増やす
                    offsetY: Math.random() * 150 - 75,
                    phase: Math.random() * Math.PI * 2,
                    color: isRare ? '#F59E0B' : colors[Math.floor(Math.random() * colors.length)],
                    size: isRare ? Math.random() * 6 + 4 : Math.random() * 4 + 2.5, // サイズを大きく
                    type: Math.floor(Math.random() * 3),
                    isRare: isRare
                });
            }

            let groupX = startX;
            let opacity = 0;
            let fadeIn = true;

            function animate() {
                ctx.clearRect(0, 0, width, height);

                // フェードイン/フェードアウト
                if (fadeIn) {
                    opacity += 0.02; // フェードインを速く
                    if (opacity >= 1) {
                        opacity = 1;
                        fadeIn = false;
                    }
                } else {
                    // 画面端に近づいたらフェードアウト
                    const distanceToEdge = direction > 0 ? width - groupX : groupX;
                    if (distanceToEdge < 250) {
                        opacity -= 0.015; // フェードアウトを少しゆっくり
                    }
                }

                // 群れ全体を移動
                groupX += speed;

                // 画面外に出たら終了
                if ((direction > 0 && groupX > width + 200) || (direction < 0 && groupX < -200) || opacity <= 0) {
                    // 次の群れをランダムな時間後に生成（頻度を上げる）
                    setTimeout(() => createFishGroup(), Math.random() * 5000 + 3000);
                    return;
                }

                // 各魚を描画
                fishes.forEach((fish) => {
                    fish.phase += 0.03; // 揺らぎを速く

                    // 群れの中での揺らぎ - より大きな動き
                    const waveX = Math.sin(fish.phase) * fish.offsetX * 0.35;
                    const waveY = Math.cos(fish.phase * 1.3) * fish.offsetY * 0.35;

                    const x = groupX + fish.offsetX + waveX;
                    const y = fish.y + waveY;

                    // 魚を描画 - 向きを泳ぐ方向に合わせる
                    const angle = Math.atan2(waveY * 0.5, speed);
                    ctx.save();
                    ctx.translate(x, y);
                    ctx.rotate(angle);
                    // 左向きに泳ぐ場合は上下反転させる
                    if (direction < 0) {
                        ctx.scale(1, -1);
                    }
                    ctx.globalAlpha = opacity * 0.85; // 透明度を上げる
                    ctx.fillStyle = fish.color;
                    ctx.beginPath();

                    if (fish.type === 0) {
                        // 丸い魚（右向き）
                        ctx.arc(0, 0, fish.size, 0, Math.PI * 2);
                        ctx.moveTo(0, 0);
                        ctx.lineTo(-fish.size * 2, -fish.size * 0.8);
                        ctx.lineTo(-fish.size * 2, fish.size * 0.8);
                        ctx.fill();
                    } else if (fish.type === 1) {
                        // 楕円の魚（右向き）
                        ctx.ellipse(0, 0, fish.size * 2, fish.size * 0.6, 0, 0, Math.PI * 2);
                        ctx.fill();
                        ctx.beginPath();
                        ctx.moveTo(-fish.size * 1.5, 0);
                        ctx.lineTo(-fish.size * 2.5, -fish.size);
                        ctx.lineTo(-fish.size * 2.5, fish.size);
                        ctx.fill();
                    } else {
                        // 三角の魚（右向き）
                        ctx.moveTo(fish.size * 1.5, 0);
                        ctx.lineTo(-fish.size, fish.size);
                        ctx.lineTo(-fish.size * 0.5, 0);
                        ctx.lineTo(-fish.size, -fish.size);
                        ctx.fill();
                    }

                    ctx.restore();

                    // レアな魚には軌跡 - より強く
                    if (fish.isRare) {
                        ctx.globalAlpha = opacity * 0.5;
                        ctx.fillStyle = fish.color;
                        ctx.beginPath();
                        ctx.arc(x - speed * 3, y, fish.size * 0.6, 0, Math.PI * 2);
                        ctx.fill();
                        ctx.globalAlpha = opacity * 0.3;
                        ctx.beginPath();
                        ctx.arc(x - speed * 6, y, fish.size * 0.4, 0, Math.PI * 2);
                        ctx.fill();
                        ctx.globalAlpha = opacity * 0.15;
                        ctx.beginPath();
                        ctx.arc(x - speed * 9, y, fish.size * 0.25, 0, Math.PI * 2);
                        ctx.fill();
                    }
                });

                requestAnimationFrame(animate);
            }

            animate();
        }

        // 各セクションで異なるタイミングで開始
        setTimeout(() => createFishGroup(), sectionIndex * 3000 + Math.random() * 2000);
    });
}


// Ultra Dynamic Parallax effect on scroll
function initParallaxEffect() {
    let ticking = false;

    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                const scrolled = window.pageYOffset;
                const hero = document.querySelector('.company-hero');

                if (hero && scrolled < window.innerHeight * 1.5) {
                    // Hero content parallax
                    const heroContent = hero.querySelector('.container');
                    if (heroContent) {
                        heroContent.style.transform = `translateY(${scrolled * 0.5}px)`;
                        heroContent.style.opacity = Math.max(0, 1 - scrolled / 600);
                    }

                    // Data lines parallax
                    const dataLines = hero.querySelector('.data-lines');
                    if (dataLines) {
                        dataLines.style.transform = `translateY(${scrolled * -0.2}px) scale(${1 + scrolled * 0.0005})`;
                    }

                    // Hero grid parallax
                    const heroGrid = hero.querySelector('.hero-grid');
                    if (heroGrid) {
                        heroGrid.style.opacity = Math.max(0, 1 - scrolled / 500);
                        heroGrid.style.transform = `scale(${1 + scrolled * 0.001})`;
                    }
                }

                ticking = false;
            });
            ticking = true;
        }
    });
}

// Add cursor tracking glow effect
function initCursorGlow() {
    const mvvCards = document.querySelectorAll('.mvv-card');

    mvvCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);

            // Calculate rotation based on mouse position
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;

            card.style.transform = `translateY(-15px) scale(1.05) perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });
}

// Magnetic button effect
function initMagneticEffect() {
    const magneticElements = document.querySelectorAll('.nav-btn');

    magneticElements.forEach(element => {
        element.addEventListener('mousemove', (e) => {
            const rect = element.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            element.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
        });

        element.addEventListener('mouseleave', () => {
            element.style.transform = '';
        });
    });
}

// Enhanced professional data visualization particles with connections
function createDataParticles() {
    const sections = document.querySelectorAll('.mvv-section, .company-info-section');

    sections.forEach(section => {
        const canvas = document.createElement('canvas');
        canvas.style.position = 'absolute';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        canvas.style.pointerEvents = 'none';
        canvas.style.opacity = '0.2';
        canvas.style.zIndex = '1';

        section.style.position = 'relative';
        section.appendChild(canvas);

        const ctx = canvas.getContext('2d');
        canvas.width = section.offsetWidth;
        canvas.height = section.offsetHeight;

        const particles = [];
        const particleCount = 35;
        let mouseX = -1000;
        let mouseY = -1000;

        // Mouse tracking for interaction
        section.addEventListener('mousemove', (e) => {
            const rect = section.getBoundingClientRect();
            mouseX = e.clientX - rect.left;
            mouseY = e.clientY - rect.top;
        });

        section.addEventListener('mouseleave', () => {
            mouseX = -1000;
            mouseY = -1000;
        });

        // Create particles with varied properties
        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                size: Math.random() * 2 + 0.5,
                pulsePhase: Math.random() * Math.PI * 2
            });
        }

        // Enhanced particle animation
        function animateParticles() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            particles.forEach(particle => {
                // Mouse interaction - particles move away from cursor
                const dx = particle.x - mouseX;
                const dy = particle.y - mouseY;
                const distanceToMouse = Math.sqrt(dx * dx + dy * dy);

                if (distanceToMouse < 150) {
                    const force = (150 - distanceToMouse) / 150;
                    particle.vx += (dx / distanceToMouse) * force * 0.5;
                    particle.vy += (dy / distanceToMouse) * force * 0.5;
                }

                // Apply velocity with damping
                particle.x += particle.vx;
                particle.y += particle.vy;
                particle.vx *= 0.98;
                particle.vy *= 0.98;

                // Wrap around edges
                if (particle.x < 0) particle.x = canvas.width;
                if (particle.x > canvas.width) particle.x = 0;
                if (particle.y < 0) particle.y = canvas.height;
                if (particle.y > canvas.height) particle.y = 0;

                // Pulsing effect
                particle.pulsePhase += 0.02;
                const pulse = Math.sin(particle.pulsePhase) * 0.3 + 0.7;

                // Draw particle as glowing square
                const gradient = ctx.createRadialGradient(
                    particle.x, particle.y, 0,
                    particle.x, particle.y, particle.size * 2
                );
                gradient.addColorStop(0, `rgba(14, 165, 233, ${0.8 * pulse})`);
                gradient.addColorStop(1, 'rgba(14, 165, 233, 0)');

                ctx.fillStyle = gradient;
                ctx.fillRect(
                    particle.x - particle.size * 2,
                    particle.y - particle.size * 2,
                    particle.size * 4,
                    particle.size * 4
                );

                // Connect nearby particles with animated lines
                particles.forEach(otherParticle => {
                    const dx = particle.x - otherParticle.x;
                    const dy = particle.y - otherParticle.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < 150) {
                        ctx.beginPath();
                        ctx.moveTo(particle.x, particle.y);
                        ctx.lineTo(otherParticle.x, otherParticle.y);

                        const lineOpacity = (1 - distance / 150) * 0.4 * pulse;
                        const lineGradient = ctx.createLinearGradient(
                            particle.x, particle.y,
                            otherParticle.x, otherParticle.y
                        );
                        lineGradient.addColorStop(0, `rgba(14, 165, 233, ${lineOpacity})`);
                        lineGradient.addColorStop(0.5, `rgba(6, 182, 212, ${lineOpacity * 1.2})`);
                        lineGradient.addColorStop(1, `rgba(14, 165, 233, ${lineOpacity})`);

                        ctx.strokeStyle = lineGradient;
                        ctx.lineWidth = 1;
                        ctx.stroke();
                    }
                });
            });

            requestAnimationFrame(animateParticles);
        }

        animateParticles();
    });
}

// Handle window resize for canvas
function handleResize() {
    window.addEventListener('resize', () => {
        const canvases = document.querySelectorAll('canvas');
        canvases.forEach(canvas => {
            const section = canvas.parentElement;
            if (section) {
                canvas.width = section.offsetWidth;
                canvas.height = section.offsetHeight;
            }
        });
    });
}

// Add glitch effect on section title when entering viewport
function addGlitchEffect() {
    const sectionTitles = document.querySelectorAll('.section-title');

    const observerOptions = {
        threshold: 0.3,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('glitch-animated')) {
                entry.target.classList.add('glitch-animated');

                // グリッチエフェクトをアニメーション
                entry.target.style.textShadow = '3px 3px 0px rgba(14, 165, 233, 0.5), -3px -3px 0px rgba(59, 130, 246, 0.5)';

                setTimeout(() => {
                    entry.target.style.textShadow = '-2px 2px 0px rgba(14, 165, 233, 0.4), 2px -2px 0px rgba(59, 130, 246, 0.4)';
                }, 100);

                setTimeout(() => {
                    entry.target.style.textShadow = '1px -1px 0px rgba(14, 165, 233, 0.3), -1px 1px 0px rgba(59, 130, 246, 0.3)';
                }, 200);

                setTimeout(() => {
                    entry.target.style.textShadow = 'none';
                }, 300);
            }
        });
    }, observerOptions);

    sectionTitles.forEach(title => {
        observer.observe(title);
    });
}

// Add smooth reveal on info table
function initInfoTableReveal() {
    const infoTable = document.querySelector('.info-table');
    if (!infoTable) return;

    const observerOptions = {
        threshold: 0.2,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    infoTable.style.opacity = '0';
    infoTable.style.transform = 'translateY(40px)';
    infoTable.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
    observer.observe(infoTable);
}

// Enhanced hero grid with pulsing effect
function addEnhancedHeroGrid() {
    addHeroGrid();
    const heroGrid = document.querySelector('.hero-grid');
    if (heroGrid) {
        heroGrid.style.animation = 'grid-flow 20s linear infinite, grid-pulse 3s ease-in-out infinite';
    }
}

// Add floating elements to hero
function createFloatingElements() {
    const hero = document.querySelector('.company-hero');
    if (!hero) return;

    const floatingContainer = document.createElement('div');
    floatingContainer.className = 'floating-elements';
    floatingContainer.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 0;
    `;

    // Create floating circles
    for (let i = 0; i < 8; i++) {
        const circle = document.createElement('div');
        circle.style.cssText = `
            position: absolute;
            width: ${Math.random() * 100 + 50}px;
            height: ${Math.random() * 100 + 50}px;
            border-radius: 50%;
            background: radial-gradient(circle, rgba(56, 189, 248, 0.15), transparent);
            top: ${Math.random() * 100}%;
            left: ${Math.random() * 100}%;
            animation: float-circle ${Math.random() * 10 + 15}s ease-in-out infinite;
            animation-delay: ${Math.random() * 5}s;
        `;
        floatingContainer.appendChild(circle);
    }

    hero.appendChild(floatingContainer);

    // Add CSS animation
    if (!document.getElementById('float-animation')) {
        const style = document.createElement('style');
        style.id = 'float-animation';
        style.textContent = `
            @keyframes float-circle {
                0%, 100% {
                    transform: translate(0, 0) scale(1);
                    opacity: 0.3;
                }
                50% {
                    transform: translate(${Math.random() * 100 - 50}px, ${Math.random() * 100 - 50}px) scale(1.5);
                    opacity: 0.6;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// Create interactive hero canvas with particles
function createHeroCanvas() {
    const hero = document.querySelector('.company-hero');
    if (!hero) return;

    const canvas = document.createElement('canvas');
    canvas.className = 'hero-canvas';
    canvas.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 1;
    `;

    hero.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    canvas.width = hero.offsetWidth;
    canvas.height = hero.offsetHeight;

    const particles = [];
    const particleCount = 80;
    let mouseX = canvas.width / 2;
    let mouseY = canvas.height / 2;

    // Track mouse movement
    hero.addEventListener('mousemove', (e) => {
        const rect = hero.getBoundingClientRect();
        mouseX = e.clientX - rect.left;
        mouseY = e.clientY - rect.top;
    });

    // Create particles
    for (let i = 0; i < particleCount; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 0.5,
            vy: (Math.random() - 0.5) * 0.5,
            size: Math.random() * 2 + 1,
            baseSize: Math.random() * 2 + 1,
            pulsePhase: Math.random() * Math.PI * 2
        });
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        particles.forEach((particle, i) => {
            // Mouse interaction
            const dx = particle.x - mouseX;
            const dy = particle.y - mouseY;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 150) {
                const force = (150 - distance) / 150;
                particle.vx += (dx / distance) * force * 0.3;
                particle.vy += (dy / distance) * force * 0.3;
            }

            // Update position
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.vx *= 0.99;
            particle.vy *= 0.99;

            // Wrap around edges
            if (particle.x < 0) particle.x = canvas.width;
            if (particle.x > canvas.width) particle.x = 0;
            if (particle.y < 0) particle.y = canvas.height;
            if (particle.y > canvas.height) particle.y = 0;

            // Pulsing effect
            particle.pulsePhase += 0.02;
            const pulse = Math.sin(particle.pulsePhase) * 0.5 + 0.5;
            particle.size = particle.baseSize * (0.5 + pulse * 0.5);

            // Draw particle with glow
            const gradient = ctx.createRadialGradient(
                particle.x, particle.y, 0,
                particle.x, particle.y, particle.size * 3
            );
            gradient.addColorStop(0, `rgba(255, 255, 255, ${0.8 * pulse})`);
            gradient.addColorStop(0.5, `rgba(147, 197, 253, ${0.4 * pulse})`);
            gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.size * 3, 0, Math.PI * 2);
            ctx.fill();

            // Connect particles
            particles.forEach((otherParticle, j) => {
                if (i === j) return;

                const dx = particle.x - otherParticle.x;
                const dy = particle.y - otherParticle.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 120) {
                    const opacity = (1 - distance / 120) * 0.3 * pulse;
                    ctx.beginPath();
                    ctx.moveTo(particle.x, particle.y);
                    ctx.lineTo(otherParticle.x, otherParticle.y);
                    ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            });
        });

        requestAnimationFrame(animate);
    }

    animate();

    // Handle resize
    window.addEventListener('resize', () => {
        canvas.width = hero.offsetWidth;
        canvas.height = hero.offsetHeight;
    });
}

// Initialize all features when DOM is ready
function init() {
    initHamburgerMenu();
    addEnhancedHeroGrid();
    createDataLines();
    createFloatingElements();
    createHeroCanvas();
    initScrollAnimations();
    initParallaxEffect();
    addGlitchEffect();
    initInfoTableReveal();
    initCursorGlow();
    initMagneticEffect();

    // Add data particles with a slight delay for performance
    setTimeout(() => {
        createDataParticles();
        handleResize();
    }, 500);
}

// Run initialization
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
