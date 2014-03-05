
var basename = require('path').basename;
var Component = require('component-builder');
var extname = require('path').extname;
var markdown = require('metalsmith-markdown');
var Metalsmith = require('metalsmith');
var mkdir = require('mkdirp');
var myth = require('myth');
var templates = require('metalsmith-templates');
var write = require('fs').writeFileSync;

/**
 * Expose `build`.
 */

module.exports = build;

/**
 * Build with Metalsmith and Component.
 *
 * @param {Function} fn(err)
 */

function build(fn){

  /**
   * Component.
   */

  var c = new Component(__dirname)
  c.copyAssetsTo('build');
  c.development();
  c.addSourceURLs();

  /**
   * Metalsmith.
   */

  var m = Metalsmith(__dirname);
  m.use(metadata);
  m.use(require('./metalsmith-template-markdown')({
    engine: 'swig'
  }));
  m.use(markdown());
  m.use(templates({
    engine: 'swig',
    directory: './'
  }));

  /**
   * Build.
   */

  c.build(function(err, res){
    if (err) return fn(err);
    mkdir('build');
    write('build/build.js', res.require + res.js);
    write('build/build.css', myth(res.css));
    m.build(fn);
  });
}

/**
 * Metalsmith plugin to extend metadata with JSON files.
 *
 * @param {Object} files
 * @param {Metalsmith} metalsmith
 * @param {Function} done
 */

function metadata(files, metalsmith, done){
  var data = {};

  for (var file in files) {
    var ext = extname(file);
    if ('.json' != ext) continue;
    var str = files[file].contents.toString();
    var json = JSON.parse(str);
    var key = basename(file, ext);
    data[key] = json;
    delete files[file];
  }

  metalsmith.metadata(data);
  done();
}
