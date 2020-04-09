const path = require("path");

module.exports = {
	entry: {
		app: ["./client/index.js"]
	},
	output: {
		path: path.resolve(__dirname, "build"),
		publicPath: "/build",
		filename: "bundle.js"
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /(node_modules)/,
				use: {
					loader: "babel-loader",
					options: {
						presets: ["es2017"]
					}
				}
			}
		]
	},
	mode: "development"
}