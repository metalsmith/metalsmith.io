'use strict';

const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');
const test = require('tape');

const site_path = path.join(__dirname, '../build');

test('build should have key files', (assert) => {
  const site_paths = [
    path.join(site_path, 'index.html'),
    path.join(site_path, 'build.css'),
    path.join(site_path, 'build.js'),
    path.join(site_path, 'build.js')
  ];

  // divider images
  for (let i = 1; i < 7; i++) {
    site_paths.push(path.join(site_path, 'metalsmith.io/images', `divider-${i}.png`));
  }

  // metalsmith logo
  site_paths.push(path.join(site_path, 'segmentio-metalsmith-logo/images', 'logo-black.svg'));
  site_paths.push(path.join(site_path, 'segmentio-metalsmith-logo/images', 'logo-white.svg'));
  site_paths.push(path.join(site_path, 'segmentio-metalsmith-logo/images', 'logo.svg'));

  site_paths.forEach((filepath) => {
    assert.doesNotThrow(() => { fs.accessSync(filepath, fs.F_OK); }, void 0, `${filepath} is present`);
  });

  assert.end();
});

test('index.html should have key elements', (assert) => {
  const index_content = fs.readFileSync(path.join(site_path, 'index.html')).toString();
  const $ = cheerio.load(index_content);

  assert.equal($('title').text(), 'Metalsmith', 'title is set correctly');
  assert.ok($('.Plugin-list li').length, 'plugin list is populated');

  assert.end();
});
