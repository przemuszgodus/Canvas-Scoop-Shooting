const canvas = document.querySelector("canvas");
let audio = new Audio("horse.mp3");
const c = canvas.getContext("2d");

canvas.width = innerWidth;
canvas.height = innerHeight;

const scoreEl = document.querySelector("#scoreEl");

const start = document.querySelector("#start");
const modalEl = document.querySelector("#modalEl");
const scoreUp = document.querySelector("#scoreUp");

class Player {
	constructor(x, y, radius, color) {
		this.x = x;
		this.y = y;
		this.radius = radius;
		this.color = color;
	}

	draw() {
		c.beginPath();
		c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
		c.fillStyle = this.color;
		c.fill();
	}
}

class Projectile {
	constructor(x, y, radius, color, velocity) {
		this.x = x;
		this.y = y;
		this.radius = radius;
		this.color = color;
		this.velocity = velocity;
	}
	draw() {
		c.beginPath();
		c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
		c.fillStyle = this.color;
		c.fill();
	}

	update() {
		this.draw();
		this.x = this.x + this.velocity.x;
		this.y = this.y + this.velocity.y;
	}
}

class Enemy {
	constructor(x, y, radius, color, velocity) {
		this.x = x;
		this.y = y;
		this.radius = radius;
		this.color = color;
		this.velocity = velocity;
	}
	draw() {
		c.beginPath();
		c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
		c.fillStyle = this.color;
		c.fill();
	}

	update() {
		this.draw();
		this.x = this.x + this.velocity.x;
		this.y = this.y + this.velocity.y;
	}
}

const x = canvas.width / 2;
const y = canvas.height / 2;

let player = new Player(x, y, 15, "pink");
let projectiles = [];
let enemies = [];

function init() {
	player = new Player(x, y, 15, "pink");
	projectiles = [];
	enemies = [];
	score = 0;
	scoreEl.innerHTML = score;
	scoreUp.innerHTML = score;
}

function spawnEnemies() {
	setInterval(() => {
		const radius = Math.random() * (30 - 6) + 6;
		let x;
		let y;
		if (Math.random() < 0.5) {
			x = Math.random() < 0.5 ? 0 - radius : canvas.width + radius;
			y = Math.random() * canvas.height;
		} else {
			x = Math.random() * canvas.width;

			y = Math.random() < 0.5 ? 0 - radius : canvas.height + radius;
		}

		const color = `hsl(${Math.random() * 360}, 50%, 50%)`;

		const angle = Math.atan2(canvas.height / 2 - y, canvas.width / 2 - x);

		const velocity = {
			x: Math.cos(angle),
			y: Math.sin(angle),
		};

		enemies.push(new Enemy(x, y, radius, color, velocity));
	}, 1000);
}

let animationId;
let score = 0;
function animate() {
	animationId = requestAnimationFrame(animate);
	c.fillStyle = "rgba(0,0,0,0.1)";
	c.fillRect(0, 0, canvas.width, canvas.height);
	player.draw();
	projectiles.forEach((projectile, index) => {
		projectile.update();

		//usuń z krawędzi ekranu
		if (
			projectile.x + projectile.radius < 0 ||
			projectile.x - projectile.radius > canvas.width ||
			projectile.y + projectile.radius < 0 ||
			projectile.y - projectile.radius > canvas.height
		) {
			setTimeout(() => {
				projectiles.splice(index, 1);
			}, 0);
		}
	});

	enemies.forEach((enemy, index) => {
		enemy.update();

		const dist = Math.hypot(player.x - enemy.x, player.y - enemy.y);
		//koniec gry
		if (dist - enemy.radius - player.radius < 1) {
			cancelAnimationFrame(animationId);
			modalEl.style.display = "flex";
			scoreUp.innerHTML = score;
		}

		projectiles.forEach((projectile, projectileIndex) => {
			const dist = Math.hypot(projectile.x - enemy.x, projectile.y - enemy.y);

			if (dist - enemy.radius - projectile.radius < 1) {
				score += 100;
				scoreEl.innerHTML = score;

				setTimeout(() => {
					enemies.splice(index, 1);
					projectiles.splice(projectileIndex, 1);
				}, 0);
			}
		});
	});
	// projectile.draw();
	// projectile.update();
}

addEventListener("click", (event) => {
	const angle = Math.atan2(
		event.clientY - canvas.height / 2,
		event.clientX - canvas.width / 2
	);

	const velocity = {
		x: Math.cos(angle) * 2,
		y: Math.sin(angle) * 2,
	};
	projectiles.push(
		new Projectile(canvas.width / 2, canvas.height / 2, 5, "gold", velocity)
	);
});

start.addEventListener("click", () => {
	audio.play();
	init();
	animate();
	spawnEnemies();
	modalEl.style.display = "none";
});
