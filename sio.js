var redis = require("redis");

if (process.env.REDISTOGO_URL) { //for Heroku
    var rtg = require("url").parse(process.env.REDISTOGO_URL);
    var redisClient = redis.createClient(rtg.port, rgt.hostname);
    redisClient.auth(rtg.auth.split(":")[1]);
} else {
    var redisClient = redis.createClient();
}

var Promise = require("bluebird");

module.exports = function(server) {
    var promise = new Promise(function(resolve, reject) {
        redisClient.hkeys("users", function(err, replies) {
            if (replies.length === 0) {
                resolve(server);
            }
            replies.forEach(function(reply, i) {
                redisClient.hdel("users", reply, redis.print);
                resolve(server);
            });
        });
    });
    promise.then(function(s) {
        var io = require('socket.io').listen(s);
        io.sockets.on('connection', function(socket) {
            redisClient.hkeys("users", function(err, replies) {
                replies.forEach(function(reply, i) {
                    socket.emit("recieveid", reply);
                });
            });
            socket.on("sendid", function(id) {
                redisClient.hset("users",  id, "open", redis.print);
                socket.broadcast.emit("recieveid", id);
            });

            socket.on("removeid", function(id) {
                redisClient.hdel("users", id, redis.print);
                socket.broadcast.emit("removeid", id);
            });

            socket.on("disconnect", function() {
            });
        });
    }, function(error) {
        console.log(error);
    });
};
