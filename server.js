const express = require("express")
const app = express()
const path = require("path")

let port = 8080;

const index = process.argv.indexOf("-port");

if (index !== -1) {
	let newport = process.argv[index + 1]
	if (!isNaN(port)) port = newport;
}

app.use(function (req, res, next) {
	console.log(`${req.method}: ${req.url}`);
	next();
})

app.get("/", function (req, res) {
	res.sendFile(path.join(__dirname, "index.html"))
})

app.get("/delay", function (req, res) {
	setTimeout(() => {
		res.json({ true: true })
	}, 2500)
})

app.use(express.static("build"));

app.listen(port, () => {
	console.log("Bemilanche running on port " + port)
})