/* eslint-env jest */

const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');

const sitePath = path.join(__dirname, 'build');

test('build should have key files', () => {
  const sitePaths = [
    path.join(sitePath, 'index.html'),
    path.join(sitePath, 'index.css'),
    path.join(sitePath, 'index.js')
  ];

  // Divider images
  for (let i = 1; i < 7; i += 1) {
    sitePaths.push(path.join(sitePath, '/img', `divider-${i}.png`));
  }

  sitePaths.forEach(filePath => {
    expect(() => {
      fs.accessSync(filePath);
    }).not.toThrow();
  });
});

test('index.html should have key elements', () => {
  const indexContent = fs.readFileSync(path.join(sitePath, 'index.html')).toString();
  const $ = cheerio.load(indexContent);

  expect($('title').text()).toEqual('Metalsmith - simple, pluggable static site generator');
  expect($('.PluginList li').length).toBeGreaterThan(0);
});
