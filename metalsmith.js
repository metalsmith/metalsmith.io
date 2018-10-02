/* eslint-disable */

const inPlace = require('metalsmith-in-place');
const layouts = require('metalsmith-layouts');
const metalsmith = require('metalsmith');
const examples = require('./lib/data/examples.json');

const nodeVersion = process.version;
const githubRegex = /github\.com\/([^/]+)\/([^/]+)\/?$/;
const oneWeek = 7 * 24 * 60 * 60;

const plugins = require('./lib/data/plugins.json')
  .map((plugin) => {
    const result = githubRegex.exec(plugin.repository);
    if (result) {
      const [, user, repo] = result;
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

metalsmith(__dirname)
  .metadata({
    placeholderBadgeUrl: 'https://img.shields.io/badge/badge-loading-lightgrey.svg?style=flat',
    plugins,
    examples,
    nodeVersion
  })
  .use(inPlace({
    engineOptions: {
      smartypants: true,
      smartLists: true
    },
    pattern: '**/*.md'
  }))
  .use(layouts({
    directory: 'lib/views',
    default: 'base.njk',
    pattern: '**/*.html'
  }))
  .build(err => {
    if (err) {
      throw err;
    }
  });

