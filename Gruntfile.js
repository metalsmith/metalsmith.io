'use strict';

module.exports = (grunt) => {
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

    const Component = require('component-builder');
    const mkdir = require('mkdirp');
    const write = require('fs').writeFileSync;
    const myth = require('myth');

    let done = this.async();

    const c = new Component(__dirname);
    c.copyAssetsTo('build');
    c.development();
    c.addSourceURLs();
    c.copyFiles();

    c.build((err, res) => {
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
    const inPlace = require('metalsmith-in-place');
    const layouts = require('metalsmith-layouts');
    const markdown = require('metalsmith-markdown');
    const metadata = require('metalsmith-metadata');
    const Metalsmith = require('metalsmith');
    const nodeVersion = process.version;

    let done = this.async();

    const m = Metalsmith(__dirname);
    m.metadata({ nodeVersion });
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
    m.build((err) => {
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
