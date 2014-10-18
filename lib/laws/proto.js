/**
 * Module dependencies.
 */

var citizen = require('citizen');
var Emitter = require('emitter');
var request = require('request');
var render = require('render');
var Stateful = require('stateful');
var log = require('debug')('democracyos:laws-proto');

/**
 * Expose `Laws` proto constructor
 */

module.exports = Laws;

/**
 * Laws collection constructor
 */

function Laws() {
  if (!(this instanceof Laws)) {
    return new Laws();
  };

  // instance bindings
  this.middleware = this.middleware.bind(this);
  this.fetch = this.fetch.bind(this);
  this.index = 0;

  this.state('initializing');

  // Re-fetch laws on citizen sign-in
  citizen.on('loaded', this.fetch);

  this.fetch();
}

/**
 * Mixin Laws prototype with Emitter
 */

// Emitter(Laws.prototype);
Stateful(Laws);

/**
 * Fetch `laws` from source
 *
 * @param {String} src
 * @api public
 */

Laws.prototype.fetch = function(src) {
  log('request in process');
  src = src || '/api/law/all';

  this.state('loading');

  request
  .get(src)
  .end(onresponse.bind(this));

  function onresponse(err, res) {
    if (err || !res.ok) {
      var message = 'Unable to load laws. Please try reloading the page. Thanks!';
      return this.error(message);
    };

    function shuffle(o){ //v1.0
      for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
      return o;
    };

    var laws = res.body;
    laws = shuffle(laws);

    this.set(laws);
  }
}

/**
 * Set items to `v`
 *
 * @param {Array} v
 * @return {Laws} Instance of `Laws`
 * @api public
 */

Laws.prototype.set = function(v) {
  this.items = v;
  this.state('loaded');
  return this;
}

/**
 * Get current `items`
 *
 * @return {Array} Current `items`
 * @api public
 */

Laws.prototype.get = function(index) {
  if (index) {
    this.index = index;
    return this.items[index];
  }
  return this.items;
}

Laws.prototype.getById = function(id) {
  var i = this.index(id);
  this.index = i;
  return this.items[id];
}

Laws.prototype.next = function(law) {
  var i = this.index(law);
  if (i == this.items.length - 1) {
    return null;
  } else {
    return this.items[i + 1];
  }
};

Laws.prototype.previous = function(law) {
  var i = this.index(law);
  if (i == 0) {
    return null;
  } else {
    return this.items[i - 1];
  }
};

Laws.prototype.index = function(law) {
  for (var i = 0; i < this.items.length; i++) {
    var id;
    if (law typeof 'string') {
      id = law;
    } else {
      id = law.id;
    }
    if (id == this.items[i].id) {
      return i;
    }
  };
  return -1;
};

/**
 * Middleware for `page.js` like
 * routers
 *
 * @param {Object} ctx
 * @param {Function} next
 * @api public
 */

Laws.prototype.middleware = function(ctx, next) {
  this.ready(next);
}

/**
 * Handle errors
 *
 * @param {String} error
 * @return {Laws} Instance of `Laws`
 * @api public
 */

Laws.prototype.error = function(message) {
  // TODO: We should use `Error`s instead of
  // `Strings` to handle errors...
  // Ref: http://www.devthought.com/2011/12/22/a-string-is-not-an-error/
  this.state('error', message);
  log('error found: %s', message);

  // Unregister all `ready` listeners
  this.off('ready');
  return this;
}