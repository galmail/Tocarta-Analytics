var express = require('express');
var io = require('socket.io');

var port = process.env.PORT || 5000;
var app = express.createServer(express.logger());
var io = io.listen(app);

app.use(express.bodyParser());

// assuming io is the Socket.IO server object
io.configure(function () { 
  io.set("transports", ["xhr-polling"]); 
  io.set("polling duration", 10); 
});

app.get('/', function(request, response) {
  response.send('ToCarta NodeJS Server is up!');
});

app.get('/test', function (req, res) {
  res.sendfile(__dirname + '/client/index.html');
});

app.get('/dist*', function (req, res) {
	console.log('aaaaaa');
  res.sendfile(__dirname + '/client/dist/socket.io.js');
});


app.get('/proxy', function (req, res) {
	var channel = req.query["channel"];
	var action = req.query["action"];
	if(channel!=null && action!=null){
		console.log("sending action: "+action+" on channel: "+channel);
		var new_action = decodeURI(action);
		try { new_action = JSON.parse(new_action); } catch(ex){}
		io.sockets.emit(channel, { action: new_action});
		res.send('Push notification sent');
	}
	else {
		res.send('Channel and Action params are incorrect.');
	}
});

app.listen(port, function() {
  console.log("Listening on " + port);
});

io.sockets.on('connection', function (socket) {
	console.log("Looks like someone got connected");
	// console.log("Sending data to restaurant_1");
  // socket.emit('restaurant_1', { update: 'yes', send_status: 'no' });
  
  // socket.on('my other event', function (data) {
    // console.log(data);
  // });
  
});




