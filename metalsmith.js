import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { readFileSync } from 'node:fs';

import inPlace from '@metalsmith/in-place';
import layouts from '@metalsmith/layouts';
import drafts from '@metalsmith/drafts';
import sass from '@metalsmith/sass';
import toc from '@metalsmith/table-of-contents';
import collections from '@metalsmith/collections';
import postcss from '@metalsmith/postcss';
import htmlMinifier from 'metalsmith-html-minifier';
import sitemap from 'metalsmith-sitemap';
import Metalsmith from 'metalsmith';
import jsbundle from '@metalsmith/js-bundle';
import metadata from '@metalsmith/metadata';
import permalinks from '@metalsmith/permalinks';
import browserSync from 'browser-sync';
import formatDate from './metalsmith/nunjucks-formatDate-filter.js';
import split from './metalsmith/nunjucks-split-filter.js';
import CodeBlockExtension from './metalsmith/nunjucks-codeblock.js';
import CodeTabsExtension from './metalsmith/nunjucks-tabs.js';

const nodeVersion = process.version;
const githubRegex = /github\.com\/([^/]+)\/([^/]+)\/?$/;
const oneWeek = 7 * 24 * 60 * 60;

const thisFile = fileURLToPath(import.meta.url);
const thisDirectory = dirname(thisFile);
const mainFile = process.argv[1];
const plugins = JSON.parse(readFileSync(resolve(thisDirectory, './lib/data/plugins.json')));

const mappedPlugins = plugins.map(plugin => {
  if (!plugin.status) {
    plugin.status = 'active';
  }
  const result = githubRegex.exec(plugin.repository);
  let npm = '';
  let user = '';

  if (result) {
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

const isProduction = process.env.NODE_ENV !== 'development';
let devServer = null;

/** @type {Metalsmith} */
const metalsmith = Metalsmith(thisDirectory);

metalsmith
  .clean(isProduction)
  .watch(process.argv.includes('--watch') ? ['src', 'lib'] : false)
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
        sort: 'pubdate:desc'
      },
      docs: {
        pattern: 'docs/**/*.md',
        sort: 'order:asc'
      }
    })
  )
  .use(
    permalinks({
      match: '**/*.md',
      directoryIndex: 'index.md'
    })
  )
  .use(
    inPlace({
      pattern: '**/*.md',
      transform: 'nunjucks',
      engineOptions: {
        filters: { formatDate, split },
        root: thisDirectory,
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
        gfm: true
      }
    })
  )
  .use(toc({ levels: [2, 3] }))
  .use(
    layouts({
      transform: 'nunjucks',
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
    jsbundle({
      entries: {
        index: './lib/js/index.js'
      }
    })
  );

if (isProduction) {
  metalsmith.use(htmlMinifier());
}

if (mainFile === thisFile) {
  let t1 = performance.now();
  metalsmith.build(err => {
    if (err) {
      throw err;
    }
    console.log(`Build success in ${((performance.now() - t1) / 1000).toFixed(1)}s`);
    if (metalsmith.watch()) {
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
}

export default metalsmith;
