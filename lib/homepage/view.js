/**
 * Module dependencies.
 */

var bus = require('bus');
var o = require('dom');
var template = require('./template');
var View = require('view');

/**
 * Expose view
 */

 module.exports = HomepageView;

 /**
 * Create `HomepageView` container
 */

function HomepageView() {
  View.call(this, template);
}

View(HomepageView);

HomepageView.prototype.switchOn = function() {
  o('body').addClass('browser-page');
  bus.emit('page:render');

  function onpagechange() {
    o('body').removeClass('browser-page');
  }

  bus.once('page:change', onpagechange);
};