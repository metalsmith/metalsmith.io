/* eslint-disable import/no-extraneous-dependencies */

const inPlace = require('metalsmith-in-place');
const layouts = require('@metalsmith/layouts');
const drafts = require('@metalsmith/drafts');
const collections = require('@metalsmith/collections');
const parcelPlugin = require('metalsmith-parcel-local');
const debugUI = require('metalsmith-debug-ui');
const when = require('metalsmith-if');
const favicons = require('metalsmith-favicons');
const postcss = require('metalsmith-postcss');
const htmlMinifier = require('metalsmith-html-minifier');
const imagemin = require('metalsmith-imagemin');
const Metalsmith = require('metalsmith');
const hljs = require('highlight.js');
const examples = require('./lib/data/examples.json');
const plugins = require('./lib/data/plugins.json');

hljs.configure({ classPrefix: 'hljs-' });

const nodeVersion = process.version;
const githubRegex = /github\.com\/([^/]+)\/([^/]+)\/?$/;
const oneWeek = 7 * 24 * 60 * 60;

// nunjucks filter
function formatDate(value, format) {
  const dt = new Date(value);
  if (format === 'iso') {
    return dt.toISOString();
  }
  const utc = dt.toUTCString().match(/(\d{1,2}) (.*) (\d{4})/);
  return `${utc[2]} ${utc[1]}, ${utc[3]}`;
}

const mappedPlugins = plugins.map(plugin => {
  if (!plugin.status) {
    plugin.status = 'active';
  }
  const result = githubRegex.exec(plugin.repository);

  if (result) {
    const [, user, repo] = result;
    const npm = plugin.npm || repo;

    Object.assign(plugin, {
      respositoryIssues: `${plugin.repository}/issues`,
      npmName: npm,
      npmUrl: `https://www.npmjs.com/package/${npm}`,
      npmDownloads: `https://img.shields.io/npm/dy/${npm}.svg?maxAge=${oneWeek}`,
      npmVersion: `https://img.shields.io/npm/v/${npm}.svg?maxAge=${oneWeek}`,
      githubStars: `https://img.shields.io/github/stars/${user}/${repo}.svg?maxAge=${oneWeek}`,
      isCorePlugin: user === 'metalsmith',
      isUnmaintained: plugin.status !== 'active'
    });
  }

  return plugin;
});

const isProduction = process.env.NODE_ENV === 'production';
const metalsmith = isProduction ? Metalsmith(__dirname) : debugUI.patch(Metalsmith(__dirname));
metalsmith
  .metadata({
    placeholderBadgeUrl: 'https://img.shields.io/badge/badge-loading-lightgrey.svg?style=flat',
    plugins: mappedPlugins,
    examples,
    nodeVersion,
    isProduction,
    siteUrl: isProduction ? 'https://metalsmith.io' : 'https://localhost:3000',
    cookieMessage: [
      'This website may use local storage for purely functional purposes (for example to remember preferences),',
      'and anonymous cookies to gather information about how visitors use the site.',
      'By continuing to browse this site, you agree to its use of cookies and local storage.'
    ].join(' ')
  })
  .use(when(isProduction, drafts()))
  .use(
    when(
      isProduction,
      favicons({
        src: 'favicons/favicon.png',
        dest: 'favicons/',
        appName: 'Metalsmith.io',
        appDescription: 'An extremely simple, pluggable static site generator',
        icons: {
          android: true,
          appleIcon: true,
          favicons: true
        }
      })
    )
  )
  .use(
    collections({
      news: {
        pattern: 'news/*/*/*.md'
      }
    })
  )
  .use(
    inPlace({
      engineOptions: {
        smartypants: true,
        smartLists: true,
        filters: {
          formatDate
        }
      },
      pattern: '**/*.md'
    })
  )
  // this plugin is a temporary fix for in-place not supporting dots in dirnames
  .use(files => {
    Object.keys(files).forEach(key => {
      if (key.includes('+')) {
        files[key.replace(/\+/g, '.')] = files[key];
        delete files[key];
      }
    });
  })
  .use(
    layouts({
      directory: 'lib/views',
      pattern: '**/*.html',
      engineOptions: {
        filters: {
          formatDate
        }
      }
    })
  )
  .use(
    postcss({
      plugins: [
        'postcss-easy-import',
        'postcss-custom-media',
        'postcss-preset-env',
        {
          'postcss-normalize': { forceImport: true }
        },
        'autoprefixer',
        'cssnano'
      ],
      map: isProduction
        ? false
        : {
            inline: false
          }
    })
  )
  .use(parcelPlugin({ entries: 'lib/js/index.js' }))
  .use(when(isProduction, htmlMinifier()))
  .use(when(isProduction, imagemin()))
  .build(err => {
    if (err) {
      throw err;
    }
  });
