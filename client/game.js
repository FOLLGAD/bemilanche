import Block from "./block.js"
import Player from "./player.js"
import Color from "color"
window.Color = Color;

export default class Game {
	constructor({ ctx, canvas, onEnd }) {
		this.ctx = ctx;
		this.canvas = canvas;
		this.onEnd = onEnd;

		document.addEventListener("keydown", this.EventHandler.bind(this));
		document.addEventListener("keyup", this.EventHandler.bind(this));

		this.Blocks = [];
		this.Players = [];

		this.framerate = 1000 / 60;
		this.live = false;

		const game = this;

		this.Map = {
			width: 1500,
			height: Infinity,
			Floor: {
				color: "#526C77",
			},
			draw(ctx) {
				ctx.fillStyle = this.Floor.color;
				ctx.fillRect(0, -game.Viewport.y + game.Viewport.height, game.Viewport.width, 200);
			}
		}

		this.Viewport = {
			width: Math.min(window.innerWidth, game.Map.width),
			height: 800,
			x: 0,
			y: 0,
			Update(pos) {
				this.x = pos.x - this.width / 2;
				this.y = -pos.y + this.height / 2;

				if (this.x < 0) this.x = 0;
				else if (this.x + this.width > game.Map.width) this.x = game.Map.width - this.width;

				if (this.y > 200) this.y = 200;
			}
		}

		this.Water = {
			progress: -200,
			progression: 0.5,
			color: Color("#9FDDF9").alpha(0.4),
			draw(ctx) {
				ctx.fillStyle = this.color;
				ctx.fillRect(0, -game.Viewport.y + game.Viewport.height + 200, game.Viewport.width, -this.progress - 200);
			}
		}

		this.Physics = {
			gravity: -0.5
		}
	}

	get maxScore() {
		return this.Players
			.sort((e, a) => e.score < a.score)[0].score;
	}

	EventHandler(event) {
		this.Players.map(Player => {
			Object.keys(Player.keys).map(key => {
				if (Player.keys[key].code === event.code && event.repeat === false) {
					Player.keys[key].active = event.type === "keydown" ? true : false;
					Player.keys[key].clicked = event.type === "keydown" ? true : false;
				}
			});
		});
	}
	AddPlayer({ name, keys, color }) {
		const player = new Player({ color, keys, name, pos: { x: this.Map.width / 2, y: 0 } });
		player.alive = true;
		this.Players.push(player);
	}
	AddBlock(pos) {
		this.Blocks.push(new Block(pos));
	}
	ToggleLive() {
		this.live = !this.live;
		if (this.live === true) this.StartGame();
	}
	StartGame() {
		this.live = true;
		this.Update();
	}
	Update() {
		if (this.live) setTimeout(this.Update.bind(this), this.framerate);

		this.ctx.clearRect(0, 0, this.Viewport.width, this.Viewport.height);

		if (Math.random() < 0.02) this.AddBlock({ pos: { x: Math.random() * this.Map.width, y: this.maxScore + 1000 } });

		if (this.Players.filter(e => e.alive).length !== 0) {
			this.Viewport.Update(this.Players.filter(e => e.alive).sort((a, b) => a.score < b.score)[0].pos);
		} else {
			this.onEnd();
			this.live = false;
		}

		this.Blocks.map(block => {
			block.update();

			if (block.pos.y < 0) {
				block.pos.y = 0;
				block.vel.y = 0;
			}
			this.Blocks
				.filter(b => b !== block)
				.filter(block.isColliding.bind(block))
				.map(colblock => {
					block.pos.y = colblock.pos.y + colblock.height;
					block.vel.y = colblock.vel.y;
				})

			block.draw({ ctx: this.ctx, Viewport: this.Viewport });
		})

		this.Players.filter(e => e.alive).forEach(player => {
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

			const collisions = this.Blocks.filter(player.IsColliding.bind(player));
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

			const notOnWall = this.Blocks.filter(player.IsColliding.bind(player)).every(block => {
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
			// END

			if (player.pos.y < this.Water.progress - player.height / 2) player.die();

			player.draw({ ctx: this.ctx, Viewport: this.Viewport });
		});

		this.Water.progress += this.Water.progression;

		this.Map.draw(this.ctx);
		this.Water.draw(this.ctx);
	}
}