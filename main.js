var express = require('express');
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({
    extended: false
});

var HueSingleton = require('./module/Utils/HueSingleton');

var CronTask = require('./module/CronTask');

//new CronTask();

var application = express();

application.get('/informations', function (req, res) {
    var result = [];
    var rooms = HueSingleton.getRooms();
    for (var i in rooms){
        var room = rooms[i];
        var element = {
            name: i,
            lights: []
        };
        room.lights.forEach(function (light) {
            element.lights.push(light.entity.name);
        });
        result.push(element);
    }
    res.status(200).send(result);
});

application.get('/turn_on', function (req, res) {
    if (HueSingleton.getRoom(req.query['room'])) {
        HueSingleton.getRoom(req.query['room']).turnOn();
    }
    else if (HueSingleton.getLight(req.query['light'])) {
        HueSingleton.getLight(req.query['light']).turnOnLight();
    } else {
        HueSingleton.getRooms().forEach(function (room) {
            room.turnOn();
        });
    }
    res.status(200).send();
});

application.get('/light_off', function (req, res) {
    ongoingEffect = false;
    app.hue.setLightsOff();
    res.status(200).send();
});

application.get('/fire', function (req, res) {
    res.status(200).send();
    ongoingEffect = true;

    function restartFire() {
        if (ongoingEffect) {
            setTimeout(function () {
                app.hue.setFire(req.query['room']);
                restartFire();
            }, 500);
        }
    }

    restartFire();
});

application.listen(3001, function () {
    console.log("server init");
});
