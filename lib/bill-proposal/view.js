/**
 * Module dependencies.
 */

var bus = require('bus');
var citizen = require('citizen');
var Chart = require('Chart.js');
var View = require('view');
var laws = require('laws');
var template = require('./template');
var page = require('page');
var o = require('dom');
var request = require('request');
var t = require('t');
var Progress = require('progress');
var log = require('debug')('democracyos:bill-proposal-demo');

function BillProposal(law, options) {
  this.options = options || {};
  this.options.delayNextLaw = this.options.delayNextLaw === undefined || this.options.delayNextLaw;

  this.law = law;
  this.previousLaw = laws.prev(law);
  this.nextLaw = laws.next(law);
  View.call(this, template, {law: law});
  this.renderChart();
}

View(BillProposal);

/**
 * Turn on event bindings
 */

BillProposal.prototype.switchOn = function() {
  this.bind('click', '.next', this.bound('next'));
  this.bind('click', '.prev', this.bound('prev'));
  this.bind('click', '.score', this.bound('score'))
  this.bind('click', '.change-score', this.bound('changescore'))
  //this.bind('click', '.link-to-law', this.bound('goto'));
  this.on('score', this.bound('onscore'));
}

/**
 * Turn off event bindings
 */

BillProposal.prototype.switchOff = function() {
  this.unbind('click', '.next', this.bound('next'));
  this.unbind('click', '.prev', this.bound('prev'));
  this.unbind('click', '.score', this.bound('score'));
  this.off();
}

// BillProposal.prototype.goto = function(ev, data) {
//   debugger;
//   console.dir(ev);
//   console.dir(data);
// };

BillProposal.prototype.next = function() {
  if (this.timeout) clearTimeout(this.timeout);
  if (this.interval) clearInterval(this.interval);
  if (citizen.logged()) {
    var nothings = this.law.nothings || []
    var littles = this.law.littles || []
    var somewhats = this.law.somewhats || []
    var verys = this.law.verys || []
    var census = nothings.concat(littles).concat(somewhats).concat(verys)
    var scored = citizen.id && ~census.indexOf(citizen.id)
    if (scored) {
      this.find('.scored').removeClass('hide');
    }
  }
  if (this.seconds) this.seconds.remove();
  this.emit('next');
};

BillProposal.prototype.prev = function() {
  if (this.timeout) clearTimeout(this.timeout);
  if (this.interval) clearInterval(this.interval);
  this.emit('prev');
};

BillProposal.prototype.score = function(ev) {
  ev.preventDefault();

  if (!citizen.logged()) {
    page('/signup');
  }

  var target = o(ev.delegateTarget);
  var value;
  if (target.hasClass('score-nothing')) {
    value = 'nothing';
  } else if (target.hasClass('score-little')) {
    value = 'little';
  } else if (target.hasClass('score-somewhat')) {
    value = 'somewhat';
  } else if (target.hasClass('score-very')) {
    value = 'very';
  }

  function callback(err, res) {
    if (err || !res.ok) return log('Failed cast %s for %s with error: %j', value, this.law.id, err || res.error);
    bus.emit('score', this.law.id, value);
    this.emit('score', value);
    var prop = value + 's';
    if (~this.law.nothings.indexOf(citizen.id)) {
      this.law.nothings.splice(this.law.nothings.indexOf(citizen.id));
    }
    if (~this.law.littles.indexOf(citizen.id)) {
      this.law.littles.splice(this.law.littles.indexOf(citizen.id));
    }
    if (~this.law.somewhats.indexOf(citizen.id)) {
      this.law.somewhats.splice(this.law.somewhats.indexOf(citizen.id));
    }
    if (~this.law.verys.indexOf(citizen.id)) {
      this.law.verys.splice(this.law.verys.indexOf(citizen.id));
    }
    this.law[prop].push(citizen.id);
    if (!this.nextLaw) {
      page('/gracias');
    }
  }

  if (citizen.id) {
    log('casting score %s for %s', value, this.law.id);
    request.post('/api/law/:id/score'.replace(':id', this.law.id))
      .send({ value: value })
      .end(callback.bind(this));
  }
};

BillProposal.prototype.onscore = function(value) {
  var text = t('scoring.value.' + value);
  var scored = o('.scored', this.el[0]);
  scored.removeClass('hide');
  var title = o('h2', scored.els[0]);
  o('.scores', this.el[0]).addClass('hide');
  title.html(text);
  if (this.options.delayNextLaw) {
    var html = '<p>Verás la siguiente ley en <span class="seconds">3</span> segundos...</p>';
    var el = this.seconds = o(html);
    this.find('.scored').addClass('hide');
    this.find('.score-selector').append(el.els[0]);
    this.interval = setInterval(function () {
      var seconds = el.find('.seconds');
      var number = parseInt(seconds.html()) - 1;
      seconds.html(number);
    }, 1000)
    this.timeout = setTimeout(this.bound('next'), 3000);
  }
}

BillProposal.prototype.changescore = function() {
  o('.scored', this.el[0]).addClass('hide');
  o('.scores', this.el[0]).removeClass('hide');
};

/**
 * Render chart into options block
 *
 * @return {ProposalOptions} `ProposalOptions` instance.
 * @api public
 * @deprecated
 */

BillProposal.prototype.renderChart = function() {
  var container = this.find('#results-chart')[0];
  var nothings = this.law.nothings || [];
  var littles = this.law.littles || [];
  var somewhats = this.law.somewhats || [];
  var verys = this.law.verys || [];
  var census = verys.concat(somewhats).concat(littles).concat(nothings);
  var data = [];

  if (!container) return;

  if (census.length) {
    data.push({
      value: nothings.length,
      color: "#2c3e50",
      label: t('scoring.options.nothing'),
      labelColor: "white",
      labelAlign: "center"
    });
    data.push({
      value: littles.length,
      color: "#8e44ad",
      label: t('scoring.options.little'),
      labelColor: "white",
      labelAlign: "center"
    });
    data.push({
      value: somewhats.length,
      color: "#2980b9",
      label: t('scoring.options.somewhat'),
      labelColor: "white",
      labelAlign: "center"
    });
    data.push({
      value: verys.length,
      color: "#27ae60",
      label: t('scoring.options.very'),
      labelColor: "white",
      labelAlign: "center"
    });

    new Chart(container.getContext('2d')).Pie(data, { animation: false });
  }
}

module.exports = BillProposal;