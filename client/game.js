import Color from "color";
import block from "./block.js";
import colorPulse, { randomizeColor } from "./color-pulse.js";
import playerClass from "./player.js";

window.Color = Color; // for testing purposes

let pulseInterval = Date.now();

// TODO: Fix irregular performance issues
// TODO: Nice smooth wrapping around the edges - non-stop

/**
 * Main game class. All game logic is controlled from here.
 */
export default class game {
	constructor({ ctx, canvas, onEnd }) {
		document.addEventListener("keydown", this.eventHandler.bind(this));
		document.addEventListener("keyup", this.eventHandler.bind(this));

		this.ctx = ctx;
		this.canvas = canvas;
		this.onEnd = onEnd;

		this.init()
	}

	init() {
		this.Blocks = [];
		this.Players = [];

		this.framerate = 1000 / 60; // 60 fps
		this.live = false;

		const gameInstance = this; // For later reference

		this.Map = {
			width: 2000,
			height: Infinity,
			Floor: {
				color: "#526C77",
			},
			draw(ctx) {
				ctx.fillStyle = this.Floor.color;
				ctx.fillRect(0, -gameInstance.Viewport.y + gameInstance.Viewport.height, gameInstance.Viewport.width, 200);
			}
		}

		this.Viewport = {
			width: Math.min(window.innerWidth, gameInstance.Map.width),
			height: 800,
			x: 0,
			y: 0,
			Update(pos) {
				this.x = pos.x - this.width / 2;
				this.y = -pos.y + this.height / 2;

				if (this.x < 0) this.x = 0;
				else if (this.x + this.width > gameInstance.Map.width) this.x = gameInstance.Map.width - this.width;

				if (this.y > 200) this.y = 200;
			}
		}

		// Water
		this.Water = {
			progress: -200,
			speed: 0.5,
			color: Color("#eeeeee").alpha(0.5),
			draw(ctx) {
				ctx.fillStyle = this.color;
				ctx.fillRect(0, -gameInstance.Viewport.y + gameInstance.Viewport.height + 200, gameInstance.Viewport.width, -this.progress - 200);
			}
		}

		// Physics info
		this.Physics = {
			gravity: -0.5
		}
	}

	maxScore() {
		return this.Players
			.sort((e, a) => e.score < a.score)[0].score;
	}

	// Find the y-coord of the highest grounded block
	maxGroundedBlock() {
		let bl = this.Blocks
			.filter(b => b.isGrounded)
			.sort((e, a) => e.pos.y < a.pos.y)[0];

		return bl ? bl.pos.y : 0; // Return 0 if no blocks are grounded
	}

	eventHandler(event) {
		this.Players.map(Player => {
			Object.keys(Player.keys).map(key => {
				if (Player.keys[key].code === event.code && event.repeat === false) {
					Player.keys[key].active = event.type === "keydown" ? true : false;
					Player.keys[key].clicked = event.type === "keydown" ? true : false;
				}
			});
		});
	}

	addPlayer({ keys }) {
		const player = new playerClass({ colorPulse: new colorPulse(randomizeColor(), pulseInterval), keys, pos: { x: (this.Map.width - 50) * Math.random(), y: 0 } });
		player.alive = true;
		this.Players.push(player);
	}

	addBlock(data) {
		this.Blocks.push(new block(data));
	}

	toggleLive() {
		this.live = !this.live;
		if (this.live === true) this.startGame();
	}

	startGame() {
		this.live = true;

		// Restart the game
		if (this.animframe) cancelAnimationFrame(this.animframe);
		this.animframe = null;

		this.update();

		let draw = () => {
			this.draw();
			this.animframe = requestAnimationFrame(draw);
		}
		draw(); // Initiate the drawing
	}

