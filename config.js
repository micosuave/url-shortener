var secrets = require('../lexlab-starter/config/secrets');
var config = {};

config.db = {};

config.webhost = 'https://lexlab.io/l/';

config.db.host = secrets.db2;
config.db.name = 'lexurl_shortener';

module.exports = config;