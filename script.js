const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Custom Cursor
function initCursor() {
    if (window.innerWidth < 768) return; // Skip on mobile
    if (document.querySelector('.cursor')) return;
    document.body.classList.add('custom-cursor');
    
    const cursor = document.createElement('div');
    cursor.className = 'cursor';
    document.body.appendChild(cursor);

    const cursorFollower = document.createElement('div');
    cursorFollower.className = 'cursor-follower';
    document.body.appendChild(cursorFollower);

    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;
    let followerX = 0;
    let followerY = 0;

    document.addEventListener('mousemove', function(e) {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    function animateCursor() {
        const delay = 0.1;
        const followerDelay = 0.05;
        
        cursorX += (mouseX - cursorX) * delay;
        cursorY += (mouseY - cursorY) * delay;
        
        followerX += (mouseX - followerX) * followerDelay;
        followerY += (mouseY - followerY) * followerDelay;
        
        cursor.style.left = cursorX + 'px';
        cursor.style.top = cursorY + 'px';
        
        cursorFollower.style.left = followerX + 'px';
        cursorFollower.style.top = followerY + 'px';
        
        requestAnimationFrame(animateCursor);
    }

    animateCursor();

    const interactiveElements = document.querySelectorAll('a, button, .cta-button, .nav-links a');
    interactiveElements.forEach(function(el) {
        el.addEventListener('mouseenter', function() {
            cursor.classList.add('hover');
        });
        el.addEventListener('mouseleave', function() {
            cursor.classList.remove('hover');
        });
    });
}

// Particle System
function createParticles() {
    const hero = document.querySelector('.hero');
    if (!hero) return;
    
    const canvas = document.createElement('canvas');
    canvas.id = 'particles-canvas';
    hero.insertBefore(canvas, hero.firstChild);
    
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const particles = [];
    const particleCount = 50;
    let mouseX = 0;
    let mouseY = 0;
    
    document.addEventListener('mousemove', function(e) {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });
    
    function Particle() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 3 + 1;
        this.speedX = Math.random() * 2 - 1;
        this.speedY = Math.random() * 2 - 1;
        this.opacity = Math.random() * 0.5 + 0.2;
        
        this.update = function() {
            this.x += this.speedX;
            this.y += this.speedY;
            
            if (this.x > canvas.width || this.x < 0) this.speedX *= -1;
            if (this.y > canvas.height || this.y < 0) this.speedY *= -1;
            
            const dx = mouseX - this.x;
            const dy = mouseY - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 100) {
                this.x -= dx / 10;
                this.y -= dy / 10;
            }
        };
        
        this.draw = function() {
            ctx.fillStyle = 'rgba(255, 165, 0, ' + this.opacity + ')';
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        };
    }
    
    function init() {
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }
    }
    
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
            particles[i].draw();
            
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 150) {
                    ctx.strokeStyle = 'rgba(0, 168, 255, ' + (0.2 - distance / 750) + ')';
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }
        
        requestAnimationFrame(animate);
    }
    
    init();
    animate();
    
    window.addEventListener('resize', function() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
}

// Navbar scroll
window.addEventListener('scroll', function() {
    const navbar = document.getElementById('navbar');
    if (navbar) {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }
});

// Mobile menu
function toggleMenu() {
    const navLinks = document.getElementById('navLinks');
    const btn = document.querySelector('.mobile-menu');
    if (navLinks) {
        const open = navLinks.classList.toggle('active');
        if (btn) btn.setAttribute('aria-expanded', String(open));
    }
}

