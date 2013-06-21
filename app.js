var express = require('express');
var io = require('socket.io');
var mongoose = require ("mongoose");

var port = process.env.PORT || 5000;

var app = express.createServer(express.logger());
var io = io.listen(app);


///////// CORS middleware (just for testing) /////////

// app.use(express.methodOverride());
// var allowCrossDomain = function(req, res, next) {
    // res.header('Access-Control-Allow-Origin', '*');
    // res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    // res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
    // // intercept OPTIONS method
    // if ('OPTIONS' == req.method) {
      // res.send(200);
    // }
    // else {
      // next();
    // }
// };
// app.use(allowCrossDomain);

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

Mongo.logSchema = new mongoose.Schema({
  timestamp: { type: Number },
  device_id: { type: String, trim: true },
  action: { type: String, trim: true },
  data: { type: mongoose.Schema.Types.Mixed }
});

Mongo.Message = mongoose.model('messages', Mongo.messageSchema);
Mongo.Log = mongoose.model('logs', Mongo.logSchema);

///////// MONGODB END /////////

app.use(express.bodyParser());
app.use(express.static(__dirname + '/analytics'));

// assuming io is the Socket.IO server object
io.configure(function () { 
  io.set("transports", ["xhr-polling"]); 
  io.set("polling duration", 10); 
});

app.post('/proxy', function (req, res) {
	// console.log(res);
	try {
		var logs = req.body.logs;
		// Saving log in DB
		for (var i = 0; i < logs.length; i++) {
		    var _log = new Mongo.Log(logs[i]);
		    _log.save();
		}
	}
	catch(ex){
		console.log('+++++ ERROR: '+ex);
	}
	res.send({ result: true });
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




