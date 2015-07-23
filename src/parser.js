var parser = {
    parse: function(photo) {
        return {
            id: photo.id,
            title: photo.title,
            url: 'https://farm' + photo.farm + '.staticflickr.com/' + photo.server + '/' + photo.id + '_' + photo.secret + '.jpg'
        };
    }
};

module.exports = parser;
