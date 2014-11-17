/**
 * Module dependencies.
 */

var citizen = require('citizen');
var results = require('laws-results');
var o = require('dom');
var page = require('page');
var t = require('t');
var title = require('title');
var Results = require('./view');

page('/resultados', results.middleware, load, function(ctx, next) {
  var summary = new Results(ctx.winners, ctx.losers);

  title(t('summary.title'));

  summary.replace('#content .content-container');

  o(document.body).addClass('results');
});