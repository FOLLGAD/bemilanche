const GameStatus = {
	framerate: 1000 / 60,
	scroll: 0,
	score: 0,
	live: false
}

const Curtain = {
	progress: -200,
	draw(ctx) {
		ctx.fillStyle = "rgba(255, 0, 0, 0.5)";
		ctx.fillRect(0, -Viewport.y + Viewport.height, Viewport.width, -this.progress);
	}
}

const framerateInput = document.getElementById("framerate");
framerateInput.value = Math.sqrt(GameStatus.framerate * 10).toString();
framerateInput.addEventListener("input", e => {
	GameStatus.framerate = Math.pow(e.target.value, 2) / 10;
});

function StartGame() {
	UpdateGame();
}

function UpdateGame() {
	if (Math.random() < 0.008) SpawnBlock();
	if (GameStatus.live) setTimeout(UpdateGame, GameStatus.framerate);
	ctx.clearRect(0, 0, Viewport.width, Viewport.height);

	Viewport.Update(players[0].pos);

	players.forEach(player => {
		player.update();
	});

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
	Curtain.progress += 0.3;
	Curtain.draw(ctx);
	scoreElem.innerHTML = players.sort((e, a) => e.score < a.score).map((e, n) => `<span ${e.alive ? '' : 'class="dead"'}>Player ${n}: ${e.score}</span>`).join("<br />");
}

function ToggleLive() {
	GameStatus.live = !GameStatus.live;
	if (GameStatus.live === true) StartGame();
}

function LiveAgain() {
	players.forEach(e => { e.alive = true; return e; })
}