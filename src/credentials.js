// Get the config object

var config = require('../config.json');

module.exports = {
    endpoint: 'https://flickr.com/services/rest',
    key: config.apiKey
};
