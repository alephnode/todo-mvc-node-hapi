'use strict';

const Path = require('path');
const Routes = require('./lib/routes');
const Hapi = require('hapi');
const Hoek = require('hoek');
const Settings = require('./settings');
const Models = require('./lib/models/');

const server = new Hapi.Server();
server.connection({ port: Settings.port });

server.register([
  require('vision')
], (err) => {
  Hoek.assert(!err, err);

  // View settings
  server.views({
    engines: { pug: require('pug') },
    path: Path.join(__dirname, 'lib/views'),
    compileOptions: {
      pretty: false
    },
    isCached: Settings.env === 'production'
  });

  // Add routes
  server.route(Routes);
});

Models.sequelize.sync().then(() => {
  server.start((err) => {
    Hoek.assert(!err, err);
    console.log(`Server running at: ${server.info.uri}`);
  });
});
