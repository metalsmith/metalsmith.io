
var basename = require('path').basename;
var Component = require('component-builder');
var extname = require('path').extname;
var markdown = require('metalsmith-markdown');
var metadata = require('metalsmith-metadata');
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
  c.copyFiles();

  /**
   * Metalsmith.
   */

  var m = Metalsmith(__dirname);
  m.use(metadata({
    plugins: 'plugins.json',
    examples: 'examples.json'
  }));
  m.use(templates({
    engine: 'swig',
    inPlace: true,
    pattern: '**/*.md'
  }));
  m.use(markdown({
    smartypants: true,
    smartLists: true,
  }));
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
