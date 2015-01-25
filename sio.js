
module.exports = function(server, redisClient) {
    var Promise = require("bluebird");

    function communicateId(server, redisClient) {
        var io = require('socket.io').listen(server);
        io.sockets.on('connection', function(socket) {
            redisClient.hkeys("users", function(err, replies) {
                replies.forEach(function(reply, i) {
                    socket.emit("recieveid", reply);
                });
            });
            socket.on("sendid", function(id) {
                redisClient.hset("users",  id, "open", function(err, reply) {
                    console.log(reply);
                });
                socket.broadcast.emit("recieveid", id);
            });

            socket.on("removeid", function(id) {
                redisClient.hdel("users", id, function(err, reply) {
                    console.log(reply);
                });
                socket.broadcast.emit("removeid", id);
            });

            socket.on("disconnect", function() {
            });
        });
    }

    var promise = new Promise(function(resolve, reject) {
        redisClient.hkeys("users", function(err, replies) {
            if (replies.length === 0) {
                resolve(server);
            }
            replies.forEach(function(reply, i) {
                redisClient.hdel("users", reply, function(err, reply) {
                    console.log(reply);
                });
                resolve(server);
            });
        });
    });
    promise.then(function(s) {
        communicateId(s, redisClient);
    }, function(error) {
        console.log(error);
    });
};
