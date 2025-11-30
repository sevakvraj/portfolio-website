// 1. Initialize AOS
AOS.init({
    once: true,
    offset: 100,
    duration: 800,
    easing: 'ease-out-cubic',
});

// 2. Typing Text Effect (Only runs if element exists)
const TypeWriter = function(txtElement, words, wait = 3000) {
    this.txtElement = txtElement;
    this.words = words;
    this.txt = '';
    this.wordIndex = 0;
    this.wait = parseInt(wait, 10);
    this.type();
    this.isDeleting = false;
}

TypeWriter.prototype.type = function() {
    const current = this.wordIndex % this.words.length;
    const fullTxt = this.words[current];

    if(this.isDeleting) {
        this.txt = fullTxt.substring(0, this.txt.length - 1);
    } else {
        this.txt = fullTxt.substring(0, this.txt.length + 1);
    }

    this.txtElement.innerHTML = `<span class="txt">${this.txt}</span>`;

    let typeSpeed = 100;

    if(this.isDeleting) typeSpeed /= 2;

    if(!this.isDeleting && this.txt === fullTxt) {
        typeSpeed = this.wait;
        this.isDeleting = true;
    } else if(this.isDeleting && this.txt === '') {
        this.isDeleting = false;
        this.wordIndex++;
        typeSpeed = 500;
    }

    setTimeout(() => this.type(), typeSpeed);
}

document.addEventListener('DOMContentLoaded', () => {
    // --- NEW: Splash Screen Logic ---
    const splash = document.getElementById('splash-screen');
    if (splash) {
        setTimeout(() => {
            splash.classList.add('splash-hidden'); // Triggers the slide-up CSS
        }, 3500); // Displays for 3.5 seconds
    }
    // --- END NEW LOGIC ---

    // Init Typewriter only if element exists (Home Page)
    const txtElement = document.querySelector('.txt-type');
    if (txtElement) {
        const words = JSON.parse(txtElement.getAttribute('data-words'));
        const wait = txtElement.getAttribute('data-wait');
        new TypeWriter(txtElement, words, wait);
    }
});

// 3. Mobile Menu Toggle
const btn = document.getElementById('mobile-menu-btn');
const menu = document.getElementById('mobile-menu');

if(btn && menu) {
    btn.addEventListener('click', () => {
        menu.classList.toggle('hidden');
    });
}

// 4. Particle System
const canvas = document.getElementById('particles-canvas');
if(canvas) {
    const ctx = canvas.getContext('2d');
    let particlesArray;
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        initParticles();
    });

    const mouse = { x: null, y: null, radius: 150 };

    window.addEventListener('mousemove', (event) => {
        mouse.x = event.x;
        mouse.y = event.y;
    });

    window.addEventListener('mouseout', () => {
        mouse.x = undefined;
        mouse.y = undefined;
    });

    class Particle {
        constructor(x, y, directionX, directionY, size, color) {
            this.x = x; this.y = y;
            this.directionX = directionX; this.directionY = directionY;
            this.size = size; this.color = color;
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
            ctx.fillStyle = this.color;
            ctx.fill();
        }
        update() {
            if (this.x > canvas.width || this.x < 0) this.directionX = -this.directionX;
            if (this.y > canvas.height || this.y < 0) this.directionY = -this.directionY;

            let dx = mouse.x - this.x;
            let dy = mouse.y - this.y;
            let distance = Math.sqrt(dx*dx + dy*dy);

            if (distance < mouse.radius + this.size){
                if (mouse.x < this.x && this.x < canvas.width - this.size * 10) this.x += 10;
                if (mouse.x > this.x && this.x > this.size * 10) this.x -= 10;
                if (mouse.y < this.y && this.y < canvas.height - this.size * 10) this.y += 10;
                if (mouse.y > this.y && this.y > this.size * 10) this.y -= 10;
            }
            this.x += this.directionX;
            this.y += this.directionY;
            this.draw();
        }
    }

    function initParticles() {
        particlesArray = [];
        let numberOfParticles = (canvas.height * canvas.width) / 9000;
        for (let i = 0; i < numberOfParticles; i++) {
            let size = (Math.random() * 2) + 1;
            let x = (Math.random() * ((canvas.width - size * 2) - (size * 2)) + size * 2);
            let y = (Math.random() * ((canvas.height - size * 2) - (size * 2)) + size * 2);
            let directionX = (Math.random() * 0.4) - 0.2;
            let directionY = (Math.random() * 0.4) - 0.2;
            let color = 'rgba(255, 255, 255, 0.4)';
            particlesArray.push(new Particle(x, y, directionX, directionY, size, color));
        }
    }

    function connect() {
        let opacityValue = 1;
        for (let a = 0; a < particlesArray.length; a++) {
            for (let b = a; b < particlesArray.length; b++) {
                let distance = ((particlesArray[a].x - particlesArray[b].x) * (particlesArray[a].x - particlesArray[b].x)) + 
                               ((particlesArray[a].y - particlesArray[b].y) * (particlesArray[a].y - particlesArray[b].y));
                if (distance < (canvas.width/7) * (canvas.height/7)) {
                    opacityValue = 1 - (distance / 20000);
                    ctx.strokeStyle = 'rgba(0, 212, 255,' + opacityValue + ')';
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                    ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                    ctx.stroke();
                }
            }
        }
    }

    function animate() {
        requestAnimationFrame(animate);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < particlesArray.length; i++) {
            particlesArray[i].update();
        }
        connect();
    }
    initParticles();
    animate();
}

// 5. Skill Bar Animation (Only runs if Skills section exists)
const skillsSection = document.querySelector('#skills');
if(skillsSection) {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const bars = entry.target.querySelectorAll('.skill-bar');
                bars.forEach(bar => {
                    bar.style.width = bar.getAttribute('data-width');
                });
            }
        });
    }, { threshold: 0.5 });
    observer.observe(skillsSection);
}
const skills = [
    { name: "JavaScript", class: "js" },
    { name: "Python", class: "python" },
    { name: "React", class: "react" },
    { name: "Node.js", class: "node" },
    { name: "C", class: "c" },
    { name: "MongoDB", class: "c" },
    { name: "MySQL", class: "c" }
];

const container = document.getElementById("bubble-container");

// Create bubbles
function spawnBubble(skill) {
    const bubble = document.createElement("div");
    bubble.className = `bubble ${skill.class}`;
    bubble.textContent = skill.name;

    // Random position + scale
    bubble.style.left = Math.random() * 90 + "%";
    bubble.style.animationDuration = 8 + Math.random() * 6 + "s";
    bubble.style.transform = `scale(${0.7 + Math.random() * 0.8})`;

    container.appendChild(bubble);

    // POP Effect
    bubble.addEventListener("click", () => {
        bubble.classList.add("pop");
        setTimeout(() => bubble.remove(), 300);
    });

    // Remove bubble after animation
    setTimeout(() => {
        if (!bubble.classList.contains("pop")) bubble.remove();
    }, 15000);
}

// Spawn bubbles repeatedly
setInterval(() => {
    const randomSkill = skills[Math.floor(Math.random() * skills.length)];
    spawnBubble(randomSkill);
}, 1200);