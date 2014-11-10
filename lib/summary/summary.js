var page = require('page');
var bus = require('bus');
var t = require('t');
var laws = require('laws');
var title = require('title');
var citizen = require('citizen');
var BillSummaryView = require('./view');

page('/gracias', citizen.required, laws.middleware, function(ctx, next) {
  title(t('results.title'));
  laws.fetch();
  laws.once('loaded', function() {
    var phase2 = laws.items.slice(0, 3);
    var phase1 = laws.items.slice(3);
    var summary = new BillSummaryView(phase2, phase1);
    summary.appendTo('section.app-content');
    bus.emit('page:render');
  });
});