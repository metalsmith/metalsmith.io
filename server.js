
var build = require('./build');
var express = require('express');
var port = process.env.PORT || 3000;

/**
 * App.
 */

var app = express();

/**
 * Development.
 */

app.configure('development', function(){
  app.use(express.logger('dev'));
  app.use(builder);
});

/**
 * Static.
 */

app.use(express.static(__dirname + '/build'));

/**
 * Listen.
 */

app.listen(port, function(){
  console.log('Server running at http://localhost:' + port + '');
});

/**
 * Builder middleware.
 *
 * @param {Request} req
 * @param {Response} res
 * @param {Function} next
 */

function builder(req, res, next){
  if ('/' != req.path) return next();
  build(function(err){
    if (err) return next(err);
    console.log('Built');
    next();
  });
}
