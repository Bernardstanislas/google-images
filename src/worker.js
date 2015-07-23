// Dependencies

var async = require('async');
var fs = require('fs');
var api = require('./api');
var parser = require('./parser');

var worker = {
    search: function(tags, callback, page) {
        page = page || 1;
        api.call('flickr.photos.search', {tags: tags, media: 'photos', page: page}, callback);
    },
    prepareFetch: function(summary, tags, count, progressReporter, callback) {
        var self = this;
        count = count > 4000 ? 4000 : count;
        // Construct the pages array
        var pagesArray = [];
        for (var i = 1; i < summary.pages && i < ((count / summary.perPage) + 1); i++) {
            pagesArray.push(i);
        }
        // Create the async calls
        async.map(pagesArray, function(page, cb) {
            // Call a search on the api
            self.search(tags, function(response) {
                var photos = response.photos.photo;
                var parsedPhotos = photos.map(parser.parse);
                progressReporter();
                cb(null, parsedPhotos);
            }, page);
        }, function(error, results) {
            // Results is an array of parsed photos, so concat it all !
            var parsedPhotos = results.reduce(function(result, chunk) {
                result = result.concat(chunk);
                return result;
            }, []);
            // Eventually send back all the parsed photos
            callback(parsedPhotos);
        });
    },
    fetch: function(photos, destination, progressReporter, callback) {
        var self = this;
        // Create the async calls
        async.map(photos, function(photo, cb) {
            // Get the photo and pipe it to the save method
            api.fetchPhoto(photo.url, cb).pipe(self.save(destination, photo.title, photo.id).on('finish', progressReporter));
        }, function() {
            // Explicit the function, to get rid of the empty array
            callback();
        });
    },
    save: function(destination, title, id) {
        // Save it to the file system
        return fs.createWriteStream(destination + id + '.jpg');
    }
};

module.exports = worker;
