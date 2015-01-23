var answer_call = null;

function rfc(api_key) {
    var peer = new Peer({key : api_key});

    var peer_id;

    peer.on('open', function(id) {
        peer_id = id;
        var socket = io.connect();
        socket.on('connect', function() {
            socket.emit("sendid", id);
            $("#peer_id").text(id);
        });
        socket.on('recieveid', function(id) {
            $("#peerlist").append('<a href="#" class="list-group-item" id="' + id + '">' + id + '</a>').bind('click', offer);
        });
        socket.on('removeid', function(id) {
            $("#" + id).remove();
        });

        peer.on('close', function(id) {
            if (peer_id !== undefined) {
                socket.emit('removeid', peer_id);
                peer_id = undefined;
            }
        });

        window.onbeforeunload = function() {
            console.log("remove:" +  peer_id);
            socket.emit('removeid', peer_id);
            peer.destroy();
            peer_id = undefined;
        };
    });

    function offer(event) {
        var call_id = event.target.id;
        if (navigator.webkitGetUserMedia) {
            navigator.getUserMedia = navigator.webkitGetUserMedia;
        } else if(navigator.mozGetUserMedia) {
            navigator.getUserMedia = navigator.mozGetUserMedia;
        }
        if (navigator.getUserMedia) {
            navigator.getUserMedia({video:true, audio:true}, function(mediaStream) {
                var call = peer.call(call_id, mediaStream);
                call.on('stream', function(stream) {
                    var video = document.querySelector('video');
                    video.src = window.URL.createObjectURL(stream);
                });
            }, function(e) {
                console.log(e);
            });
        }
        console.log(call_id);
    }

    peer.on('connection', function(conn) {
        conn.on('data', function(data) {
            document.getElementById('message').innerText = data;
        });
    });

    peer.on('call', function(call) {
        $('#ans_button').removeAttr('disabled');
        answer_call = call;
    });
}

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
