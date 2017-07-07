var io = require('socket.io-client');

(function(){
	var socket = io();
	var canvas = document.querySelector('canvas');
	var ctx = canvas.getContext('2d');
	var colors = document.getElementById('colors');
	var overlap = document.getElementById('overlap');
	var strokeE = document.getElementById('stroke');

	// adjust canvas size
	window.addEventListener('contextmenu', function(e){ e.preventDefault(); }); // disable context menu
	window.addEventListener('resize', onResize);
	// make it take effect immediately
	onResize();
	// other events for drawing
	canvas.addEventListener('mousedown', onMouseDown);
	window.addEventListener('mousemove', onMouseMove);
	window.addEventListener('mouseup', onMouseUp);
	window.addEventListener('mouseout', onMouseUp);
	// event for selecting color
	colors.addEventListener('click', selectColor);
	// event for chosing stroke
	strokeE.addEventListener('mousedown', enableStroking);
	window.addEventListener('mousemove', onStroking);
	window.addEventListener('mouseup', disableStroking);
	//window.addEventListener('mouseout', disableStroking);

	// add event handler for socket
	socket.on('drawing', onDrawing);
	socket.on('storage', drawAll);
	// other variables
	var isDrawing = false; // show if user is drawing
	var x1;
	var y1;
	var w;
	var h;
	var color = 'black';
	var stroke = 10;
	var isStroking = false;

	// event handlers
	function onResize(){
		canvas.width = w =  window.innerWidth;
		canvas.height = h = window.innerHeight;
		socket.emit('storage');
		showOverlap();
	}

	function onMouseDown(e){
		isDrawing = true;
		x1 = e.clientX;
		y1 = e.clientY;
	}

	function onMouseUp(e){
		if(!isDrawing) return;
		isDrawing = false;
		Draw(x1, y1, e.clientX, e.clientY, color, stroke, true);
	}

	function onMouseMove(e){
		if(!isDrawing) return;
		Draw(x1, y1, e.clientX, e.clientY, color, stroke, true);
		x1 = e.clientX;
		y1 = e.clientY;
	}

	function Draw(x1, y1, x2, y2, color, stroke, emit){
		ctx.beginPath();
		ctx.moveTo(x1, y1);
		ctx.lineTo(x2, y2);
		ctx.lineWidth = stroke;
		ctx.lineCap = 'round';
		ctx.strokeStyle = color;
		ctx.stroke();
		ctx.closePath();

		if(!emit)
			return;

		socket.emit('drawing', {
			x1: x1/w,
			y1: y1/h,
			x2: x2/w,
			y2: y2/h,
			color: color,
			stroke: stroke
		});
	}

	function onDrawing(data){
		data.x1 *= w;
		data.y1 *= h;
		data.x2 *= w;
		data.y2 *= h;
		Draw(data.x1, data.y1, data.x2, data.y2, data.color, data.stroke, false);
	}

	function drawAll(data){
		data.forEach(function(item){
			item.x1 *= w;
			item.y1 *= h;
			item.x2 *= w;
			item.y2 *= h;
			Draw(item.x1, item.y1, item.x2, item.y2, item.color, item.stroke, false);
		});
		hideOverlap();
	}

	function throttle(callback, delay){
		var lastCall = new Date().getTime();
		return function(){
			var now = new Date().getTime();
			if((now - lastCall) > delay)
			{
				lastCall = now;
				callback.apply(null, arguments);
			}
		}
	}

	function selectColor(e){
		var black = document.getElementById('black');
		var white = document.getElementById('white');
		var red = document.getElementById('red');
		var blue = document.getElementById('blue');
		if(e.target !== colors){ // child clicked
			return applyColor(e.target.id);
		}
		return false;
	}

	function applyColor(name){
		color = name;
	}

	function hideOverlap(){
		overlap.style.display = 'none';
	}

	function showOverlap(){
		overlap.style.display = 'block';
	}

	function enableStroking(e){
		e.preventDefault();
		isStroking = true;
		y1 = e.clientY;
	}

	function disableStroking(){
		isStroking = false;
	}

	function onStroking(e){
		if(!isStroking)
			return;

		var d = parseInt((y1 - e.clientY)/10); // take integer only
		if(d == 0)
			return;

		stroke += d;
		stroke = Math.max(stroke, 5); // min 5 stroke
		stroke = Math.min(stroke, 30); // max 30 stroke
		y1 = e.clientY;
		var strokeDisplay = strokeE.children['stroke-display'];
		strokeDisplay.style.width = strokeDisplay.style.height = stroke +'px';
	}

})();