class Player {
	constructor(props) {
		this.pos = {
			x: Map.width / 2,
			y: 0
		}
		this.vel = {
			x: 0,
			y: 0
		}

		this.height = 70;
		this.width = 40;

		this.keys = {
			jump: { code: (players.length === 0 ? "Space" : "Numpad0"), active: false },
			left: { code: (players.length === 0 ? "KeyA" : "ArrowLeft"), active: false },
			right: { code: (players.length === 0 ? "KeyD" : "ArrowRight"), active: false }
		}

		this.onGround = true;
		this.onWall = false;
		this.alive = false;

		this.score = 0;
		this.speed = 10;
		this.jumpSpeed = 20;
		this.wallMod = 0.85;
		this.maxSpeed = 100;
		this.frictionMod = 0.65;
	}
	updateKeys() {
		const { left, right, jump } = this.keys;
		if (left.active !== right.active) {
			if (left.active) { this.vel.x += -this.speed; }
			else if (right.active) { this.vel.x += this.speed; }
		} else {
		}

		if (this.onGround && jump.active) {
			this.vel.y = this.jumpSpeed;
		} else if (this.onWall && jump.active) {
			this.vel.y = this.jumpSpeed * this.wallMod;
		}
	}
	update() {
		if (this.alive !== true) return;
		this.updateKeys();
	}
	updateX() {
		if (this.vel.x > this.maxSpeed) this.vel.x = this.maxSpeed;
		else if (this.vel.x < -this.maxSpeed) this.vel.x = -this.maxSpeed;
		
		this.vel.x *= this.frictionMod;
		this.pos.x += this.vel.x;

		if (this.pos.x + this.width < 0) {
			this.pos.x = Map.width + this.pos.x;
		} else if (this.pos.x > Map.width) {
			this.pos.x = Map.width - this.pos.x;
		}

		let colx = false;
		const notOnWall = blocks.filter(this.IsColliding.bind(this)).every(block => {
			const diff = this.vel.x - block.vel.x;
			if (diff <= 0) {
				this.pos.x = block.pos.x + block.width;
				return false;
			} else if (diff > 0) {
				this.pos.x = block.pos.x - this.width;
				return false;
			}
			return true;
		});
		if (colx) this.vel.x = 0;
		this.onWall = !notOnWall;
	}
	updateY() {
		this.pos.y += this.vel.y;
		this.vel.y += Physics.gravity;

		if (this.pos.y < 0) {
			this.pos.y = 0;
			this.vel.y = 0;
			this.onGround = true;
		} else {
			this.onGround = false;
		}

		const cols = blocks.filter(this.IsColliding.bind(this));
		for (let i = 0; i < cols.length; i++) {
			const block = cols[i];
			let diff;
			if (this.vel.y === block.vel.y) diff = 0;
			else if (this.vel.y > block.vel.y) {
				diff = 1;
			} else {
				diff = -1;
			}

			if (diff < 0) {
				this.pos.y = block.pos.y + block.height;
				this.onGround = true;
				this.vel.y = block.vel.y;
				break;
			} else if (diff > 0) {
				this.pos.y = block.pos.y - this.height;
				this.vel.y = block.vel.y;
				if (this.onGround) this.alive = false;
				break;
			}
		}
	}
	IsColliding(obj) {
		return this.pos.x + this.width > obj.pos.x && this.pos.x < obj.pos.x + obj.width &&
			this.pos.y < obj.pos.y + obj.height && this.pos.y + this.height > obj.pos.y;
	}
	draw(ctx) {
		ctx.fillRect(this.pos.x - Viewport.x, Viewport.height - this.height - this.pos.y - Viewport.y, this.width, this.height);
	}
}

function SpawnPlayer() {
	const newPlayer = new Player();
	newPlayer.alive = true;
	players.push(newPlayer);
	return;
}
