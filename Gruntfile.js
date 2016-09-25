'use strict';

module.exports = function (grunt) {
  grunt.initConfig({
    shell: {
      componentinstall: {
        command: './node_modules/.bin/component install'
      }
    },
    clean: {
      build: ['build'],
      components: ['components']
    },
    connect: {
      server: {
        options: {
          base: 'build',
          keepalive: true,
          port: process.env.PORT || '8000'
        }
      }
    }
  });

  grunt.registerTask('componentbuild', 'Build components', function () {
    /* eslint no-invalid-this: 0 */
    grunt.task.requires('shell:componentinstall');
    grunt.task.requires('metalsmith');

    var Component = require('component-builder');
    var mkdir = require('mkdirp');
    var write = require('fs').writeFileSync;
    var myth = require('myth');

    var done = this.async();

    var c = new Component(__dirname);
    c.copyAssetsTo('build');
    c.development();
    c.addSourceURLs();
    c.copyFiles();

    c.build(function (err, res) {
      if (err) {
        /* eslint no-console: 0 */
        console.log('Error: ' + err);
        return done(false);
      }

      mkdir('build');
      write('build/build.js', res.require + res.js);
      write('build/build.css', myth(res.css));

      return done();
    });
  });

  grunt.registerTask('metalsmith', 'Build site', function () {
    var inPlace = require('metalsmith-in-place');
    var layouts = require('metalsmith-layouts');
    var markdown = require('metalsmith-markdown');
    var metadata = require('metalsmith-metadata');
    var Metalsmith = require('metalsmith');

    var done = this.async();

    var m = Metalsmith(__dirname);
    m.use(metadata({
      plugins: 'plugins.json',
      examples: 'examples.json'
    }));
    m.use(inPlace({
      engine: 'swig',
      pattern: '**/*.md'
    }));
    m.use(markdown({
      smartypants: true,
      smartLists: true
    }));
    m.use(layouts({
      engine: 'swig',
      directory: './'
    }));
    m.build(function (err) {
      if (err) {
        /* eslint no-console: 0 */
        console.log('Error: ' + err);
        return done(false);
      }
      return done();
    });
  });

  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-connect');

  grunt.registerTask('build', ['shell:componentinstall', 'metalsmith', 'componentbuild']);
  grunt.registerTask('default', ['build']);
};
