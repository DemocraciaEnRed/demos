/**
 * Module dependencies.
 */

var Chart = require('Chart.js');
var t = require('t');
var template = require('./template');
var View = require('view');

function BillProposal(law, options) {
  this.law = law;
  View.call(this, template, {law: law});
  this.renderChart();
}

View(BillProposal);

/**
 * Render chart into options block
 *
 * @return {ProposalOptions} `ProposalOptions` instance.
 * @api public
 * @deprecated
 */

BillProposal.prototype.renderChart = function() {
  var container = this.find('#results-chart')[0];
  var nothings = this.law.totalNothings || 0;
  var littles = this.law.totalLittles || 0;
  var somewhats = this.law.totalSomewhats || 0;
  var verys = this.law.totalVerys || 0;
  var census = this.law.scoreCensus;
  var data = [];

  if (!container) return;

  if (census) {
    data.push({
      value: nothings,
      color: "#2c3e50",
      label: t('scoring.options.nothing'),
      labelColor: "white",
      labelAlign: "center"
    });
    data.push({
      value: littles,
      color: "#8e44ad",
      label: t('scoring.options.little'),
      labelColor: "white",
      labelAlign: "center"
    });
    data.push({
      value: somewhats,
      color: "#2980b9",
      label: t('scoring.options.somewhat'),
      labelColor: "white",
      labelAlign: "center"
    });
    data.push({
      value: verys,
      color: "#27ae60",
      label: t('scoring.options.very'),
      labelColor: "white",
      labelAlign: "center"
    });

    new Chart(container.getContext('2d')).Pie(data, { animation: false });
  }
}

module.exports = BillProposal;