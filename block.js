const blocksizes = [{ width: 200, height: 200 }, { width: 100, height: 100 }];

class Block {
	constructor() {
		let color = Math.floor(Math.random()*255).toString(16);
		if (color.length !== 6) color = color + 0;
		color = "#" + color;

		this.color = color;

		const { width, height } = blocksizes[Math.random() * 2 | 0];
		this.width = width;
		this.height = height;
		this.pos = {
			x: Math.random() * (Map.width - this.width),
			y: players[0].pos.y + 1000
		}
		this.vel = {
			x: 0,
			y: -Math.random() * 5 - 3
		};
	}
	update() {
		this.pos.y += this.vel.y;
		if (this.pos.y < 0) {
			this.pos.y = 0;
			this.vel.y = 0;
		};
		blocks
			.filter(b => b !== this)
			.filter(this.isColliding.bind(this))
			.map(block => {
				this.pos.y = block.pos.y + block.height;
				this.vel.y = block.vel.y;
			})
	}
	isColliding(obj) {
		return this.pos.x + this.width > obj.pos.x && this.pos.x < obj.pos.x + obj.width &&
			this.pos.y < obj.pos.y + obj.height && this.pos.y > obj.pos.y;
	}
	draw(ctx) {
		ctx.fillStyle = this.color;
		ctx.fillRect(this.pos.x - Viewport.x, Viewport.height - this.height - this.pos.y - Viewport.y, this.width, this.height);
	}
}

function SpawnBlock() {
	const newBlock = new Block();
	blocks.push(newBlock);
	return;
}