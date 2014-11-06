/**
 * Module dependencies.
 */

var http = require('http');
var https = require('https');
var fs = require('fs');
var privateKey = fs.readFileSync('server.key', 'utf-8');
var certificate = fs.readFileSync('server.crt', 'utf-8');
var credentials = { key: privateKey, cert: certificate };

var app = module.exports = require('lib/boot');
var server = http.createServer(app);
var secureServer = https.createServer(credentials, app);

var balance = require('lib/balance');
var config = require('lib/config');
var log = require('debug')('democracyos:root');

/**
 * Launch the server
 */

if (module === require.main) {
  balance(function() {
    server.listen(config('privatePort'), function() {
      log('Application started on port %d', config('privatePort'));
    });
    secureServer.listen(443, function() {
      log('Secure port enabled');
    });
  });
}