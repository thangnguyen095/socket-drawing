var path = require('path');

module.exports = {
	entry: './src/app.js',
	output: {
		filename: 'app.js',
		path: path.resolve(__dirname, 'public/javascripts')
	}
}