	/**
	 * TODO: Seperate this massive function into several.
	 */
	update() {
		if (this.live) setTimeout(this.update.bind(this), this.framerate);

		if (Math.random() < 0.03) {
			// const blocksizes = [{ width: 200, height: 200 }, { width: 120, height: 120 }, { width: 60, height: 150 }];

			// const blocksize = blocksizes[Math.random() * blocksizes.length | 0]; // Take a random block
			const blocksize = { width: 60 + Math.random() * 140 | 0, height: 60 + Math.random() * 140 | 0 }

			let rand = Math.random()
			const deadly = rand > 0.95;						// 1 in 20 chance to be "deadly"
			const passable = rand <= 0.95 && rand > 0.9;	// 1 in 20 chance to be "passable"

			let color;
			if (deadly) {
				color = Color("#ff6556");
			} else if (passable) {
				color = Color("#B8E4F9").darken(0.3).desaturate(0.7);
			} else {
				color = Color("#B8E4F9");
			}

			this.addBlock({ pos: { x: Math.random() * (this.Map.width - blocksize.width), y: this.maxGroundedBlock() + 3000 }, colorPulse: new colorPulse(color, pulseInterval), blocksize, deadly, passable });
		}

		if (this.Players.filter(e => e.alive).length !== 0) {
			let leadingPlayer = this.Players.filter(e => e.alive).sort((a, b) => a.pos.y < b.pos.y)[0];
			let pos = {
				x: leadingPlayer.pos.x + leadingPlayer.width / 2,
				y: leadingPlayer.pos.y,
			}
			this.Viewport.Update(pos);
		} else {
			this.onEnd();
			this.live = false;
		}

		// TODO: Implement collision checking optimization quadtree
		this.Blocks
			.forEach(block => {
				block.update();

				if (block.pos.y < 0) {
					block.pos.y = 0;
					block.vel.y = 0;
					block.isGrounded = true;
				}

				this.Blocks
					.filter(b => b !== block)
					.filter(b => {
						let col = block.isColliding(b)
						if (col && b.isGrounded) block.isGrounded = true;
						return col;
					})
					.map(colblock => {
						block.pos.y = colblock.pos.y + colblock.height;
						block.vel.y = colblock.vel.y;
					})
			})

		this.Players
			.filter(e => e.alive)
			.forEach(player => {
				player.update();
				player.vel.y += this.Physics.gravity;

				if (player.pos.x + player.width < 0) {
					player.pos.x = this.Map.width + player.pos.x;
				} else if (player.pos.x > this.Map.width) {
					player.pos.x = this.Map.width - player.pos.x;
				}

				// Player y
				player.vel.y += this.Physics.gravity;

				if (player.onWall === true && player.vel.y < 0) player.vel.y = player.vel.y * player.slideMod;

				player.pos.y += player.vel.y;
				let coly = false;

				if (player.pos.y < 0) {
					player.pos.y = 0;
					player.vel.y = 0;
					player.onGround = true;
					coly = true;
				}

				const collisions = this.Blocks.filter(d => !d.passable).filter(player.isColliding.bind(player));

				if (collisions.some(c => c.deadly)) {
					player.die();
				}

				const arr = collisions.reduce((acc, block) => {
					if (player.vel.y === block.vel.y) {
						// Empty
					} else if (player.vel.y > block.vel.y) {
						acc.pos.push(block);
					} else {
						acc.neg.push(block);
					}
					return acc;
				}, { neg: [], pos: [] });

				arr.neg.map(block => {
					player.pos.y = block.pos.y + block.height;
					player.onGround = true;
					coly = true;
					player.vel.y = block.vel.y;
				})

				arr.pos.map(block => {
					if (player.onGround) {
						player.die();
					}
					player.pos.y = block.pos.y - player.height;
					player.vel.y = block.vel.y;
				});

				if (coly === false) {
					player.onGround = false;
				}

				// Player x
				if (player.vel.x > player.maxSpeed) player.vel.x = player.maxSpeed;
				else if (player.vel.x < -player.maxSpeed) player.vel.x = -player.maxSpeed;

				player.pos.x += player.vel.x;
				player.vel.x *= player.frictionMod;

				if (player.pos.x + player.width < 0) {
					player.pos.x = this.Map.width + player.pos.x;
				} else if (player.pos.x > Map.width) {
					player.pos.x = this.Map.width - player.pos.x;
				}

				const xCollisions = this.Blocks.filter(d => !d.passable).filter(player.isColliding.bind(player));

				if (xCollisions.some(c => c.deadly)) {
					player.die();
				}

				const notOnWall = xCollisions.every(block => {
					const diff = player.vel.x - block.vel.x;
					if (diff <= 0) {
						player.pos.x = block.pos.x + block.width;
						player.vel.x = block.vel.x;
						return false;
					} else if (diff > 0) {
						player.vel.x = block.vel.x;
						player.pos.x = block.pos.x - player.width;
						return false;
					}
					return true;
				});
				player.onWall = !notOnWall;
				// player x END

				if (player.pos.y < this.Water.progress - player.height / 10) {
					player.underwater = true;
					if (player.pos.y < this.Water.progress - player.height) player.die();
				} else {
					player.underwater = false;
				}
			});

		let highestBlockPos = this.Blocks.filter(d => !d.passable).filter(b => b.isGrounded).map(b => b.pos.y).sort((a, b) => a < b)[0];

		let waterBlockDiff = highestBlockPos - this.Water.progress

		if (waterBlockDiff) {
			if (waterBlockDiff > 500) {
				this.Water.speed = 1.5;
			} else if (waterBlockDiff < 100) {
				this.Water.speed = 0.2;
			} else {
				this.Water.speed = 0.4;
			}
		} else {
			this.Water.speed = 0.1;
		}

		this.Water.progress += this.Water.speed;
	}

	/**
	 * The draw frame
	 */
	draw() {
		// Clear canvas
		this.ctx.clearRect(0, 0, this.Viewport.width, this.Viewport.height);

		// Score printing
		this.ctx.fillStyle = "#c3c3c320";
		this.ctx.font = "400px sans-serif";
		this.ctx.textAlign = "center";
		this.ctx.fillText(this.maxScore() / 10 | 0, this.Viewport.width / 2, this.Viewport.height * 2 / 3 + 20);

		this.Blocks.forEach(b => b.draw({ ctx: this.ctx, Viewport: this.Viewport }));
		this.Players.forEach(p => p.draw({ ctx: this.ctx, Viewport: this.Viewport }));

		this.Map.draw(this.ctx);
		this.Water.draw(this.ctx);
	}
}