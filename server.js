
var cons = require('consolidate');
var express = require('express');
var port = process.env.PORT || 7777;

/**
 * App.
 */

var app = module.exports = express()
  .engine('html', cons.handlebars)
  .set('views', __dirname)
  .use('/build', express.static(__dirname + '/build'));

/**
 * Home.
 */

app.get('*', function (req, res, next) {
  res.render('index.html');
});

/**
 * Listen.
 */

app.listen(port, function () {
  console.log();
  console.log('  Listening on port ' + port + '...');
  console.log();
});