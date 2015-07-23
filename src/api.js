// Dependencies

var request = require('request');

// Crendentials helper object

var credentials = require('./credentials');

var api = {
    call: function(method, params, callback) {
        params = params || {};
        params['api_key'] = credentials.key;
        params['per_page'] = 100;
        params.sort = 'interestingness-desc';
        params.method = method;
        params.format = 'json';

        // Send the post request
        request.post({url: credentials.endpoint, formData: params}, function(err, httpResponse, body) {
            if (err) {
                throw err;
            }
            if (httpResponse.statusCode === 200) {
                // Clean the response
                var start = body.indexOf('{');
                var end = body.lastIndexOf('}');
                var cleanedBody = body.substring(start, end + 1);

                // Give it to the callback
                callback(JSON.parse(cleanedBody));
            }
        });
    },
    fetchPhoto: function(url) {
        return request.get(url)
            .on('error', function(err) {
                console.log(err);
            });
    }
};

module.exports = api;
