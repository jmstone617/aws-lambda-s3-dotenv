aws-lambda-s3-dotenv
====================

AWS's [Lambda functions](https://aws.amazon.com/lambda/) are incredibly powerful constructs for any cloud architecture. Coupled with [versions](https://docs.aws.amazon.com/lambda/latest/dg/versioning-intro.html) and [aliases](https://docs.aws.amazon.com/lambda/latest/dg/aliases-intro.html), Lambda is well-suited for many use cases.

However...

Since environment variables are tied to a function's version, and not its alias, it makes it really difficult to do things like use the same Lambda function but point it at different environments (e.g. Dev, QA, Prod). Barring this functionality, this module will read configuration from an S3 bucket, store it in a path you specify (inside of `/tmp`), and either read the config from the filesystem cache, or refresh from S3.

A common way of loading configurable environment variables is the popular module [dotenv](https://github.com/motdotla/dotenv). As such, this module will first check to see if there's a `.env` file in a cache location you specify (again, this should be prefixed with `/tmp` if you are running this on Lambda, as this is the only writable filepath). If it cannot find a local file to use, it will fetch a file from S3 and save it to the cache location.

*TIP:* It is helpful to pass the cache location as an environment variable separate from dotenv, as you can use something like `CONFIG_LOCATION = .env` for development on your local machine and `CONFIG_LOCATION = /tmp` in Lambda.

## Installation
`npm install aws-lambda-s3-dotenv`

## Usage
```
const loadConfig = require("aws-lambda-s3-dotenv");

exports.handler = function (event, context, callback) {
    let cacheLocation = ".env";
    loadConfig(cacheLocation, "s3-bucket", "s3-bucket-key", function(err) {
        if (err) console.log(err);
        else {
            require('dotenv').config({path: cacheLocation});

            // Do stuff with your environment variables
            
            callback();
        }
    });
}
```

## Tests
`npm test`