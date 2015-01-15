"use strict";

var request = require('supertest');
var app = require('../app');

describe('index', function() {
    it ('should return 200', function(done) {
        request(app)
            .get('/')
            .expect(200)
            .end(function(err, ret) {
                if (err) {
                    throw err;
                }
                done();
            });
        
    });
});