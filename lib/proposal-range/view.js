/**
 * Module dependencies.
 */

var template = require('./template');
var View = require('view');

function ProposalRange() {
  View.call(this, template);
}

View(ProposalRange);


/**
 * Expose ProposalRange
 */

module.exports = ProposalRange;