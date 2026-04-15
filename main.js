// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

// 1. LENIS SMOOTH SCROLL INIT
const lenis = new Lenis({
    duration: 1.8,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smooth: true,
    lerp: 0.05 // Smoother linear interpolation
});

function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

// Update GSAP ScrollTrigger whenever Lenis updates
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
});
gsap.ticker.lagSmoothing(0, 0);

// Global Section Reveal for smoother cinematic flow
gsap.utils.toArray('.section').forEach(section => {
    gsap.from(section, {
        opacity: 0,
        y: 20,
        duration: 1.5,
        ease: "power2.out",
        scrollTrigger: {
            trigger: section,
            start: "top 90%",
            toggleActions: "play none none reverse"
        }
    });
});



// 2. HERO ANIMATIONS - Layered 3D Scroll Parallax Lanterns
const lanternStacks = document.querySelectorAll('.lantern-stack');

lanternStacks.forEach((stack, index) => {
    // 1. Precise consistent placement (6 layers)
    const hPositions = [3, 97, 10, 90, 50, 48]; // Pinned to the very edges + center
    const vPositions = [10, 40, 70, 20, 50, 80];

    const posX = hPositions[index];
    const posY = vPositions[index];
    const isCenter = Math.abs(50 - posX) < 15;

    stack.style.left = `${posX}%`;
    stack.style.top = `${posY}%`;

    // 2. Populate stack with consistent, depth-aware clusters
    // Edge stacks get more lanterns (higher density)
    const count = isCenter ? 4 : 9;

    for (let i = 0; i < count; i++) {
        const lantern = document.createElement('div');
        lantern.className = 'lantern-item';

        // Consistent offsets (deterministic) instead of random(200)
        // This makes them stay the same every load
        const offsetX = (Math.sin(i * 1.5) * 120) + 100;
        const offsetY = (Math.cos(i * 0.8) * 200) + 150;

        lantern.style.left = `${offsetX}px`;
        lantern.style.top = `${offsetY}px`;

        stack.appendChild(lantern);

        // Styling based on center proximity
        const baseScale = isCenter ? 0.4 : (0.8 + (i % 3) * 0.3);
        const baseOpacity = isCenter ? 0.4 : 0.9;
        const baseRotation = (i % 2 === 0 ? 1 : -1) * (15 + (i % 5) * 5);

        gsap.set(lantern, {
            scale: baseScale,
            opacity: baseOpacity,
            rotation: baseRotation
        });

        // Individual swaying
        gsap.to(lantern, {
            y: "+=20",
            rotation: "+=6",
            duration: 4 + (i % 2),
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
            delay: i * 0.2
        });

        // Flicker
        gsap.to(lantern, {
            opacity: baseOpacity * 0.75,
            duration: 0.3 + (i % 4) * 0.1,
            repeat: -1,
            yoyo: true,
            ease: "steps(2)"
        });
    }

    // 3. --- 3D SCROLL PARALLAX ---
    const speedFactor = isCenter ? 2.8 : (4.5 + index * 0.5);

    gsap.to(stack, {
        scrollTrigger: {
            trigger: ".hero-section",
            start: "top top",
            end: "bottom top",
            scrub: 1.5
        },
        y: -(180 * speedFactor),
        ease: "none"
    });
});

// Intro fade-in for Hero Content
gsap.from(".hero-content > *", {
    y: 50,
    opacity: 0,
    duration: 1.5,
    stagger: 0.2,
    ease: "power3.out",
    delay: 0.2
});


// 3. EVENTS SECTION
// Fade in and stagger event cards on scroll
gsap.from(".event-card", {
    scrollTrigger: {
        trigger: ".events-section",
        start: "top 70%",
    },
    y: 100,
    opacity: 0,
    duration: 1.2,
    stagger: 0.3,
    ease: "power4.out"
});


// 4. GALLERY SECTION
// Gallery Carousel Logic
const images = document.querySelectorAll('.carousel-img');
const dots = document.querySelectorAll('.dot');
let currentImg = 0;

function showNextImage() {
    images[currentImg].classList.remove('active');
    dots[currentImg].classList.remove('active');

    currentImg = (currentImg + 1) % images.length;

    images[currentImg].classList.add('active');
    dots[currentImg].classList.add('active');
}
setInterval(showNextImage, 4000);

// Allow clicking on dots
dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
        images[currentImg].classList.remove('active');
        dots[currentImg].classList.remove('active');
        currentImg = index;
        images[currentImg].classList.add('active');
        dots[currentImg].classList.add('active');
    });
});

// Vintage Car Parallax/Drive in Gallery
gsap.to(".vintage-car-container", {
    scrollTrigger: {
        trigger: ".gallery-section",
        start: "top bottom",
        end: "bottom top",
        scrub: 1
    },
    x: window.innerWidth + 200, // drive across the screen
    ease: "none"
});


// 5. RSVP & INFO SECTION
gsap.from(".rsvp-box", {
    scrollTrigger: {
        trigger: ".rsvp-section",
        start: "top 80%",
    },
    scale: 0.9,
    opacity: 0,
    duration: 1
});

gsap.from(".info-item", {
    scrollTrigger: {
        trigger: ".info-grid",
        start: "top 85%",
    },
    y: 30,
    opacity: 0,
    stagger: 0.2,
    duration: 1
});


// 6. FOOTER SECTION
// Bottom car driving in slowly from right to left
gsap.fromTo(".moving-car-bottom",
    { x: window.innerWidth + 200 },
    {
        scrollTrigger: {
            trigger: ".footer-section",
            start: "top 70%",
            toggleActions: "play none none reverse"
        },
        x: -300,
        duration: 6,
        ease: "power2.inOut",
        delay: 1
    });

// COUNTDOWN LOGIC
// Target is April 30, 2026, 7PM
const targetDate = new Date("2026-04-30T19:00:00").getTime();

setInterval(() => {
    const now = new Date().getTime();
    const diff = targetDate - now;

    if (diff > 0) {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const secs = Math.floor((diff % (1000 * 60)) / 1000);

        document.getElementById("days").innerText = days.toString().padStart(2, '0');
        document.getElementById("hours").innerText = hours.toString().padStart(2, '0');
        document.getElementById("mins").innerText = mins.toString().padStart(2, '0');
        document.getElementById("secs").innerText = secs.toString().padStart(2, '0');
    }
}, 1000);

// AUDIO AUTOPLAY LOGIC (Soothing Tone)
document.addEventListener('DOMContentLoaded', () => {
    const bgMusic = document.getElementById('bg-music');
    if (bgMusic) {
        bgMusic.volume = 0.3; // Set a soothing, lower volume
        
        const playMusic = () => {
            if (bgMusic.paused) {
                bgMusic.play().then(() => {
                    // Play succeeded, remove all interaction listeners
                    ['click', 'scroll', 'touchstart', 'keydown'].forEach(evt => {
                        document.removeEventListener(evt, playMusic);
                    });
                }).catch(err => {
                    // Play blocked by browser, wait for next interaction
                    console.log("Audio waiting for user interaction...");
                });
            }
        };

        // Attempt to play on load
        playMusic();

        // Add robust interaction listeners
        ['click', 'scroll', 'touchstart', 'keydown'].forEach(evt => {
            document.addEventListener(evt, playMusic);
        });
    }
});
