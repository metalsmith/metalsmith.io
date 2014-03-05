
var build = require('./build');
var express = require('express');

/**
 * App.
 */

express()
  .use(builder)
  .use('/', express.static(__dirname + '/build'))
  .listen(process.env.PORT, function(){
    console.log('Server running at http://localhost:' + process.env.PORT + '');
  });

/**
 * Build.
 */

function builder(req, res, next){
  if ('production' == process.env.NODE_ENV) return next();
  build(next);
}