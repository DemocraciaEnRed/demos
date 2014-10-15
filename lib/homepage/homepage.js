/**
 * Module dependencies.
 */

var bus = require('bus');
var citizen = require('citizen');
var laws = require('laws');
var log = require('debug')('democracyos:homepage');
var o = require('dom');
var page = require('page');
var Homepage = require('./view');
var LawBox = require('law-box');

// Routing.
page('/', citizen.optional, laws.middleware, function(ctx, next) {
  var homepage = new Homepage();
  homepage.replace('section.app-content');

  var items = laws.get().filter(function (i) { return i.publishedAt });
  items.forEach(function (law) {
    var box = new LawBox(law);
    box.appendTo('.laws-container');
  });

  // sidebar.ready(onsidebarready);

  // function validUrl() {
  //   var pathname = window.location.pathname;
  //   return pathname == '/' ||  /^\/(law|proposal)/.test(pathname);
  // }

  // function onsidebarready() {

  //   if (!validUrl()) return;

  //   classes(document.body).add('browser-page');

  //   var law = sidebar.items(0);

  //   function onpagechange() {
  //     classes(document.body).remove('browser-page');
  //   }

  //   if (!law) {
  //     var el = render.dom(noLaws);
  //     empty(o('#browser .app-content')).appendChild(el);
  //     bus.once('page:change', onpagechange);
  //     return bus.emit('page:render');
  //   }

  //   log('render law %s', law.id);
  //   ctx.path = '/law/' + law.id;
  //   next();
  // }
});