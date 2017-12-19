'use strict'

const fs = require('fs');
const path = require('path');
var S3 = require('aws-sdk/clients/s3');

function getFromS3(bucket, key, savePath, callback) {
    let s3 = new S3();
    let params = {
        Bucket: bucket,
        Key: key
    };

    if (!fs.existsSync(path.dirname(savePath))) {
        fs.mkdirSync(path.dirname(savePath));
    }
    
    var file = fs.createWriteStream(savePath);
    file.on('close', function() {
        console.log("File successfully saved");
        callback(null);
    });

    s3.getObject(params).createReadStream().on('error', function(err) {
        callback(err);
    }).pipe(file);
}

/**
 * 
 * @param {string} localPath - Path where .env file cache is located. This will be in the /tmp directory
 * @param {string} bucket - S3 bucket name
 * @param {string} key - S3 key name
 * @callback callback 
 * @param {object} err - Error object
 */
module.exports = function(localPath, bucket, key, callback) {
    if (fs.existsSync(localPath)) {
        callback(null);
    }
    else {
        getFromS3(bucket, key, localPath, function(err) {
            if (err) {
                callback(err);
            }
            else {
                callback(null);
            }
        });
    }
}