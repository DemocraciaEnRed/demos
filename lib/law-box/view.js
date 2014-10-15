/**
 * Module dependencies.
 */

var citizen = require('citizen');
var Options = require('proposal-options');
var template = require('./template');
var truncate = require('truncate');
var View = require('view');

/**
 * Expose view
 */

 module.exports = LawBox;

 /**
 * Create `LawBox` container
 */

function LawBox(law) {
  this.law = law;
  View.call(this, template, {law: law, truncate: truncate});
}

View(LawBox);

LawBox.prototype.switchOn = function() {
  this.oninsert();
};

LawBox.prototype.oninsert = function() {
  var options = new Options(this.law, citizen);
  options.render(this.find('.options')[0]);
};

