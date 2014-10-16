/**
 * Module dependencies.
 */

var template = require('./template');
var View = require('view');

function ProposalRange(value, text, color) {
  this.value = value;
  View.call(this, template, { text: text, color: color });
}

View(ProposalRange);

ProposalRange.prototype.switchOn = function() {
  this.bind('click', '.range', this.bound('onclick'))
};

ProposalRange.prototype.onclick = function() {
  this.emit('value', value);
};


/**
 * Expose ProposalRange
 */

module.exports = ProposalRange;