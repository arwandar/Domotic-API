var express = require('express');
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({
    extended: false
});

var HueSingleton = require('./module/Utils/HueSingleton');

var CronTask = require('./module/CronTask');

new CronTask();

var application = express();

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
    if (req.object) {
        req.object.turnOn();
        res.status(200).send("miaw");
    } else {
        res.status(404).send("sniffff");
    }

});

application.get('/turn_on', function(req, res) {
    var rooms = HueSingleton.getRooms();
    for (var i in rooms) {
        rooms[i].turnOn();
    }

    res.status(200).send("All in one");
});

application.get('/turn_off/:object', function(req, res) {
    if (req.object) {
        req.object.turnOff();
        res.status(200).send("miaw");
    } else {
        res.status(404).send("sniffff");
    }

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
        req.object = null;
    }
    return next();
});

application.get('/light_off', function(req, res) {
    ongoingEffect = false;
    app.hue.setLightsOff();
    res.status(200).send();
});

application.get('/fire', function(req, res) {
    res.status(200).send();
    ongoingEffect = true;

    function restartFire() {
        if (ongoingEffect) {
            setTimeout(function() {
                app.hue.setFire(req.query['room']);
                restartFire();
            }, 500);
        }
    }

    restartFire();
});

application.listen(3001, function() {
    console.log("server init");
});
