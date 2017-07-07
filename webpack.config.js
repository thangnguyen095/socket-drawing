var path = require('path');

module.exports = {
	entry: './src/app.js',
	output: {
		filename: 'app.js',
		path: path.resolve(__dirname, 'public/javascripts')
	},
	module: {
		loaders: [
			{test: /\.css$/, loader: 'style-loader!css-loader'}
		]
	}
}