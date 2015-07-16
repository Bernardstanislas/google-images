var client = require('google-images');
var fs = require('fs');

var arguments = process.argv.slice(2);

var query = arguments[0];
var hits = arguments[1];

var downloadsFolder = __dirname + '/downloads/' + query;

var progress = 0;
var total = 4 * Math.ceil(hits / 4);

// Prepare downloads folder
if (!fs.existsSync(__dirname + '/downloads')) {
    fs.mkdirSync(__dirname + '/downloads');
}
if (!fs.existsSync(downloadsFolder)) {
    fs.mkdirSync(downloadsFolder);
}


for (var index = 0; index < 10 / 4; index++) { // Results are given 4 by 4, strange Google ajax API
    client.search({
        for: query,
        page: 4 * index,
        callback: function(err, images) {
            if (err) {
                throw err;
            }
            images.forEach(function(image) {
                var fileName = image.url.match(/[^\/]*$/)[0];
                var filePath = downloadsFolder + '/' + fileName;
                if (fs.existsSync(filePath)) {
                    fs.unlinkSync(filePath);
                }
                image.writeTo(downloadsFolder + '/' + fileName, function() {
                    progress++;
                    console.info('Progress : ' + Math.round(progress * 100 / total) + ' %');
                });
            });
        }
    });
}
