var redis = require("redis");
var redisClient = redis.createClient();
var Promise = require("bluebird");

module.exports = function(server) {

    var promise = new Promise(function(resolve, reject) {
        redisClient.hkeys("users", function(err, replies) {
            replies.forEach(function(reply, i) {
                redisClient.hdel("users", reply, redis.print);
                resolve(server);
            });
        });
    });
    promise.then(function(s) {
        var io = require('socket.io').listen(s);
        var self_id = null;
        io.sockets.on('connection', function(socket) {
            redisClient.hkeys("users", function(err, replies) {
                replies.forEach(function(reply, i) {
                    socket.emit("recieveid", reply);
                });
            });
            socket.on("sendid", function(id) {
                console.log(id);
                self_id = id;
                redisClient.hset("users",  self_id, "open", redis.print);
                socket.broadcast.emit("recieveid", id);
            });

            socket.on("disconnect", function() {
                if (self_id != null) {
                    redisClient.hdel("users", self_id, redis.print);
                }
            });
        });
    }, function(error) {
        console.log(error);
    });
};
