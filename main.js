var express = require('express');
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({
    extended: false
});

var HueSingleton = require('./module/Utils/HueSingleton');
var config = require('./module/Utils/ConfigSingleton');

var CronTask = require('./module/CronTask');

new CronTask();

var application = express();

application.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

application.get('/informations', function(req, res) {
    var result = [];
    var rooms = HueSingleton.getRooms();
    for (var i in rooms) {
        var room = rooms[i];
        var element = {
            name: i,
            id: room.entity.id,
            lights: []
        };
        room.lights.forEach(function(light) {
            element.lights.push(light.entity.name);
        });
        result.push(element);
    }
    res.status(200).send(result);
});

application.get('/turn_on/:object', function(req, res) {
    req.object.turnOn();
    res.status(200).send("miaw");
});

application.get('/turn_on', function(req, res) {
    var rooms = HueSingleton.getRooms();
    for (var i in rooms) {
        rooms[i].turnOn();
    }

    res.status(200).send("All in one");
});

application.get('/turn_off/:object', function(req, res) {
    req.object.turnOff();
    res.status(200).send("miaw");
});

application.get('/turn_off', function(req, res) {
    var rooms = HueSingleton.getRooms();
    for (var i in rooms) {
        rooms[i].turnOff();
    }
    res.status(200).send("All in one");
});

application.param('object', function(req, res, next) {
    var object;
    if (object = HueSingleton.getRoom(req.params.object)) {
        req.object = object;
    } else if (object = HueSingleton.getLight(req.params.object)) {
        req.object = object;
    } else {
        res.status(404).send("sniffff");
        return;
    }
    return next();
});

application.param('room', function(req, res, next) {
    var room = HueSingleton.getRoom(req.params.room);
    if (!room) {
        res.status(404).send("sniffff");
    } else {
        req.room = room ? room : null;
        return next();
    }
});

application.get('/fire', function(req, res) {
    res.redirect('/fire/Salon');
});

application.get('/fire/:room', function(req, res) {
    console.log("fire in " + req.room.entity.name);
    req.room.fire();
});

application.listen(config.server.port, function() {
    console.log("server init");
});
