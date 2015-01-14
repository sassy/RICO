var peer = new Peer({key : ''});

var peer_id;
peer.on('open', function(id) {
    var socket = io.connect();
    console.log(io);
    socket.on('connect', function() {
        console.log(id);
        socket.emit("sendid", id);
    });
    socket.on('recieveid', function(id) {
        peer_id = id;
        $("#peerlist").append('<a href="#" class="list-group-item">' + peer_id + '</a>').bind('click', offer);
    });
});

function offer() {
    if (navigator.webkitGetUserMedia) {
        navigator.getUserMedia = navigator.webkitGetUserMedia;
    } else if(navigator.mozGetUserMedia) {
        navigator.getUserMedia = navigator.mozGetUserMedia;
    }
    if (navigator.getUserMedia) {
        navigator.getUserMedia({video:true, audio:true}, function(mediaStream) {
            var call = peer.call(peer_id, mediaStream);
            call.on('stream', function(stream) {
                var video = document.querySelector('video');
                video.src = window.URL.createObjectURL(stream);
            });
        }, function(e) {
            console.log(e);
        });
    }
    console.log(peer_id);
}

peer.on('connection', function(conn) {
    conn.on('data', function(data) {
        document.getElementById('message').innerText = data;
    });
});

var answer_call = null;
peer.on('call', function(call) {
    $('#ans_button').removeAttr('disabled');
    answer_call = call;
});

function answer() {
    if (navigator.webkitGetUserMedia) {
        navigator.getUserMedia = navigator.webkitGetUserMedia;
    } else if(navigator.mozGetUserMedia) {
        navigator.getUserMedia = navigator.mozGetUserMedia;
    }
    if (navigator.getUserMedia) {
        navigator.getUserMedia({video:true, audio:true}, function(mediaStream) {
            answer_call.answer(mediaStream);
            answer_call.on('stream', function(stream) {
                var video = document.querySelector('video');
                video.src = window.URL.createObjectURL(stream);
            });
        }, function(e) {
            console.log(e);
        });
    }
}
