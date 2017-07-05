module.exports = function(io){
	var app = require('express');
	var router = app.Router();

	router.get('/', function(req, res, next){
		res.render('index', {title: 'DEMO SOCKET.IO'});
	});

	io.of('/').on('connection', function(socket){
		socket.on('drawing', function(data){
			// console.log('data received');
			socket.broadcast.emit('drawing', data);
		});
	});

	return router;
}