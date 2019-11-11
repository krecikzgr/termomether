const sensor = require('ds18b20-raspi');
const tempC = sensor.readSimpleC();
var restify = require('restify');

var gpio = require('onoff').Gpio;
var pir = new gpio(21, 'in', 'both');

function respond(req, res, next) {
    res.send('hello ' + req.params.name);
    next();
}

var server = restify.createServer();
server.get('/hello/:name', respond);
server.head('/hello/:name', respond);

server.listen(8080, function () {
    console.log(`${tempC} degC`);
    console.log('%s listening at %s', server.name, server.url);
});


pir.watch(function (err, value) {
    if (value == 1) {
        console.log("Movment detected");
        //sendMessage('Intruder alert');
    } else {
        console.log("Movment ended");
        //sendMessage('Intruder gone');
    }
});