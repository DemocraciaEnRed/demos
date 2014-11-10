var o = require('dom');
var config = require('config');
var t = require('t');
var indexOf = require('indexof');
var View = require('view');
var template = require('./template');
var BillProposal = require('bill-proposal');

function BillSummary(phase2, phase1) {
  var baseUrl = config.protocol + "://" + config.host + (config.publicPort ? (":" + config.publicPort) : "");
  View.call(this, template, {
    baseUrl: baseUrl,
    t: t,
    indexOf: indexOf
  });

  var phase2Container = this.find('.laws-phase-2');
  var phase1Container = this.find('.laws-phase-1');
  phase2.forEach(function (law) {
    var billProposal = new BillProposal(law, { delayNextLaw: false });
    billProposal.el
      .addClass('col-md-4');
      //.addClass('link-to-law');

    billProposal.appendTo(phase2Container[0]);
  })
  shuffle(phase1).forEach(function (law) {
    var billProposal = new BillProposal(law, { delayNextLaw: false });
    billProposal.el
      .addClass('col-md-4');
      //.addClass('link-to-law');

    billProposal.appendTo(phase1Container[0]);
  })
}

function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex ;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

View(BillSummary);

module.exports = BillSummary;