'use strict';

const Routes = require('./lib/routes');
const Hapi = require('hapi');
const Hoek = require('hoek');
const Settings = require('./settings');
const Models = require('./lib/models/');

const server = new Hapi.Server();
server.connection({ port: Settings.port });

server.route(Routes);

Models.sequelize.sync().then(() => {
  server.start((err) => {
    Hoek.assert(!err, err);
    console.log(`Server running at: ${server.info.uri}`);
  });
});