// Close mobile menu on link click
document.addEventListener('DOMContentLoaded', function() {
    if (window.__meuzBindingsInitialized) return;
    window.__meuzBindingsInitialized = true;

    // Menu mobile (bouton accessible)
    const menuBtn = document.querySelector('.mobile-menu');
    if (menuBtn) {
        menuBtn.addEventListener('click', toggleMenu);
        document.querySelectorAll('.nav-links a').forEach(function(a) {
            a.addEventListener('click', function() { menuBtn.setAttribute('aria-expanded', 'false'); });
        });
    }

    // Carte Google Maps : chargée uniquement après un clic (consentement)
    const mapBtn = document.getElementById('mapLoad');
    if (mapBtn) {
        mapBtn.addEventListener('click', function() {
            const box = document.getElementById('mapConsent');
            const frame = document.createElement('iframe');
            frame.title = box.dataset.title;
            frame.src = box.dataset.src;
            frame.loading = 'lazy';
            frame.referrerPolicy = 'strict-origin-when-cross-origin';
            frame.allowFullscreen = true;
            box.replaceWith(frame);
        });
    }

    document.querySelectorAll('.nav-links a').forEach(function(link) {
        link.addEventListener('click', function() {
            const navLinks = document.getElementById('navLinks');
            if (navLinks) {
                navLinks.classList.remove('active');
            }
        });
    });

    // Bind FAQ clicks in JS (works even if inline onclick is blocked)
    document.querySelectorAll('.faq-question').forEach(function(question) {
        question.setAttribute('role', 'button');
        question.setAttribute('tabindex', '0');
        question.setAttribute('aria-expanded', 'false');
        question.addEventListener('click', function() {
            toggleFAQ(question);
        });
        question.addEventListener('keydown', function(event) {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                toggleFAQ(question);
            }
        });
    });

    // Cartes retournables : accessibles au clavier (focus = retournement via CSS)
    document.querySelectorAll('.event-card').forEach(function(card) {
        card.setAttribute('tabindex', '0');
    });

    // Enable tap interaction for flip cards on touch devices
    if (window.matchMedia('(hover: none) and (pointer: coarse)').matches) {
        document.querySelectorAll('.event-card-front p').forEach(function(hint) {
            if (hint.textContent && hint.textContent.toLowerCase().includes('hover')) {
                hint.textContent = 'Touchez pour voir les détails';
            }
        });

        document.querySelectorAll('.event-card').forEach(function(card) {
            card.setAttribute('tabindex', '0');
            card.setAttribute('role', 'button');

            function toggleCard() {
                const isOpen = card.classList.contains('is-flipped');
                document.querySelectorAll('.event-card.is-flipped').forEach(function(openCard) {
                    openCard.classList.remove('is-flipped');
                });
                if (!isOpen) {
                    card.classList.add('is-flipped');
                }
            }

            card.addEventListener('click', function() {
                toggleCard();
            });

            card.addEventListener('keydown', function(event) {
                if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    toggleCard();
                }
            });
        });
    }
});

// FAQ toggle
function toggleFAQ(element) {
    const answer = element.nextElementSibling;
    const willOpen = !answer.classList.contains('active');

    document.querySelectorAll('.faq-question').forEach(function(q) {
        q.classList.remove('active');
        q.setAttribute('aria-expanded', 'false');
    });
    document.querySelectorAll('.faq-answer').forEach(function(a) {
        a.classList.remove('active');
        a.style.maxHeight = '0px';
    });

    if (willOpen) {
        element.classList.add('active');
        element.setAttribute('aria-expanded', 'true');
        answer.classList.add('active');
        answer.style.maxHeight = answer.scrollHeight + 'px';
    }
}

// Animated counters
function animateCounter(element) {
    const target = parseInt(element.getAttribute('data-target'));
    const duration = 2000;
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;
    
    const timer = setInterval(function() {
        current += increment;
        if (current >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current);
        }
    }, 16);
}

// Intersection Observer
const revealObserver = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
            revealObserver.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
});

const counterObserver = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
        if (entry.isIntersecting) {
            const counter = entry.target.querySelector('.stat-number');
            if (counter && counter.textContent === '0') {
                animateCounter(counter);
            }
            counterObserver.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.2,
    rootMargin: '0px 0px -10% 0px'
});

// Initialize on load
window.addEventListener('load', function() {
    if (!prefersReducedMotion) {
        initCursor();
        createParticles();
        document.querySelectorAll('.stat-number').forEach(function(c) { c.textContent = '0'; });
    }
    
    document.querySelectorAll('.stat-item').forEach(function(item) {
        counterObserver.observe(item);
    });
    
    document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(function(el) {
        revealObserver.observe(el);
    });
});
