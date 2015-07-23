"use strict";

var credentials = require('./credentials.json');
var fs = require('fs');
var request = require('request');

var args = process.argv.slice(2);

var query = args[0].replace(' ', ',');
var hits = args[1];

var host = 'https://flickr.com/services/rest';


function callAPI(method, params, callback) {
    params = params || {};
    params['api_key'] = credentials.key;
    params.method = method;
    params.format = 'json';
    request.post({url: host, formData: params}, function(err, httpResponse, body) {
        if (err) {
            throw err;
        }
        if (httpResponse.statusCode === 200) {
            // Clean the response
            var start = body.indexOf('{');
            var end = body.lastIndexOf('}');
            var cleanedBody = body.substring(start, end + 1);
            callback(cleanedBody);
        }
    });
}

callAPI('flickr.photos.search', {tags: query}, function(payload) {
    var results = JSON.parse(payload);
    console.log('Found ' + results.photos.total + ' hits.');
});
