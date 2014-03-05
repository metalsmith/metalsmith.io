
var consolidate = require('consolidate');
var each = require('async').each;
var extend = require('extend');
var extname = require('path').extname;

/**
 * Expose `plugin`.
 */

module.exports = plugin;

/**
 * Metalsmith plugin to run files through any template in a template `dir`.
 *
 * @param {Object} options
 *   @property {String} engine
 * @return {Function}
 */

function plugin(opts){
  opts = opts || {};
  if (!opts.engine) throw new Error('"engine" option required');

  return function(files, metalsmith, next){
    var metadata = metalsmith.metadata();

    each(Object.keys(files), convert, next);

    function convert(file, done){
      if (!markdown(file)) return done();
      var data = files[file];
      var contents = data.contents.toString();
      var clone = extend({}, metadata, data);
      consolidate[opts.engine].render(contents, clone, function(err, str){
        if (err) return done(err);
        data.contents = new Buffer(str);
        done();
      });
    }
  };
}

/**
 * Check if a `file` is markdown.
 *
 * @param {String} file
 * @return {Boolean}
 */

function markdown(file){
  return /\.md|\.markdown/.test(extname(file));
}