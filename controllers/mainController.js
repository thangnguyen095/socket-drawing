var file = require('../models/file');

module.exports = function(io){
	var socketId = null;

	io.on('connection', function(socket){
		socketId = socket.id;
		file.loadAllDrawings(emitStorage);
		socket.on('drawing', function(data){
			// receive data and write to a file
			file.storeDrawing(data);
			socket.broadcast.emit('drawing', data);
		});

		socket.on('storage', function(){
			file.loadAllDrawings(emitStorage);
		});
	});

	function emitStorage(data){
		if(data && socketId){
			io.sockets.to(socketId).emit('storage', data);
		}
	}

	var view = function(req, res, next){
		res.render('index', {title: 'Doodle board'});
	}

	return {view: view}
}