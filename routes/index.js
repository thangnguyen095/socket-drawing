module.exports = function(io){
	var app = require('express');
	var router = app.Router();
	var fs = require('fs');

	router.get('/', function(req, res, next){
		res.render('index', {title: 'DEMO SOCKET.IO'});
	});

	io.of('/').on('connection', function(socket){
		socket.on('drawing', function(data){
			// receive data and write to a file
			storeDrawing(data);
			socket.broadcast.emit('drawing', data);
		});
	});

	function storeDrawing(data){
		fs.open('../drawing.bin', 'ax', (err, fd) => {
			if(err)
				throw err;

			// write data to file

			// close file when done
			fs.close(fd, null);
		});
	}

	function loadAllDrawing(){
		fs.open('../drawing.bin', 'r', (err, fd) => {
			if(err)
				throw err;

			// read file

			// close file when done
			fs.close(fd, null);
		});
	}

	return router;
}