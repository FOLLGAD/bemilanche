import game from "./game";

let gameIsOn = false;

/**
 * Start the game
 */
function startGame() {
	if (gameIsOn === true) return;
	else gameIsOn = true;

	const canvas = document.getElementById("gamecanvas");
	const ctx = canvas.getContext("2d");
	const gamemenu = document.getElementById("gamemenu");

	const elements = {
		startgame: document.getElementById("start"),
		newplayer: document.getElementById("newplayer"),
		name: document.getElementById("name"),
		playerlist: document.getElementById("playerlist")
	}

	function onEnd() {
		gamemenu.style.display = "block";
		gameInstance = new game({ ctx, canvas, onEnd })
		updatePlayers();
	}

	let gameInstance = new game({ ctx, canvas, onEnd });

	canvas.height = gamemenu.style.height = gameInstance.Viewport.height;
	canvas.width = gamemenu.style.width = gameInstance.Viewport.width;

	elements.startgame.addEventListener("click", start);
	function start() {
		if (gameInstance.Players.length === 0) return;
		gameInstance.startGame();
		gamemenu.style.display = "none";
	}
	elements.newplayer.addEventListener("click", newPlayer);

	function newPlayer() {
		const keys = [
			{ jump: "KeyW", right: "KeyD", left: "KeyA" },
			{ jump: "ArrowUp", right: "ArrowRight", left: "ArrowLeft" },
			{ jump: "KeyI", right: "KeyL", left: "KeyJ" }
		][gameInstance.Players.length];
		
		gameInstance.addPlayer({ name: elements.name.value, keys });
		updatePlayers();
	}
	function updatePlayers() {
		elements.playerlist.innerHTML = gameInstance.Players.map(player => {
			return `<li>${player.name}</li>`
		}).reduce((acc, val) => acc + val, "")
	}
}

startGame(); // Start an instance