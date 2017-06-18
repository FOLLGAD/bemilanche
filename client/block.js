import Color from "color"

export default class Block {
	constructor({ pos }) {
		const blocksizes = [{ width: 200, height: 200 }, { width: 120, height: 120 }, { width: 60, height: 150 }];

		this.color = Color("#B8E4F9").desaturate(0.5).hex();

		const { width, height } = blocksizes[Math.random() * blocksizes.length | 0];
		this.width = width;
		this.height = height;

		this.pos = pos;
		this.vel = {
			x: 0,
			y: -Math.random() * 5 - 3
		};
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