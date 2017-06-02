const GameStatus = {
	framerate: 1000 / 60,
	scroll: 0,
	score: 0,
	live: false
}

const framerateInput = document.getElementById("framerate");
framerateInput.value = Math.sqrt(GameStatus.framerate * 10).toString();
framerateInput.addEventListener("input", e => {
	GameStatus.framerate = Math.pow(e.target.value, 2) / 10;
	console.log(GameStatus.framerate);
});

function StartGame() {
	UpdateGame();
}

function UpdateGame() {
	if (GameStatus.live) setTimeout(UpdateGame, GameStatus.framerate);
	ctx.clearRect(0, 0, Viewport.width, Viewport.height);

	Viewport.Update(players[0].pos);

	players.forEach(player => {
		player.update();
	});

	ctx.fillStyle = "#cbcbcb";
	blocks.forEach(block => {
		block.update();
		block.draw(ctx);
	});

	ctx.fillStyle = "#ffffff";
	players.filter(e => e.alive).forEach(player => {
		player.updateY();
		player.updateX();
		player.draw(ctx);
	});
}

function ToggleLive() {
	GameStatus.live = !GameStatus.live;
	if (GameStatus.live === true) StartGame();
}

function LiveAgain() {
	players.forEach(e => { e.alive = true; return e; })
}