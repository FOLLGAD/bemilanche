import Game from "./game"
import Color from "color"

let game = false;

function startGame() {
	if (game === true) return;
	else game = true;

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
		gameInstance = new Game({ ctx, canvas, onEnd })
		updatePlayers();
	}

	let gameInstance = new Game({ ctx, canvas, onEnd });

	canvas.height = gamemenu.style.height = gameInstance.Viewport.height;
	canvas.width = gamemenu.style.width = gameInstance.Viewport.width;

	elements.startgame.addEventListener("click", start);
	function start(e) {
		// if (gameInstance.Players === 0) return;
		gameInstance.StartGame();
		gamemenu.style.display = "none";
	}
	elements.newplayer.addEventListener("click", newPlayer);

	function newPlayer(e) {
		const keys = [
			{ jump: "Space", right: "KeyD", left: "KeyA" },
			{ jump: "Numpad0", right: "ArrowRight", left: "ArrowLeft" },
			{ jump: "KeyI", right: "KeyL", left: "KeyJ" }
		][gameInstance.Players.length];
		const color = [
			Color("#9a4c95"),
			Color("#1d1a31"),
			Color("#d2d4c8"),
			Color("#a5243d"),
			Color("#b9cfd4")
		][gameInstance.Players.length]
		gameInstance.AddPlayer({ name: elements.name.value, keys, color });
		updatePlayers();
	}
	function updatePlayers() {
		elements.playerlist.innerHTML = gameInstance.Players.map(player => {
			return `<li>${player.name}</li>`
		}).reduce((acc, val) => acc + val, "")
	}
}

startGame();