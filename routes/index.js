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

		socket.on('storage', function(){
			loadAllDrawings(socket);
		});
	});

	function storeDrawing(data){
		var writer = fs.createWriteStream('./drawing.bin', {flags: 'a'});
		writer.on('open', function(){
			var str = data.x1 + ' ' + data.y1 + ' ' + data.x2 + ' ' + data.y2 + ' ' + data.color + ' ' + data.stroke + '\n';
			writer.write(str);
			// writer.end();
		});

	}

	function loadAllDrawings(socket){
		if(!fs.existsSync('./drawing.bin')){
			allDrawings = [];
			io.sockets.in(socket.id).emit('storage', allDrawings);
			return;
		}
		rd = rl.createInterface({input: fs.createReadStream('./drawing.bin')});
		rd.on('line', function(data){
			var res = data.split(" ");
			var drawing = new Drawing();
			drawing.x1 = res[0];
			drawing.y1 = res[1];
			drawing.x2 = res[2];
			drawing.y2 = res[3];
			drawing.color = res[4];
			drawing.stroke = res[5];
			allDrawings.push(drawing);
		});

		// send all drawing back to client
		rd.on('close', function(){
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