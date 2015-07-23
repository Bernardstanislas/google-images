// Dependencies

var worker = require('./worker');
var prompt = require('prompt');

// Params

var destination = __dirname + '/../downloads/';

// Build the CLI

console.log('Hello there ! Welcome to the image downloader.');

// Schema for total prompt
var totalSchema = {
    properties: {
        total: {
            pattern: /^[0-9]+$/,
            message: 'Total must be only digits.',
            required: true
        }
    }
};

// Schema for query prompt
var querySchema = {
    properties: {
        query: {
            pattern: /^[a-zA-Z\s]+$/,
            message: 'Query must be only letters and spaces.',
            required: true
        }
    }
};

// Ask first for the query
prompt.get(querySchema, function(error, data) {
    if (error) {
        process.exit(1);
    }
    // We got the query, extract the tags
    var tags = data.query.replace(' ', ',');

    // Search for the given tags
    worker.search(tags, function(response) {
        var photos = response.photos;
        var summary = {
            perPage: photos.perpage,
            pages: photos.pages
        };

        console.log(photos.total + ' photos found, how much do you want ? (up to 4000)');

        // Now ask how many photos to fetch
        prompt.get(totalSchema, function(error, data) {
            if (error) {
                process.exit(1);
            }
            // We got the total, let's fetch !
            var preparationProgress = 0;
            var totalPages = Math.floor((data.total - 1) / summary.perPage) + 1;
            worker.prepareFetch(summary, tags, data.total, function reportProgress() {
                console.log('Preparation : ' + Math.round(100 * ++preparationProgress / totalPages) + '%');
            }, function fetchPhotos(preparedPhotos) {
                var totalPhotos = totalPages * summary.perPage;
                var fetchProgress = 0;
                worker.fetch(preparedPhotos, destination, function reportProgress() {
                    console.log('Download : ' + Math.round(100 * ++fetchProgress / totalPhotos) + '%');
                }, function onAllDone() {
                    console.log('All done !');
                });
            });
        });
    });
});

// Launch the CLI

prompt.start();

// var tags = 'frites'.replace(' ', ',');
//
// worker.search(tags, function(response) {
//     var photos = response.photos;
//     var summary = {
//         perPage: photos.perpage,
//         pages: photos.pages
//     };
//     var count = 10;
//     worker.prepareFetch(summary, tags, count, function(preparedPhotos) {
//         worker.fetch(preparedPhotos, destination, console.log);
//     });
// });
