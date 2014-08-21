/**
 * Module dependencies.
 */

var api = require('lib/db-api');
var config = require('lib/config');
var fs = require('fs');
var jade = require('jade');
var log = require('debug')('democracyos:email-notification');
var mailer = require('lib/mailer').mandrillMailer;
var md = require('lib/markdown');
var path = require('path');
var t = require('t-component');
var url = require('url');

var resolve = path.resolve;
var rawJade = fs.readFileSync(resolve(__dirname, './email-reply.jade'));
var emailReply = jade.compile(rawJade);

var exports = module.exports;

/**
 * Creates a token and sends a ad-hoc
 * notification email to the comment's author
 *
 * @param {Object} author to send the email to
 * @param {Object} reply containing the reply's author
 * @param {Function} callback Callback accepting `err` and `reply`
 */

exports.sendReplyEmail = function(comment, reply, meta, callback) {
  var citizen = comment.author;
  if (comment.author.id != reply.author.id) {
    api.token.createReplyEmail(comment.author, meta, function (err, token) {
      if (err) return callback(err);
      log('reply email token created %j', token);
      var subject = t('DemocracyOS - You have a new reply!');
      var lawUrl = url.format({
          protocol: config('protocol')
        , hostname: config('host')
        , port: config('publicPort')
        , pathname: '/law/' + comment.reference
      });
      var urlNotificationsSettings = url.format({
          protocol: config('protocol')
        , hostname: config('host')
        , port: config('publicPort')
        , pathname: '/settings/notifications'
      });

      var htmlBody = emailReply({
        citizenName: citizen.fullName,
        t: t,
        md: md,
        reply: reply,
        urlComment: lawUrl,
        urlNotificationsSettings: urlNotificationsSettings
      });

      mailer.send(citizen, subject, htmlBody, { tags: [token.scope] }, function (err) {
        if (err) return callback(err);
        log('reply email mail sent to %s', citizen.email);
        return callback(err, reply);
      });
    });
  } else {
    return callback(null, reply);
  }
}