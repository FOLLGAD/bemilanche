const express = require("express")
const app = express()
const path = require("path")

let port = 8080;

const index = process.argv.indexOf("-port");

if (index !== -1) {
	let newport = process.argv[index + 1] // Get port out of args
	if (!isNaN(port)) port = newport; // Confirm that the port is a valid one
}

app.use(function (req, res, next) {
	console.log(`${req.method}: ${req.url}`);
	next();
})

app.get("/", function (req, res) {
	res.sendFile(path.join(__dirname, "index.html")) // Serve the index page, which includes the game bundle
})

app.get("/delay", function (req, res) {
	setTimeout(() => {
		res.json({ true: true })
	}, 2500)
})

app.use(express.static("build")); // Set build as a static serve dir, making the bundle.js accessible from "/bundle.js"

app.listen(port, () => {
	console.log("Bemilanche running on port " + port) // Log the port
})