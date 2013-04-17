var express = require('express');
var io = require('socket.io');
var mongoose = require ("mongoose");

var port = process.env.PORT || 5000;

var app = express.createServer(express.logger());
var io = io.listen(app);

///////// MONGODB START /////////

var Mongo = {};

Mongo.uri = process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || 'mongodb://localhost/mydb';

mongoose.connect(Mongo.uri, function (err, res) {
  if (err) { 
  	console.log ('ERROR connecting to: ' + Mongo.uri + '. ' + err);
  } else {
  	console.log ('Succeeded connected to: ' + Mongo.uri);
  }
});

Mongo.messageSchema = new mongoose.Schema({
  channel: { type: String, trim: true },
  action: { type: mongoose.Schema.Types.Mixed }
});

Mongo.Message = mongoose.model('messages', Mongo.messageSchema);

///////// MONGODB END /////////

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
		
		// Saving message in DB
		var message = new Mongo.Message ({
		  channel: channel,
		  action: new_action
		});  
		message.save(function (err) {if (err) console.log ('Error on save!')});
		
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




