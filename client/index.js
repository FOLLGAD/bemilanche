import game from "./game"
import color from "color"

let gameIsOn = false;

function newPlayer() {
}

let players = 1
const controls = [
	{ jump: "KeyW", right: "KeyD", left: "KeyA" },
	{ jump: "ArrowUp", right: "ArrowRight", left: "ArrowLeft" },
	{ jump: "KeyI", right: "KeyL", left: "KeyJ" }
]
const maxPlayers = controls.length

/**
 * Start the game
 */
function startGame() {
	if (gameIsOn) return;
	else gameIsOn = true;

	const canvas = document.getElementById("gamecanvas");
	const ctx = canvas.getContext("2d");

	const gamemenu = document.getElementById("gamemenu");

	const elements = {
		startgame: document.getElementById("start"),
		name: document.getElementById("name"),
		playerlist: document.getElementById("playerlist"),
		players: document.getElementById("players"),
		plus: document.getElementById("player-plus"),
		minus: document.getElementById("player-minus"),
	}

	let changePlayers = d => {
		if (d <= maxPlayers && d > 0) {
			players = d
			elements.players.value = d
		}
	}

	elements.plus.addEventListener('click', () => {
		changePlayers(players + 1)
	})
	elements.minus.addEventListener('click', () => {
		changePlayers(players - 1)
	})

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
	//elements.newplayer.addEventListener("click", newPlayer);

	function newPlayer() {
		gameInstance.addPlayer({ name: elements.name.value, keys });
	}
}

startGame(); // Start an instance
