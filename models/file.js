var fs = require('fs');
var rl = require('readline');
var Drawing = require('../objects/drawing');

var allDrawings = new Array();

module.exports.storeDrawing = function(data){
	var writer = fs.createWriteStream('./drawing.bin', {flags: 'a'});
	writer.on('open', function(){
		var str = data.x1 + ' ' + data.y1 + ' ' + data.x2 + ' ' + data.y2 + ' ' + data.color + ' ' + data.stroke + '\n';
		writer.write(str);
		// writer.end();
	});
}

module.exports.loadAllDrawings = function(callback){
	if(!fs.existsSync('./drawing.bin')){
		allDrawings = [];
		callback(allDrawings);
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
		callback(allDrawings);
	});		
}