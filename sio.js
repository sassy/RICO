

module.exports = function(server) {    
    var io = require('socket.io').listen(server);
    var redis = require("redis");
    var redisClient = redis.createClient();
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
};
