var app = require('express');
var router = app.Router();

module.exports = function(io){
	var mainController = require('../controllers/mainController')(io);
	router.get('/', mainController.view);

	return router;
}