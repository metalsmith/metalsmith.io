'use strict';

const path = require('path');

module.exports = (grunt) => {
  grunt.initConfig({
    shell: {
      componentinstall: {
        command: path.resolve(`${process.cwd()}/node_modules/.bin/component install`)
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
    const highlights = require('metalsmith-metallic');
    const inPlace = require('metalsmith-in-place');
    const layouts = require('metalsmith-layouts');
    const markdown = require('metalsmith-markdown');
    const metadata = require('metalsmith-metadata');
    const Metalsmith = require('metalsmith');
    const nodeVersion = process.version;

    let done = this.async();

    const githubRegex = /github\.com\/([^\/]+)\/([^/]+)\/?$/;
    const oneWeek = 7 * 24 * 60 * 60;

    const m = Metalsmith(__dirname);
    const plugins = require('./src/plugins.json')
      .map((plugin) => {
        const result = githubRegex.exec(plugin.repository);
        if (result) {
          const user = result[1];
          const repo = result[2];
          const npm = plugin.npm || repo;
          Object.assign(plugin, {
            respositoryIssues: `${plugin.repository}/issues`,
            npmUrl: `https://www.npmjs.com/package/${npm}`,
            npmDownloads: `https://img.shields.io/npm/dy/${npm}.svg?maxAge=${oneWeek}`,
            npmVersion: `https://img.shields.io/npm/v/${npm}.svg?maxAge=${oneWeek}`,
            githubStars: `https://img.shields.io/github/stars/${user}/${repo}.svg?maxAge=${oneWeek}`,
            bithoundUrl: `https://www.bithound.io/github/${user}/${repo}`,
            bithoundScore: `https://www.bithound.io/github/${user}/${repo}/badges/score.svg`,
            bithoundDependencies: `https://www.bithound.io/github/${user}/${repo}/badges/dependencies.svg`
          });
        }
        return plugin;
      });
    m.metadata({
      placeholderBadgeUrl: 'https://img.shields.io/badge/badge-loading-lightgrey.svg?style=flat',
      plugins,
      nodeVersion
    });
    m.use(metadata({
      examples: 'examples.json'
    }));
    m.use(inPlace({
      engine: 'swig',
      pattern: '**/*.md'
    }));
    m.use(highlights());
    m.use(markdown({
      smartypants: true,
      smartLists: true
    }));
    m.use(layouts({
      engine: 'swig',
      directory: process.cwd()
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
