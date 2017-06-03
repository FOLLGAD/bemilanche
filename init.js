const canvas = document.getElementById("gamecanvas");
const ctx = canvas.getContext("2d");

const scoreElem = document.getElementById("score");

const Map = {
	width: 1500
}

const Viewport = {
	width: Math.min(window.innerWidth, Map.width),
	height: 600,
	x: 0,
	y: 0,
	Update(pos) {
		this.x = pos.x - this.width / 2;
		this.y = -pos.y + this.height / 2;
		if (this.x < 0) this.x = 0;
		else if (this.x + this.width > Map.width) this.x = Map.width - this.width;

		if (this.y > 200) this.y = 200;
	}
}

canvas.height = Viewport.height;
canvas.width = Viewport.width;

const blocks = [];
const players = [];

document.addEventListener("keydown", EventHandler);
document.addEventListener("keyup", EventHandler);

function EventHandler(event) {
	players.forEach(player => {
		Object.keys(player.keys).forEach(key => {
			if (player.keys[key].code === event.code && event.repeat === false) {
				player.keys[key].active = event.type === "keydown" ? true : false;
				player.keys[key].clicked = event.type === "keydown" ? true : false;
			}
		});
	});
}

const Physics = {
	gravity: -0.5
}