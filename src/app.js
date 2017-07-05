var io = require('socket.io-client');

(function(){
	var socket = io();
	// adjust canvas size
	//var canvas = document.querySelector('canvas');
	var canvas = document.querySelector('canvas');
	var ctx = canvas.getContext('2d');
	canvas.addEventListener('resize', onResize);
	// make it take effect immediately
	onResize();
	// other events for drawing
	canvas.addEventListener('mousedown', onMouseDown);
	canvas.addEventListener('mousemove', onMouseMove);
	canvas.addEventListener('mouseup', onMouseUp);
	canvas.addEventListener('mouseout', onMouseUp);

	// add event handler for socket
	socket.on('drawing', onDrawing);

	// other variables
	var isDrawing = false; // show if user is drawing
	var x1;
	var y1;
	var w;
	var h;

	// event handlers
	function onResize(){
		canvas.width = w =  window.innerWidth;
		canvas.height = h = window.innerHeight;
	}

	function onMouseDown(e){
		isDrawing = true;
		x1 = e.clientX;
		y1 = e.clientY;
	}

	function onMouseUp(e){
		if(!isDrawing) return;
		isDrawing = false;
		Draw(x1, y1, e.clientX, e.clientY, true);
	}

	function onMouseMove(e){
		if(!isDrawing) return;
		Draw(x1, y1, e.clientX, e.clientY, true);
		x1 = e.clientX;
		y1 = e.clientY;
	}

	function Draw(x1, y1, x2, y2, emit){
		ctx.beginPath();
		ctx.moveTo(x1, y1);
		ctx.lineTo(x2, y2);
		ctx.lineWidth = 2;
		ctx.stroke();
		ctx.closePath();

		if(!emit)
			return;

		socket.emit('drawing', {
			x1: x1/w,
			y1: y1/h,
			x2: x2/w,
			y2: y2/h,
		});
	}

	function onDrawing(data){
		data.x1 *= w;
		data.y1 *= h;
		data.x2 *= w;
		data.y2 *= h;
		console.log(data);
		Draw(data.x1, data.y1, data.x2, data.y2, false);
	}

})();