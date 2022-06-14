/* eslint-disable import/no-extraneous-dependencies */

const inPlace = require('@metalsmith/in-place');
const layouts = require('@metalsmith/layouts');
const drafts = require('@metalsmith/drafts');
const sass = require('@metalsmith/sass');
const toc = require('@metalsmith/table-of-contents');
const collections = require('@metalsmith/collections');
const debugUI = require('metalsmith-debug-ui');
const postcss = require('@metalsmith/postcss');
const when = require('metalsmith-if');
const favicons = require('metalsmith-favicons');
const htmlMinifier = require('metalsmith-html-minifier');
const imagemin = require('metalsmith-imagemin');
const sitemap = require('metalsmith-sitemap');
const Metalsmith = require('metalsmith');
const esbuildPlugin = require('metalsmith-esbuild-local');
const examples = require('./lib/data/examples.json');
const plugins = require('./lib/data/plugins.json');
const formatDate = require('./metalsmith/nunjucks-formatDate-filter');
const CodeBlockExtension = require('./metalsmith/nunjucks-codeblock');
const CodeTabsExtension = require('./metalsmith/nunjucks-tabs');

const nodeVersion = process.version;
const githubRegex = /github\.com\/([^/]+)\/([^/]+)\/?$/;
const oneWeek = 7 * 24 * 60 * 60;

const mappedPlugins = plugins.map(plugin => {
  if (!plugin.status) {
    plugin.status = 'active';
  }
  const result = githubRegex.exec(plugin.repository);
  let npm = '';
  let user = '';

  if (result) {
    // eslint-disable-next-line prefer-destructuring
    user = result[1];
    npm = plugin.npm || result[2];
    plugin.githubStars = `https://img.shields.io/github/stars/${user}/${result[2]}.svg?maxAge=${oneWeek}`;
  } else {
    npm = plugin.npm;
  }

  Object.assign(plugin, {
    user,
    respositoryIssues: `${plugin.repository}/issues`,
    npmName: npm,
    npmUrl: `https://www.npmjs.com/package/${npm}`,
    npmDownloads: `https://img.shields.io/npm/dy/${npm}.svg?maxAge=${oneWeek}`,
    npmVersion: `https://img.shields.io/npm/v/${npm}.svg?maxAge=${oneWeek}`,
    isCorePlugin: user === 'metalsmith',
    isUnmaintained: plugin.status !== 'active'
  });

  return plugin;
});

const isProduction = process.env.NODE_ENV === 'production';
/** @type {Metalsmith} */
const metalsmith = isProduction ? Metalsmith(__dirname) : debugUI.patch(Metalsmith(__dirname));
metalsmith
  .clean(true)
  .metadata({
    placeholderBadgeUrl: 'https://img.shields.io/badge/badge-loading-lightgrey.svg?style=flat',
    plugins: mappedPlugins,
    examples,
    nodeVersion,
    isProduction,
    siteUrl: isProduction ? 'https://metalsmith.io' : 'https://localhost:3000',
    buildTimestamp: Date.now(),
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
        pattern: 'news/*/*/*.md',
        sortBy: 'pubdate',
        reverse: true
      },
      docs: {
        pattern: 'docs/*/*.md',
        sortBy: 'order'
      }
    })
  )
  // eslint-disable-next-line
  .use(function invertInPlaceExtensions(files) {
    Object.keys(files).forEach(key => {
      if (key.match(/^docs\/.*\/.*\.njk\.md$/) || key === 'index.njk.md') {
        files[key.replace('.njk.md', '.md.njk')] = files[key];
        delete files[key];
      }
    });
  })
  .use(
    inPlace({
      engineOptions: {
        smartypants: true,
        smartLists: true,
        filters: {
          formatDate
        },
        root: __dirname,
        extensions: {
          CodeBlockExtension: new CodeBlockExtension(),
          CodeTabsExtension: new CodeTabsExtension()
        }
      },
      pattern: '**/*.{md,njk}'
    })
  )
  .use(toc({ levels: [2, 3] }))
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
    sass({
      entries: {
        'src/index.scss': 'index.css'
      }
    })
  )
  .use(
    sitemap({
      hostname: 'https://metalsmith.io',
      omitIndex: true,
      changefreq: 'weekly',
      modifiedProperty: 'sitemap.lastmod',
      urlProperty: 'sitemap.canonical',
      priorityProperty: 'sitemap.priority',
      privateProperty: 'sitemap.private'
    })
  )
  .use(postcss({ plugins: ['postcss-preset-env', 'autoprefixer', 'cssnano'], map: !isProduction }))
  .use(
    esbuildPlugin({
      entries: {
        index: './lib/js/index.js'
      }
    })
  )
  .use(when(isProduction, htmlMinifier()))
  .use(when(isProduction, imagemin()))
  .build(err => {
    if (err) {
      throw err;
    }
  });
