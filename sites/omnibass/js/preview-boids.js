const canvas = document.getElementById('hero-canvas');
const ctx = canvas.getContext('2d');

let width, height;
let boids = [];
const numBoids = 80;
const visualRange = 100;

function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    // Also update fixed layer height to match if needed, but 100vh handles it nicely
}
window.addEventListener('resize', resize);
resize();

class Boid {
    constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.dx = Math.random() * 2 - 1;
        this.dy = Math.random() * 2 - 1;
        this.history = [];
        this.type = Math.floor(Math.random() * 3);
        this.isRare = Math.random() < 0.05;

        if (this.isRare) {
            this.color = '#F59E0B';
            this.size = Math.random() * 4 + 3;
        } else {
            const colors = ['#60A5FA', '#38BDF8', '#818CF8', '#93C5FD'];
            this.color = colors[Math.floor(Math.random() * colors.length)];
            this.size = Math.random() * 3 + 2;
        }
    }

    update() {
        let xMove = 0, yMove = 0;
        let avgDX = 0, avgDY = 0;
        let avgX = 0, avgY = 0;
        let numNeighbors = 0;

        for (let other of boids) {
            if (other !== this) {
                const dist = Math.hypot(this.x - other.x, this.y - other.y);
                if (dist < visualRange) {
                    if (dist < 30) {
                        xMove += this.x - other.x;
                        yMove += this.y - other.y;
                    }
                    avgDX += other.dx;
                    avgDY += other.dy;
                    avgX += other.x;
                    avgY += other.y;
                    numNeighbors++;
                }
            }
        }

        if (numNeighbors > 0) {
            avgDX /= numNeighbors;
            avgDY /= numNeighbors;
            avgX /= numNeighbors;
            avgY /= numNeighbors;
            this.dx += (avgDX - this.dx) * 0.02;
            this.dy += (avgDY - this.dy) * 0.02;
            this.dx += (avgX - this.x) * 0.0002;
            this.dy += (avgY - this.y) * 0.0002;
        }

        this.dx += xMove * 0.015;
        this.dy += yMove * 0.015;

        const centerX = width / 2;
        const centerY = height / 2;
        this.dx += (centerX - this.x) * 0.00001;
        this.dy += (centerY - this.y) * 0.00001;

        const speed = Math.hypot(this.dx, this.dy);
        const maxSpeed = this.isRare ? 2.2 : 1.8;
        const minSpeed = 0.8;

        if (speed > maxSpeed) {
            this.dx = (this.dx / speed) * maxSpeed;
            this.dy = (this.dy / speed) * maxSpeed;
        } else if (speed < minSpeed) {
            this.dx = (this.dx / speed) * minSpeed;
            this.dy = (this.dy / speed) * minSpeed;
        }

        this.x += this.dx;
        this.y += this.dy;

        const margin = 50;
        if (this.x < -margin) this.x = width + margin;
        if (this.x > width + margin) this.x = -margin;
        if (this.y < -margin) this.y = height + margin;
        if (this.y > height + margin) this.y = -margin;

        this.history.push({ x: this.x, y: this.y });
        if (this.history.length > 8) this.history.shift();
    }

    draw() {
        const angle = Math.atan2(this.dy, this.dx);
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(angle);
        ctx.fillStyle = this.color;
        ctx.globalAlpha = 0.9;
        ctx.beginPath();
        if (this.type === 0) {
            ctx.arc(0, 0, this.size, 0, Math.PI * 2);
            ctx.moveTo(0, 0);
            ctx.lineTo(-this.size * 2, -this.size * 0.8);
            ctx.lineTo(-this.size * 2, this.size * 0.8);
            ctx.fill();
        } else if (this.type === 1) {
            ctx.ellipse(0, 0, this.size * 2, this.size * 0.6, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.moveTo(-this.size * 1.5, 0);
            ctx.lineTo(-this.size * 2.5, -this.size);
            ctx.lineTo(-this.size * 2.5, this.size);
            ctx.fill();
        } else {
            ctx.moveTo(this.size * 1.5, 0);
            ctx.lineTo(-this.size, this.size);
            ctx.lineTo(-this.size * 0.5, 0);
            ctx.lineTo(-this.size, -this.size);
            ctx.fill();
        }
        ctx.restore();

        if (this.isRare) {
            ctx.beginPath();
            ctx.strokeStyle = this.color;
            ctx.lineWidth = 1;
            ctx.globalAlpha = 0.2;
            if (this.history.length > 1) {
                ctx.moveTo(this.history[0].x, this.history[0].y);
                for (let i = 1; i < this.history.length; i++) {
                    ctx.lineTo(this.history[i].x, this.history[i].y);
                }
            }
            ctx.stroke();
        }
    }
}

for (let i = 0; i < numBoids; i++) {
    boids.push(new Boid());
}

function animate() {
    ctx.clearRect(0, 0, width, height);
    for (let boid of boids) {
        boid.update();
        boid.draw();
    }
    requestAnimationFrame(animate);
}
animate();
