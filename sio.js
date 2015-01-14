

module.exports = function(server) {
    var io = require('socket.io').listen(server);
    io.sockets.on('connection', function(socket) {
        socket.on("sendid", function(id) {
            console.log(id);
            socket.broadcast.emit("recieveid", id);
        });
    });
};
