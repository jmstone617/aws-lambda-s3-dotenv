'use strict'

var expect = require('chai').expect;
var AWS = require('aws-sdk-mock');
const fs = require('fs');
const loadConfig = require("../index");

AWS.mock('S3', 'getObject', function(params, callback) {
    const data = {};
    data.Body = 'thing';
    logger.info(data);
    callback(null, data);
});

describe("#loadConfig", function() {
    describe("with no cache", function() {
        
    });

    describe("with cache", function() {
        it("should find the file", function() {
            let cacheLocation = "./test/.env.test";
            expect(fs.existsSync(cacheLocation)).to.equal(true);
        });

        it("should load the cached file", function(done) {
            let cacheLocation = "./test/.env.test";
            loadConfig(cacheLocation, "s3-bucket", ".env.test", function(err) {
                if (err) done(err);
                else {
                    require('dotenv').config({path: cacheLocation});
                    expect(process.env.TEST_VALUE).to.eq('10');
                    done();
                }
            });
        });
    });
});

AWS.restore();