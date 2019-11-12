const restify = require('restify');
var io = require('socket.io')(app);
var fs = require('fs');

var server = restify.createServer();
var io = socketio.listen(server.server);

var gpio = require('onoff').Gpio;
var pir = new gpio(21, 'in', 'both');
const led = new gpio(18, 'out');


server.get('/', function indexHTML(req, res, next) {
    fs.readFile(__dirname + '/index.html', function (err, data) {
        if (err) {
            next(err);
            return;
        }

        res.setHeader('Content-Type', 'text/html');
        res.writeHead(200);
        res.end(data);
        next();
    });
});


server.listen(8080, function () {
    led.writeSync(0);
    console.log('%s listening at %s', server.name, server.url);
});


io.sockets.on('connection', function (socket) {// WebSocket Connection
    var lightvalue = 0; //static variable for current status
    pir.watch(function (err, value) {
        socket.emit('statusChanged', lightvalue);
        // if (value == 1) {
        //     led.writeSync(value);
        // } else {
        //     led.writeSync(value);
        // }
    });
    // pushButton.watch(function (err, value) { //Watch for hardware interrupts on pushButton
    //     if (err) { //if an error
    //         console.error('There was an error', err); //output error message to console
    //         return;
    //     }
    //     lightvalue = value;
    //     socket.emit('light', lightvalue); //send button status to client
    // });
});


// server.get('/temp', function (req, res, next) {
//     const tempC = sensor.readSimpleC();
//     res.send({ temperature: tempC });
//     next();
// });

// server.listen(8080, function () {
//     console.log(`${tempC} degC`);
//     console.log('%s listening at %s', server.name, server.url);
// });


// const tempC = sensor.readSimpleC();
// var restify = require('restify');

// var gpio = require('onoff').Gpio;
// var pir = new gpio(21, 'in', 'both');

// function respond(req, res, next) {
//     res.send('hello ' + req.params.name);
//     next();
// }

// var server = restify.createServer();
// server.get('/hello/:name', respond);
// server.head('/hello/:name', respond);

// server.listen(8080, function () {
//     console.log(`${tempC} degC`);
//     console.log('%s listening at %s', server.name, server.url);
// });


// pir.watch(function (err, value) {
//     if (value == 1) {
//         console.log("Movment detected");
//         //sendMessage('Intruder alert');
//     } else {
//         console.log("Movment ended");
//         //sendMessage('Intruder gone');
//     }
// });