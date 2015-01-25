"use strict";

var app = require('../app');
var http = require('http');
var sinon = require('sinon');
var io = require('socket.io-client');
var options = {
    'force new connection' : true,
    port : 3000
};
var assert = require('power-assert');

describe('sio', function() {
    var server;
    beforeEach(function() {
        server = http.createServer(app);
        server.listen(3000);
    });

    afterEach(function() {
        server.close();
    });

    it ('sio test', function() {
        var redisClient = require("node-redis-mock").createClient();
        var spy = sinon.spy(redisClient, "hkeys");
        assert(spy.called === false);
        var sio = require('../sio')(server, redisClient);
        assert(spy.called === true);
    });

    it ('connection test', function(done) {
        var redisClient = require("node-redis-mock").createClient();
        var spy = sinon.spy(redisClient, "hkeys");
        assert(spy.called === false);
        var sio = require('../sio')(server, redisClient);
        var socket = io.connect("http://localhost:3000", options);
        socket.on('connect', function() {
            done();
        });
    });

});
