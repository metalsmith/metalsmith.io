
var build = require('./build');
var express = require('express');

/**
 * App.
 */

express()
  .use(express.logger('dev'))
  .use('/', builder)
  .use('/', express.static(__dirname + '/build'))
  .listen(process.env.PORT, function(){
    console.log('Server running at http://localhost:' + process.env.PORT + '');
  });

/**
 * Builder middleware.
 *
 * @param {Request} req
 * @param {Response} res
 * @param {Function} next
 */

function builder(req, res, next){
  if ('production' == process.env.NODE_ENV) return next();
  if ('/' != req.path) return next();
  build(function(err){
    if (err) return next(err);
    console.log('Built');
    next();
  });
}