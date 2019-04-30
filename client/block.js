import color from "color";
import colorPulseClass from "./color-pulse";

export default class block {
	constructor({ pos, colorPulse = new colorPulseClass(color("#B8E4F9")), blocksize = { width: 200, height: 200 }, groundedPulse, deadly = false, passable = false }) {
		this.colorPulse = colorPulse;
		this.groundedPulse = groundedPulse;
		this.isGrounded = false;

		this.width = blocksize.width;
		this.height = blocksize.height;

		this.deadly = deadly;
		this.passable = passable;

		this.pos = pos;
		this.vel = {
			x: 0,
			y: -Math.random() * 5 - 3, // Random number between -3 and -8
		};
	}
	get color() {
		return this.colorPulse.getColor(Date.now()).hex();
	}
	update() {
		this.pos.y += this.vel.y;
	}
	isColliding(obj) {
		return this.pos.x + this.width > obj.pos.x && this.pos.x < obj.pos.x + obj.width &&
			this.pos.y < obj.pos.y + obj.height && this.pos.y > obj.pos.y;
	}
	draw({ ctx, Viewport }) {
		ctx.fillStyle = this.color;
		ctx.fillRect(this.pos.x - Viewport.x, Viewport.height - this.height - this.pos.y - Viewport.y, this.width, this.height);
	}
}