const canvas = document.getElementById("gamecanvas");
const ctx = canvas.getContext("2d");

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

		if (this.y > 0) this.y = 0;
	}
}

console.log(Viewport.width);

canvas.height = Viewport.height;
canvas.width = Viewport.width;

const blocks = [];
const players = [];

document.addEventListener("keydown", EventHandler);
document.addEventListener("keyup", EventHandler);

function EventHandler(event) {
	players.forEach(player => {
		Object.keys(player.keys).forEach(key => {
			if (player.keys[key].code === event.code) {
				player.keys[key].active = event.type === "keydown" ? true : false;
			}
		});
	});
}

const Physics = {
	gravity: -0.8
}