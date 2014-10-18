/**
 * Module dependencies.
 */

var template = require('./template');
var Range = require('proposal-range');
var t = require('t');
var View = require('view');
var laws = require('laws');

function ProposalRanges(law) {
  var next = laws.next(law);
  var previous = laws.previous(law);
  View.call(this, template, { next: next, previous: previous });
  var nothing = new Range(0, t('proposal.range.nothing'), 'red');
  var little = new Range(1, t('proposal.range.little'), 'orange');
  var somewhat = new Range(2, t('proposal.range.somewhat'), 'yellow');
  var very = new Range(3, t('proposal.range.very'), 'green');
  nothing.appendTo(this.find('.ranges-container'));
  little.appendTo(this.find('.ranges-container'));
  somewhat.appendTo(this.find('.ranges-container'));
  very.appendTo(this.find('.ranges-container'));
}

View(ProposalRanges);

/**
 * Expose ProposalRanges
 */

module.exports = ProposalRanges;