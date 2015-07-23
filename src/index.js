// Dependencies

var worker = require('./worker');
var prompt = require('prompt');
var ProgressBar = require('progress');

// Params

var destination = __dirname + '/../downloads/';

// Build the CLI

console.log('Hello there ! Welcome to the image downloader.');
console.log();
console.log('Please enter your query (for example, "steak frites")');

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
            var totalPages = Math.floor((data.total - 1) / summary.perPage) + 1;
            var bar = new ProgressBar('Retrieving photos urls [:bar] :percent :etas', {
                complete: '=',
                incomplete: ' ',
                width: 20,
                total: totalPages
            });
            worker.prepareFetch(summary, tags, data.total, bar.tick.bind(bar), function fetchPhotos(preparedPhotos) {
                var totalPhotos = totalPages * summary.perPage;
                var bar = new ProgressBar('Downloading photos     [:bar] :percent :etas', {
                    complete: '=',
                    incomplete: ' ',
                    width: 20,
                    total: totalPhotos
                });
                worker.fetch(preparedPhotos, destination, bar.tick.bind(bar), function onAllDone() {
                    setTimeout(function() {
                        console.log();
                        console.log('All done !');
                    }, 10);
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
