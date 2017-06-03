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
		this.speed = 1.5;
		this.maxSpeed = 100;
		this.jumpSpeed = 15;
		this.wallMod = 0.85;
		this.frictionMod = 0.85;
	}
	updateKeys() {
		const { left, right, jump } = this.keys;
		if (left.active !== right.active) {
			if (left.active) { this.vel.x += -this.speed; }
			else if (right.active) { this.vel.x += this.speed; }
		}

		if (this.onGround && jump.clicked) {
			this.vel.y = this.jumpSpeed;
		} else if (this.onWall && jump.clicked) {
			this.vel.y = this.jumpSpeed * this.wallMod;
			this.vel.x = right.active ? -this.jumpSpeed * 1 : this.jumpSpeed * 1;
		}
		Object.keys(this.keys).forEach(key => {
			this.keys[key].clicked = false;
		});
	}
	update() {
		if (this.alive !== true) return;
		if (this.pos.y > this.score) this.score = this.pos.y;
		this.updateKeys();
	}
	updateX() {
		if (this.vel.x > this.maxSpeed) this.vel.x = this.maxSpeed;
		else if (this.vel.x < -this.maxSpeed) this.vel.x = -this.maxSpeed;

		this.pos.x += this.vel.x;
		this.vel.x *= this.frictionMod;

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
				this.vel.x = block.vel.x;
				return false;
			} else if (diff > 0) {
				this.vel.x = block.vel.x;
				this.pos.x = block.pos.x - this.width;
				return false;
			}
			return true;
		});
		if (colx) this.vel.x = 0;
		this.onWall = !notOnWall;
	}
	updateY() {
		this.vel.y += Physics.gravity;
		this.pos.y += this.vel.y;
		let coly = false;

		if (this.pos.y < Curtain.progress - this.height / 2) this.die();

		if (this.pos.y < 0) {
			this.pos.y = 0;
			this.vel.y = 0;
			this.onGround = true;
			coly = true;
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
				coly = true;
				this.vel.y = block.vel.y;
				break;
			} else if (diff > 0) {
				this.pos.y = block.pos.y - this.height;
				this.vel.y = block.vel.y;
				if (this.onGround === true) this.die();
				break;
			}
		}
		if (coly === false) {
			this.onGround = false;
		}
	}
	IsColliding(obj) {
		return this.pos.x + this.width > obj.pos.x && this.pos.x < obj.pos.x + obj.width &&
			this.pos.y < obj.pos.y + obj.height && this.pos.y + this.height > obj.pos.y;
	}
	draw(ctx) {
		ctx.fillStyle = this.onWall ? "purple" : "#22ee66";
		const posx = this.pos.x - Viewport.x;
		const posy = Viewport.height - this.height - this.pos.y - Viewport.y;
		ctx.fillRect(posx, posy, this.width, this.height);
		ctx.fillStyle = this.onGround ? "black" : "white";
		ctx.fillRect(posx, posy + this.height * (2 / 3), this.width, this.height / 3);
	}
	die() {
		this.alive = false;
	}
}

function SpawnPlayer() {
	const newPlayer = new Player();
	newPlayer.alive = true;
	players.push(newPlayer);
	return;
}
