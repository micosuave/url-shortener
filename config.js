var secrets = require('../lexlab-starter/config/secrets');
var config = {};

config.db = {};

config.webhost = '/roar/';

config.db.host = secrets.db2;
config.db.name = 'lexurl-shortener';

module.exports = config;
