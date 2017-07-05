module.exports = function(io){
	var app = require('express');
	var router = app.Router();
	var fs = require('fs');
	var drawing = new Array();

	router.get('/', function(req, res, next){
		// loadAllDrawings();
		res.render('index', {title: 'DEMO SOCKET.IO', drawing: drawing});
	});

	io.of('/').on('connection', function(socket){
		socket.on('drawing', function(data){
			// receive data and write to a file
			// storeDrawing(data);
			socket.broadcast.emit('drawing', data);
		});
	});

	function storeDrawing(data){
		fs.open('../drawing.bin', 'ax', (err, fd) => {
			if(err)
				throw err;

			// write data to file
			fs.write(fd, data.x1, 0, 8, null, null);
			fs.write(fd, data.y1, 0, 8, null, null);
			fs.write(fd, data.x2, 0, 8, null, null);
			fs.write(fd, data.y2, 0, 8, null, null);
			// close file when done
			fs.close(fd, null);
		});
	}

	function loadAllDrawings(){
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