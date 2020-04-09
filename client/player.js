import color from "color";

export default class player {
	constructor({ pos = { x: 50, y: 0 }, keys = { jump: "Space", left: "KeyA", right: "KeyD" }, colorPulse }) {
		this.pos = pos;
		this.vel = {
			x: 0,
			y: 0
		}
		this.colorPulse = colorPulse;

		this.height = 70;
		this.width = 40;

		this.keys = {
			jump: { code: keys.jump, active: false },
			left: { code: keys.left, active: false },
			right: { code: keys.right, active: false }
		}

		this.onGround = true;
		this.onWall = false;
		this.alive = false;
		this.underwater = false;

		this.score = 0;
		this.speed = 1.5;
		this.underwaterSpeed = 0.5;
		this.maxSpeed = 100;
		this.jumpSpeed = 23;
		this.wallMod = 0.85;
		this.frictionMod = 0.85;
		this.slideMod = 0.85;

		// TODO: Add death timer for water & blocks
	}
	get color() {
		return this.colorPulse.getColor(Date.now()).hex()
	}
	updateKeys() {
		const { left, right, jump } = this.keys;

		let speed = this.underwater ? this.underwaterSpeed : this.speed;

		if (left.active !== right.active) {
			if (right.active) { this.vel.x += speed; }
			else if (left.active) { this.vel.x += -speed; }
		}

		if (this.onGround && jump.clicked) {
			this.vel.y = this.jumpSpeed;
		} else if (this.onWall && jump.clicked) {
			this.vel.y = this.jumpSpeed * this.wallMod;
			this.vel.x = right.active ? this.jumpSpeed * -1 : this.jumpSpeed * 1;
		}
		Object.keys(this.keys).forEach(key => {
			this.keys[key].clicked = false;
		});
	}
	update() {
		if (this.pos.y > this.score) this.score = this.pos.y;
		this.updateKeys();
	}
	isColliding(obj) {
		return this.pos.x + this.width > obj.pos.x && this.pos.x < obj.pos.x + obj.width &&
			this.pos.y < obj.pos.y + obj.height && this.pos.y + this.height > obj.pos.y;
	}
	draw({ ctx, Viewport }) {
		if (!this.alive) return;

		ctx.fillStyle = this.onWall ? color(this.color).darken(0.1) : this.color;
		const posx = this.pos.x - Viewport.x;
		const posy = Viewport.height - this.height - this.pos.y - Viewport.y;
		ctx.fillRect(posx, posy, this.width, this.height);
		ctx.fillRect(posx, posy + this.height * (2 / 3), this.width, this.height / 3);
	}
	die() {
		this.alive = false;
	}
}