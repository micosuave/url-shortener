var express = require('express');
var app = express();
var path = require('path');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var config = require('./config');
var base58 = require('./models/base58');
var secrets = require('../lexlab-starter/config/secrets');

var Url = require('./models/urlschema');

var opTions = {
    server: { socketOptions: { keepAlive: 1, connectTimeoutMS: 30000 } },
    replset: { socketOptions: { keepAlive: 1, connectTimeoutMS: 30000 } }
};

var options = { keepAlive: 1, connectTimeoutMS: 30000, useNewUrlParser: true, useUnifiedTopology: true };

mongoose.connect(config.db.host, options);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, 'views/index.html'));
});

app.post('/api/shorten', function(req, res) {
    var longUrl = req.body.url;
    var shortUrl = '';

    Url.findOne({ long_url: longUrl }, function(err, doc) {
        if (doc) {
            //URL has already been shortend
            shortUrl = config.webhost + base58.encode(doc._id);
            res.send({ 'shortUrl': shortUrl });
        } else {
            var newUrl = new Url({
                long_url: longUrl
            });

            newUrl.save(function(err) {
                if (err) {
                    console.log(err);
                }
                shortUrl = config.webhost + base58.encode(newUrl._id);

                res.send({ 'shortUrl': shortUrl });
            });
        }
    });
});

app.get('/:encoded_id', function(req, res) {
    var base58Id = req.params.encoded_id;
    var id = base58.decode(base58Id);

    Url.findOne({ _id: id }, function(err, doc) {
        if (doc) {
            res.redirect(doc.long_url);
        } else {
            res.redirect('/');
        }
    });
});

// var server = app.listen(3300, function(){
//     console.log('server listening on port 3300');
// });
module.exports = app;
