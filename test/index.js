'use strict';
/* global describe:false, it: false */
var chai = require('chai');
var expect = chai.expect;
var redis = require("redis");
var puttu = require('../app.js')

var client = redis.createClient();

client.on("error", function (err) {
  console.log('Redis Disconnected, stopping service')
  process.exit(0)
})

puttu.init(client);

describe('Methods Sanity Check', function () {
    describe('Init', function () {
        it('Should be a function', function (done) {
            expect(puttu.init).to.be.a('function');
            done();
        });
    });
    describe('Register', function () {
        it('should be a function', function (done) {
            expect(puttu.register).to.be.a('function');
            done();
        });
    });
    describe('Get', function () {
        it('should be a function', function (done) {
            expect(puttu.get).to.be.a('function');
            done();
        });
    });
    describe('Get Magic Key', function () {
        it('should be a function', function (done) {
            expect(puttu.getMagicKey).to.be.a('function');
            done();
        });
    });
});