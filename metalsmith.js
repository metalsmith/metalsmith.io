/* eslint-disable import/no-extraneous-dependencies */

const inPlace = require('@metalsmith/in-place');
const layouts = require('@metalsmith/layouts');
const drafts = require('@metalsmith/drafts');
const sass = require('@metalsmith/sass');
const toc = require('@metalsmith/table-of-contents');
const collections = require('@metalsmith/collections');
const postcss = require('@metalsmith/postcss');
const htmlMinifier = require('metalsmith-html-minifier');
const sitemap = require('metalsmith-sitemap');
const Metalsmith = require('metalsmith');
const jsbundle = require('@metalsmith/js-bundle');
const metadata = require('@metalsmith/metadata');
const permalinks = require('@metalsmith/permalinks');
const browserSync = require('browser-sync');
const formatDate = require('./metalsmith/nunjucks-formatDate-filter');
const split = require('./metalsmith/nunjucks-split-filter');
const CodeBlockExtension = require('./metalsmith/nunjucks-codeblock');
const CodeTabsExtension = require('./metalsmith/nunjucks-tabs');
const plugins = require('./lib/data/plugins.json');

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
let devServer = null;

function msBuild() {
  /** @type {Metalsmith} */
  const metalsmith = Metalsmith(__dirname);

  metalsmith
    .clean(isProduction)
    .watch(isProduction ? false : ['src', 'lib'])
    .env('DEBUG', process.env.DEBUG)
    .env('NODE_ENV', process.env.NODE_ENV)
    .metadata({
      placeholderBadgeUrl: 'https://img.shields.io/badge/badge-loading-lightgrey.svg?style=flat',
      plugins: mappedPlugins,
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
    .use(
      metadata({
        examples: 'lib/data/examples.json',
        showcase: 'lib/data/showcase.yml',
        starters: 'lib/data/starters.yml'
      })
    )
    .use(drafts(!isProduction));

  metalsmith
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
    .use(
      permalinks({
        match: '**/*.njk.md',
        directoryIndex: 'index.njk.md'
      })
    )
    .use(
      inPlace({
        transform: 'nunjucks',
        engineOptions: {
          filters: { formatDate, split },
          root: __dirname,
          extensions: {
            CodeBlockExtension: new CodeBlockExtension(),
            CodeTabsExtension: new CodeTabsExtension()
          }
        }
      })
    )
    .use(
      inPlace({
        transform: 'jstransformer-marked',
        engineOptions: {
          smartypants: true,
          smartLists: true
        }
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
    .use(
      postcss({ plugins: ['postcss-preset-env', 'autoprefixer', 'cssnano'], map: !isProduction })
    )
    .use(
      jsbundle({
        entries: {
          index: './lib/js/index.js'
        }
      })
    );

  if (isProduction) {
    metalsmith.use(htmlMinifier());
  }

  return metalsmith;
}

if (require.main === module) {
  let t1 = performance.now();
  const ms = msBuild();
  ms.build(err => {
    if (err) {
      throw err;
    }
    /* eslint-disable no-console */
    console.log(`Build success in ${((performance.now() - t1) / 1000).toFixed(1)}s`);
    if (ms.watch()) {
      if (devServer) {
        t1 = performance.now();
        devServer.reload();
      } else {
        devServer = browserSync.create();
        devServer.init({
          host: 'localhost',
          server: './build',
          port: 3000,
          injectChanges: false,
          reloadThrottle: 0
        });
      }
    }
  });
} else {
  module.exports = msBuild;
}
