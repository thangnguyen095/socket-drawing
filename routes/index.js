module.exports = function(io){
	var app = require('express');
	var router = app.Router();
	var fs = require('fs');
	var Drawing = require('../objects/drawing');
	var allDrawings = new Array();
	var rl = require('readline');

	router.get('/', function(req, res, next){
		res.render('index', {title: 'realtime doodling with socket.io'});
	});

	io.on('connection', function(socket){
		loadAllDrawings(socket);
		socket.on('drawing', function(data){
			// receive data and write to a file
			storeDrawing(data);
			socket.broadcast.emit('drawing', data);
		});
	});

	function storeDrawing(data){
		// fs.open('./drawing.bin', 'a', (err, fd) => {
		// 	if(err)
		// 		throw err;

		// 	// write data to file
		// 	fs.write(fd, data.x1, 0, 8, null);
		// 	fs.write(fd, data.y1, 0, 8, null);
		// 	fs.write(fd, data.x2, 0, 8, null);
		// 	fs.write(fd, data.y2, 0, 8, null);
		// 	// close file when done
		// 	fs.close(fd);
		// });

		var writer = fs.createWriteStream('./drawing.bin', {flags: 'a'});
		writer.on('open', function(){
			writer.write(data.x1 + '\n');
			writer.write(data.y1 + '\n');
			writer.write(data.x2 + '\n');
			writer.write(data.y2 + '\n');
			writer.write(data.color + '\n');
			writer.write(data.stroke + '\n');
			//writer.end();
		});

	}

	function loadAllDrawings(socket){
		rd = rl.createInterface({input: fs.createReadStream('./drawing.bin')});
		var i = 0;
		var drawing;
		rd.on('line', function(data){
			// console.log('line');
			switch(i){
				case 0:
					drawing = new Drawing();
					drawing.x1 = parseFloat(data);
				break;
				case 1:
					drawing.y1 = parseFloat(data);
				break;
				case 2:
					drawing.x2 = parseFloat(data);
				break;
				case 3:
					drawing.y2 = parseFloat(data);
				break;
				case 4:
					drawing.color = data;
				break;
				case 5:
					drawing.stroke = parseFloat(data);
					allDrawings.push(drawing);
				break;
			}
			i = ++i%6;
		});

		// send all drawing back to client
		rd.on('close', function(){
			// socket.to(socket.id).emit('storage', allDrawings);
			io.sockets.in(socket.id).emit('storage', allDrawings);
		});
	}

	function readNumber(storage){
		fs.read(fd, storage, 0, 8, null, (err, byte, buffer) => {
			if(err) return false;
		});
		return true;
	}

	return router;
}