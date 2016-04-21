var express = require('express');
var path = require('path');


var app = express();

app.get('/favicon.ico', function(req, res) {
  
})

// static files
app.use(express.static(path.join(__dirname, 'front')));



// catch 404 and forward to error handler
app.use(function(req, res) {
	res.sendFile('./front/404.html');
	res.end();
});


// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
	app.use(function(err, req, res) {
		console.error(err);
		res.send('error', {
			error: err,
			msg: err.message
		})
		res.end();
	});
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
	res.status(err.status || 500);
	res.send({
		error: err,
		msg: err.message
	});
});


module.exports = app;
