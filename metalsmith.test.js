const assert = require('assert');
const { describe, it } = require('mocha');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');
const plugins = require('./lib/data/plugins.json');

const sitePath = path.join(__dirname, 'build');

describe('metalsmith.io', () => {
  it('build should have key files', () => {
    const sitePaths = [
      path.join(sitePath, 'index.html'),
      path.join(sitePath, 'plugins', 'index.html'),
      path.join(sitePath, 'api', 'index.html'),
      path.join(sitePath, 'step-by-step', 'index.html'),
      path.join(sitePath, 'news', 'index.html'),
      path.join(sitePath, 'about', 'index.html'),
      path.join(sitePath, 'index.css'),
      path.join(sitePath, 'index.js')
    ];

    // Divider images
    for (let i = 1; i < 7; i += 1) {
      sitePaths.push(path.join(sitePath, '/img', `divider-${i}.png`));
    }

    sitePaths.forEach(filePath => {
      assert.doesNotThrow(() => {
        fs.accessSync(filePath);
      });
    });
  });

  it('index.html should have key elements', () => {
    const indexContent = fs.readFileSync(path.join(sitePath, 'index.html')).toString();
    const $ = cheerio.load(indexContent);

    assert.strictEqual($('title')[0].children[0].data, 'Metalsmith | Home');
  });

  it('plugins/index.html should have key elements', () => {
    const indexContent = fs.readFileSync(path.join(sitePath, '/plugins/index.html')).toString();
    const $ = cheerio.load(indexContent);

    assert.strictEqual($('title')[0].children[0].data, 'Metalsmith | Plugins');
    assert.strictEqual($('.PluginList li').length, plugins.length);
  });
});